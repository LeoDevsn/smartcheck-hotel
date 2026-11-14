/* BLOCO 1 — Regras de negócio. Funciona no navegador e nos testes do Node. */
(function (root) {
  "use strict";
  const exemplos = {
    1010: {
      autorizada: true,
      valorCentavos: 50000,
      observacao: "Consumo de alimentos e bebidas.",
    },
    2020: { autorizada: false, valorCentavos: 0, observacao: "" },
    3030: {
      autorizada: false,
      valorCentavos: 0,
      observacao: "Pagamento no ato do consumo.",
    },
  };
  function criarQuartos() {
    return Object.fromEntries(
      Object.entries(exemplos).map(([numero, dados]) => [numero, { ...dados }]),
    );
  }
  function validarNumero(numero) {
    const texto = String(numero).trim();
    if (!/^\d{1,6}$/.test(texto))
      throw new Error("Informe um quarto com 1 a 6 algarismos.");
    return texto;
  }
  function criarAutorizacao(autorizada, valor, observacao) {
    if (typeof autorizada !== "boolean") throw new Error("Escolha SIM ou NÃO.");
    // Um quarto não autorizado nunca conserva um valor antigo.
    const valorNumerico = autorizada ? Number(valor) : 0;
    if (
      autorizada &&
      (String(valor).trim() === "" ||
        !Number.isFinite(valorNumerico) ||
        valorNumerico < 0 ||
        valorNumerico > 1000000)
    ) {
      throw new Error("Informe um valor entre R$ 0,00 e R$ 1.000.000,00.");
    }
    if (
      autorizada &&
      Math.abs(valorNumerico * 100 - Math.round(valorNumerico * 100)) > 0.000001
    ) {
      throw new Error("Use no máximo duas casas decimais.");
    }
    const texto = String(observacao || "").trim();
    if (texto.length > 240)
      throw new Error("A observação pode ter até 240 caracteres.");
    return {
      autorizada,
      valorCentavos: Math.round(valorNumerico * 100),
      observacao: texto,
    };
  }
  function consultarQuarto(quartos, numero) {
    const chave = validarNumero(numero);
    if (!Object.prototype.hasOwnProperty.call(quartos, chave)) {
      throw new Error(
        "Quarto sem cadastro demonstrativo. Use 1010, 2020 ou 3030.",
      );
    }
    return { numero: chave, ...quartos[chave] };
  }
  function calcularImpacto(quantidade) {
    const n = Number(quantidade);
    if (!Number.isInteger(n) || n < 1 || n > 10000)
      throw new Error("Informe de 1 a 10.000 atendimentos inteiros.");
    return {
      atual: [n * 120, n * 180],
      proposto: [n * 10, n * 20],
      // Limites conservadores: menor atual − maior proposto; maior atual − menor proposto.
      economia: [n * (120 - 20), n * (180 - 10)],
    };
  }
  function duracao(segundos) {
    const minutos = Math.floor(segundos / 60),
      resto = segundos % 60;
    return `${minutos} min${resto ? ` ${resto} s` : ""}`;
  }
  function moeda(centavos) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(centavos / 100);
  }
  const api = {
    criarQuartos,
    validarNumero,
    criarAutorizacao,
    consultarQuarto,
    calcularImpacto,
    duracao,
    moeda,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.SmartCheck = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
