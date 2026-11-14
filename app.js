/* BLOCO 2 — Estado da demonstração e ligação com os elementos HTML. */
"use strict";
const regras = window.SmartCheck;
const $ = (id) => document.getElementById(id);
const quartos = regras.criarQuartos();
let quartoEditado = "1010";
let mesaAberta = null;
const produtos = {
  agua: { nome: "Água", centavos: 600 },
  cafe: { nome: "Café", centavos: 800 },
  lanche: { nome: "Lanche", centavos: 2400 },
};

/* BLOCO 3 — Abas acessíveis: um painel visível e navegação por teclado. */
const abas = Array.from(document.querySelectorAll("[data-tab]"));
function selecionarAba(aba, focar = false) {
  abas.forEach((botao) => {
    const ativa = botao === aba;
    botao.setAttribute("aria-selected", String(ativa));
    botao.tabIndex = ativa ? 0 : -1;
    $(`painel-${botao.dataset.tab}`).hidden = !ativa;
  });
  if (focar) aba.focus();
}
abas.forEach((aba, indice) => {
  aba.addEventListener("click", () => selecionarAba(aba));
  aba.addEventListener("keydown", (evento) => {
    let destino;
    if (evento.key === "ArrowRight") destino = (indice + 1) % abas.length;
    if (evento.key === "ArrowLeft")
      destino = (indice + abas.length - 1) % abas.length;
    if (evento.key === "Home") destino = 0;
    if (evento.key === "End") destino = abas.length - 1;
    if (destino !== undefined) {
      evento.preventDefault();
      selecionarAba(abas[destino], true);
    }
  });
});

/* BLOCO 4 — Recepção: os três campos alteram o objeto do quarto. */
function sincronizarValor() {
  const sim = $("cadastro").elements.autorizada.value === "sim";
  $("valor").disabled = !sim;
  $("valor").required = sim;
  if (!sim) $("valor").value = "";
}
function carregarCadastro(numero) {
  quartoEditado = numero;
  const dados = quartos[numero];
  $("recepcao-quarto").textContent = `Quarto ${numero}`;
  $("cadastro").elements.autorizada.value = dados.autorizada ? "sim" : "nao";
  $("valor").value = dados.autorizada
    ? (dados.valorCentavos / 100).toFixed(2)
    : "";
  $("observacao").value = dados.observacao;
  $("cadastro-status").textContent = "";
  sincronizarValor();
  document
    .querySelectorAll("[data-room]")
    .forEach((botao) =>
      botao.setAttribute("aria-pressed", String(botao.dataset.room === numero)),
    );
}
document
  .querySelectorAll("[data-room]")
  .forEach((botao) =>
    botao.addEventListener("click", () => carregarCadastro(botao.dataset.room)),
  );
$("cadastro").addEventListener("change", sincronizarValor);
$("cadastro").addEventListener("submit", (evento) => {
  evento.preventDefault();
  try {
    quartos[quartoEditado] = regras.criarAutorizacao(
      $("cadastro").elements.autorizada.value === "sim",
      $("valor").value,
      $("observacao").value,
    );
    $("cadastro-status").textContent =
      `Autorização do quarto ${quartoEditado} salva nesta demonstração. Consulte na abertura da mesa.`;
    // Se uma mesa desse quarto já estiver aberta, atualiza o indicador e reapresenta o aviso.
    if (mesaAberta && mesaAberta.numero === quartoEditado) {
      selecionarAba($("tab-proposto"));
      renderizarMesa();
      mostrarAviso();
    }
  } catch (erro) {
    $("cadastro-status").textContent = erro.message;
  }
});

/* BLOCO 5 — A mesa consulta o quarto e abre um dialog nativo. */
const dialog = $("aviso-autorizacao");
function mostrarAviso() {
  const dados = regras.consultarQuarto(quartos, mesaAberta.numero);
  $("aviso-titulo").textContent = `Quarto ${dados.numero}`;
  $("aviso-situacao").textContent = dados.autorizada
    ? "Pré-autorização: SIM"
    : "Pré-autorização: NÃO — não autorizado";
  $("aviso-valor").hidden = !dados.autorizada;
  $("aviso-valor").textContent = dados.autorizada
    ? `Valor pré-aprovado: ${regras.moeda(dados.valorCentavos)}`
    : "";
  $("aviso-observacao").hidden = !dados.observacao;
  // textContent mostra a observação como texto, sem executar HTML digitado.
  $("aviso-observacao").textContent = dados.observacao
    ? `Observação: ${dados.observacao}`
    : "";
  if (!dialog.open) dialog.showModal();
  $("fechar-aviso").focus();
}
$("abertura").addEventListener("submit", (evento) => {
  evento.preventDefault();
  try {
    const dados = regras.consultarQuarto(quartos, $("quarto-mesa").value);
    mesaAberta = { numero: dados.numero, pedidos: [] };
    $("mesa-erro").textContent = "";
    $("mesa-status").textContent = "";
    $("abertura").hidden = true;
    renderizarMesa();
    mostrarAviso();
  } catch (erro) {
    $("mesa-erro").textContent = erro.message;
  }
});
$("fechar-aviso").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () =>
  document.querySelector('[data-product="agua"]').focus(),
);

/* BLOCO 6 — Pedidos: valores em centavos e nenhuma cobrança real. */
function renderizarMesa() {
  $("mesa").hidden = !mesaAberta;
  if (!mesaAberta) return;
  const dados = regras.consultarQuarto(quartos, mesaAberta.numero);
  $("mesa-quarto").textContent = `QUARTO ${mesaAberta.numero}`;
  $("mesa-assina").textContent = `ASSINA: ${dados.autorizada ? "SIM" : "NÃO"}`;
  $("mesa-assina").classList.toggle("negativa", !dados.autorizada);
  const lista = $("pedidos");
  lista.replaceChildren();
  if (!mesaAberta.pedidos.length) {
    const vazio = document.createElement("li");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum pedido lançado. Escolha um item acima.";
    lista.append(vazio);
  }
  mesaAberta.pedidos.forEach((pedido, indice) => {
    const li = document.createElement("li");
    const texto = document.createElement("span");
    texto.textContent = `${pedido.nome} · ${regras.moeda(pedido.centavos)}`;
    const remover = document.createElement("button");
    remover.type = "button";
    remover.className = "text-button";
    remover.textContent = "Remover";
    remover.setAttribute(
      "aria-label",
      `Remover ${pedido.nome}, pedido ${indice + 1}`,
    );
    remover.addEventListener("click", () => {
      mesaAberta.pedidos.splice(indice, 1);
      renderizarMesa();
      $("mesa-status").textContent =
        `${pedido.nome} removido. Total: ${$("total").textContent}.`;
      document.querySelector('[data-product="agua"]').focus();
    });
    li.append(texto, remover);
    lista.append(li);
  });
  $("total").textContent = regras.moeda(
    mesaAberta.pedidos.reduce((soma, pedido) => soma + pedido.centavos, 0),
  );
}
document.querySelectorAll("[data-product]").forEach((botao) =>
  botao.addEventListener("click", () => {
    if (!mesaAberta || dialog.open) return;
    const produto = produtos[botao.dataset.product];
    mesaAberta.pedidos.push({ ...produto });
    renderizarMesa();
    $("mesa-status").textContent =
      `${produto.nome} adicionado. Total: ${$("total").textContent}.`;
  }),
);
$("encerrar").addEventListener("click", () => {
  mesaAberta = null;
  $("mesa").hidden = true;
  $("abertura").hidden = false;
  $("mesa-status").textContent =
    "Mesa simulada encerrada. Nenhuma cobrança foi realizada.";
  $("quarto-mesa").focus();
});

/* BLOCO 7 — AS-IS: uma máquina de estados ilustra a consulta repetida. */
let etapaAtual = "consulta";
let hospedeEscolhido = null;
let consultados = new Set();
let buscas = 0;
let carregando = false;
function renderizarAtual() {
  const tela = $("atual-tela");
  $("atual-etapa").textContent = {
    consulta: "Consulta",
    resultado: "Resultado",
    detalhes: "Lista de hóspedes",
    cadastro: "Cadastro individual",
  }[etapaAtual];
  if (etapaAtual === "consulta") {
    tela.innerHTML =
      '<h4>Consultar quarto</h4><form id="atual-busca"><label for="atual-numero">Número do quarto fictício</label><input id="atual-numero" type="text" inputmode="numeric" maxlength="6" placeholder="Digite 1010" required><button class="button" type="submit">Consultar quarto</button><p id="atual-erro" role="alert"></p></form>';
    $("atual-busca").addEventListener("submit", (evento) => {
      evento.preventDefault();
      if ($("atual-numero").value.trim() !== "1010") {
        $("atual-erro").textContent =
          "Este cenário guiado usa o quarto fictício 1010.";
        return;
      }
      avancarAtual("resultado", () => {
        buscas += 1;
      });
    });
  } else if (etapaAtual === "resultado") {
    tela.innerHTML =
      '<h4>Quarto 1010 encontrado</h4><p>Dois hóspedes fictícios vinculados ao quarto.</p><button class="button" id="atual-detalhes" type="button">Abrir detalhes do quarto</button>';
    $("atual-detalhes").addEventListener("click", () =>
      avancarAtual("detalhes"),
    );
  } else if (etapaAtual === "detalhes") {
    tela.innerHTML =
      '<h4>Hóspedes do quarto 1010</h4><p>Escolha um cadastro individual.</p><div class="guest-list"><button type="button" id="hospede-1">Hóspede fictício A <span>→</span></button><button type="button" id="hospede-2">Hóspede fictício B <span>→</span></button></div><p class="caption" id="consultados"></p>';
    $("consultados").textContent = consultados.size
      ? `Já consultado nesta rodada: ${Array.from(consultados)
          .map((n) => (n === 1 ? "A" : "B"))
          .join(", ")}.`
      : "Nenhum cadastro consultado nesta rodada.";
    [1, 2].forEach((n) =>
      $(`hospede-${n}`).addEventListener("click", () =>
        avancarAtual("cadastro", () => {
          hospedeEscolhido = n;
          consultados.add(n);
        }),
      ),
    );
  } else {
    tela.innerHTML =
      '<h4 id="hospede-titulo"></h4><p id="hospede-autorizacao"></p><p class="caption">Não há retorno direto à lista neste cenário. Para abrir outro cadastro, feche e reinicie a consulta.</p><button class="button" id="atual-reiniciar" type="button">Fechar e consultar quarto novamente</button>';
    $("hospede-titulo").textContent =
      `Cadastro do hóspede fictício ${hospedeEscolhido === 1 ? "A" : "B"}`;
    $("hospede-autorizacao").textContent =
      hospedeEscolhido === 1
        ? "Pré-autorização não localizada neste cadastro."
        : "Pré-autorização localizada: SIM · R$ 500,00. Consulta ilustrativa concluída.";
    $("atual-reiniciar").addEventListener("click", () => {
      etapaAtual = "consulta";
      renderizarAtual();
      $("atual-numero").focus();
    });
  }
  $("atual-contagem").textContent =
    `Consultas iniciadas: ${buscas}. Espera de demonstração: 0,45 s entre telas; sem relação com a estimativa real.`;
}
function avancarAtual(etapa, antes = () => {}) {
  if (carregando) return;
  carregando = true;
  const tela = $("atual-tela");
  tela.setAttribute("aria-busy", "true");
  tela.innerHTML =
    '<p class="loading" role="status">Carregando tela fictícia…</p>';
  window.setTimeout(() => {
    antes();
    etapaAtual = etapa;
    carregando = false;
    tela.removeAttribute("aria-busy");
    renderizarAtual();
    const destino = tela.querySelector("h4");
    if (destino && !$("painel-atual").hidden) {
      destino.tabIndex = -1;
      destino.focus();
    }
  }, 450);
}

/* BLOCO 8 — Estimativas: multiplicação de faixas, sem métricas reais. */
function atualizarImpacto() {
  try {
    const resultado = regras.calcularImpacto($("quantidade").value);
    const faixa = (limites) => limites.map(regras.duracao).join(" a ");
    $("tempo-atual").textContent = faixa(resultado.atual);
    $("tempo-proposto").textContent = faixa(resultado.proposto);
    $("tempo-economia").textContent = faixa(resultado.economia);
    $("impacto-erro").textContent = "";
    $("impacto-resultado").hidden = false;
  } catch (erro) {
    $("impacto-erro").textContent = erro.message;
    $("impacto-resultado").hidden = true;
  }
}
$("quantidade").addEventListener("input", atualizarImpacto);
document.querySelectorAll("[data-count]").forEach((botao) =>
  botao.addEventListener("click", () => {
    $("quantidade").value = botao.dataset.count;
    atualizarImpacto();
  }),
);
carregarCadastro("1010");
renderizarAtual();
atualizarImpacto();
