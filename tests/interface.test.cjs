const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

function iniciar() {
  const dom = new JSDOM(
    fs.readFileSync(path.join(__dirname, "../index.html"), "utf8"),
    {
      runScripts: "outside-only",
      url: "https://exemplo.invalid/",
    },
  );
  const w = dom.window;
  // jsdom não implementa dialog. O teste cobre a ligação; foco/modal real exige navegador.
  w.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new w.Event("close"));
  };
  for (const arquivo of ["core.js", "app.js"])
    w.eval(fs.readFileSync(path.join(__dirname, "..", arquivo), "utf8"));
  return { dom, w, d: w.document, $: (id) => w.document.getElementById(id) };
}
function enviar(w, elemento) {
  elemento.dispatchEvent(
    new w.Event("submit", { bubbles: true, cancelable: true }),
  );
}

test("cadastro alimenta o aviso e mesa conserva somente o indicador de autorização", () => {
  const { dom, w, d, $ } = iniciar();
  try {
    $("tab-recepcao").click();
    $("valor").value = "321.50";
    $("observacao").value = "<img src=x onerror=alert(1)>";
    enviar(w, $("cadastro"));
    $("tab-proposto").click();
    enviar(w, $("abertura"));
    assert.equal($("aviso-autorizacao").open, true);
    assert.match($("aviso-valor").textContent, /321,50/);
    assert.equal($("aviso-observacao").querySelector("img"), null);
    assert.match($("aviso-observacao").textContent, /<img/);
    $("fechar-aviso").click();
    assert.equal($("aviso-autorizacao").open, false);
    assert.equal($("mesa-assina").textContent, "ASSINA: SIM");
    assert.doesNotMatch($("mesa").textContent, /321,50|<img/);
    d.querySelector('[data-product="agua"]').click();
    d.querySelector('[data-product="cafe"]').click();
    assert.match($("total").textContent, /14,00/);
    $("pedidos").querySelector("button").click();
    assert.match($("total").textContent, /8,00/);
    $("encerrar").click();
    assert.equal($("mesa").hidden, true);
    assert.equal($("abertura").hidden, false);
  } finally {
    dom.window.close();
  }
});

test("NÃO não exibe valor; observação somente se preenchida; quarto ausente não abre mesa", () => {
  const { dom, w, d, $ } = iniciar();
  try {
    $("tab-proposto").click();
    $("quarto-mesa").value = "9999";
    enviar(w, $("abertura"));
    assert.match($("mesa-erro").textContent, /sem cadastro/);
    assert.equal($("mesa").hidden, true);
    $("quarto-mesa").value = "2020";
    enviar(w, $("abertura"));
    assert.equal($("aviso-valor").hidden, true);
    assert.equal($("aviso-observacao").hidden, true);
    assert.match($("aviso-situacao").textContent, /não autorizado/);
    $("fechar-aviso").click();
    $("encerrar").click();
    $("quarto-mesa").value = "3030";
    enviar(w, $("abertura"));
    assert.equal($("aviso-observacao").hidden, false);
    assert.match($("aviso-observacao").textContent, /Pagamento no ato/);
  } finally {
    dom.window.close();
  }
});

test("alterar autorização de uma mesa aberta atualiza indicador e reapresenta o aviso", () => {
  const { dom, w, d, $ } = iniciar();
  try {
    $("tab-proposto").click();
    enviar(w, $("abertura"));
    $("fechar-aviso").click();
    $("tab-recepcao").click();
    d.querySelector('input[value="nao"]').click();
    assert.equal($("valor").disabled, true);
    $("observacao").value = "";
    enviar(w, $("cadastro"));
    assert.equal($("painel-proposto").hidden, false);
    assert.equal($("mesa-assina").textContent, "ASSINA: NÃO");
    assert.equal($("aviso-autorizacao").open, true);
    assert.equal($("aviso-valor").hidden, true);
  } finally {
    dom.window.close();
  }
});

test("abas respondem ao teclado; estimativa inválida esconde totais antigos", () => {
  const { dom, w, d, $ } = iniciar();
  try {
    $("tab-atual").dispatchEvent(
      new w.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    assert.equal($("tab-recepcao").getAttribute("aria-selected"), "true");
    assert.equal(d.activeElement, $("tab-recepcao"));
    assert.match($("tempo-proposto").textContent, /3 min 20 s a 6 min 40 s/);
    $("quantidade").value = "1.5";
    $("quantidade").dispatchEvent(new w.Event("input"));
    assert.equal($("impacto-resultado").hidden, true);
    d.querySelector('[data-count="100"]').click();
    assert.equal($("impacto-resultado").hidden, false);
    assert.match($("tempo-proposto").textContent, /16 min 40 s a 33 min 20 s/);
  } finally {
    dom.window.close();
  }
});

test("AS-IS exige nova digitação do quarto para alcançar o segundo hóspede", async () => {
  const { dom, w, d, $ } = iniciar();
  const espera = () => new Promise((resolve) => setTimeout(resolve, 500));
  try {
    $("atual-numero").value = "1010";
    enviar(w, $("atual-busca"));
    await espera();
    $("atual-detalhes").click();
    await espera();
    $("hospede-1").click();
    await espera();
    assert.match($("hospede-autorizacao").textContent, /não localizada/);
    assert.equal($("hospede-2"), null);
    $("atual-reiniciar").click();
    assert.equal($("atual-numero").value, "");
    $("atual-numero").value = "1010";
    enviar(w, $("atual-busca"));
    await espera();
    $("atual-detalhes").click();
    await espera();
    $("hospede-2").click();
    await espera();
    assert.match($("hospede-autorizacao").textContent, /localizada: SIM/);
    assert.match($("atual-contagem").textContent, /Consultas iniciadas: 2/);
  } finally {
    dom.window.close();
  }
});
