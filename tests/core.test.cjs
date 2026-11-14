const test = require("node:test");
const assert = require("node:assert/strict");
const regras = require("../core.js");

test("editar um quarto preserva os demais e não altera os exemplos de outra sessão", () => {
  const quartos = regras.criarQuartos();
  quartos["1010"] = regras.criarAutorizacao(false, 900, "Pagamento no ato.");
  assert.deepEqual(regras.consultarQuarto(quartos, " 1010 "), {
    numero: "1010",
    autorizada: false,
    valorCentavos: 0,
    observacao: "Pagamento no ato.",
  });
  assert.equal(quartos["2020"].autorizada, false);
  assert.equal(regras.criarQuartos()["1010"].valorCentavos, 50000);
});
test("negação zera o valor e observação vazia é permitida", () => {
  assert.deepEqual(regras.criarAutorizacao(false, "valor inválido", "  "), {
    autorizada: false,
    valorCentavos: 0,
    observacao: "",
  });
  assert.equal(
    regras.criarAutorizacao(true, "123.45", "").valorCentavos,
    12345,
  );
});
test("valores inválidos e quartos ausentes são recusados", () => {
  for (const valor of ["", "NaN", "-1", "1.234", "1000000.01", Infinity]) {
    assert.throws(() => regras.criarAutorizacao(true, valor, ""));
  }
  assert.throws(() => regras.criarAutorizacao("sim", 10, ""));
  assert.throws(() => regras.criarAutorizacao(true, 10, "x".repeat(241)));
  for (const numero of ["9999", "__proto__", "10a", ""]) {
    assert.throws(() => regras.consultarQuarto(regras.criarQuartos(), numero));
  }
});
test("20 atendimentos usam 10 a 20 segundos e limites conservadores de diferença", () => {
  const resultado = regras.calcularImpacto(20);
  assert.deepEqual(resultado, {
    atual: [2400, 3600],
    proposto: [200, 400],
    economia: [2000, 3400],
  });
  assert.equal(regras.duracao(resultado.proposto[0]), "3 min 20 s");
  assert.equal(regras.duracao(resultado.proposto[1]), "6 min 40 s");
  assert.equal(regras.duracao(resultado.economia[0]), "33 min 20 s");
  assert.equal(regras.duracao(resultado.economia[1]), "56 min 40 s");
});
test("quantidade deve ser inteira e ficar nos limites da simulação", () => {
  for (const n of ["", 0, -1, 1.5, 10001, Infinity])
    assert.throws(() => regras.calcularImpacto(n));
  assert.equal(regras.calcularImpacto(10000).proposto[1], 200000);
});
