# SmartCheck Hotel

**Estudo de caso conceitual e demonstração ilustrativa de pré-autorização por quarto.**

Autoria do caso e contexto operacional: **LeoDevsn**. Implementação e documentação preparadas com apoio do ChatGPT. Não é um sistema implantado, não representa o software do hotel e não contém dados reais de hóspedes. O apoio de IA ocorreu no desenvolvimento; a aplicação não executa um modelo de IA.

## Experimentar

Extraia a pasta completa e abra `index.html` em um navegador moderno com suporte a `<dialog>`. Não é necessário instalar bibliotecas para usar a demonstração; mantenha `core.js`, `app.js` e `style.css` ao lado do HTML. Tudo funciona sem conexão depois de extrair os arquivos.

1. Em **Processo atual**, consulte o quarto `1010`, abra os detalhes e o hóspede fictício A. Sem encontrar autorização, feche o cadastro, digite o quarto novamente e consulte o hóspede fictício B.
2. Em **Recepção**, escolha `1010`, `2020` ou `3030`; informe SIM/NÃO, valor e observação opcional; salve.
3. Em **Abertura da mesa**, informe o mesmo quarto. Confira o aviso e feche no X. Lance pedidos fictícios, remova itens ou encerre a mesa.
4. Ajuste a quantidade de atendimentos para explorar o esforço acumulado estimado.

Os dados ficam na memória da aba. Recarregar restaura os exemplos; abas e computadores diferentes não compartilham alterações.

## Problema e contexto

No cenário relatado pelo autor em hotelaria, o atendente informa o quarto, acessa detalhes e abre um cadastro individual para verificar a pré-autorização de consumo. Se não localizar a informação, precisa fechar a consulta e percorrer novamente as telas até outro hóspede. A ausência de retorno direto à lista, carregamentos e travamentos ocasionais aumentam o esforço e podem contribuir para filas em alta demanda.

A referência atual de **2 a 3 minutos por atendimento**, quando o sistema não trava, é uma estimativa relatada, ainda sem validação com a equipe. Natal, Réveillon e Carnaval são exemplos de períodos em que o volume pode ampliar o impacto. Não se atribuem resultados medidos a esses períodos.

## Solução proposta

A recepção cadastra a pré-autorização por **quarto**. Ao abrir a mesa com esse número, o atendente recebe automaticamente um aviso com autorização, valor quando aplicável e observação se preenchida. Depois de fechar o aviso, permanece na mesa apenas o quarto com **ASSINA: SIM/NÃO**, além dos pedidos simulados.

### Regras de negócio

- A autorização pertence ao quarto; o fluxo proposto não procura um hóspede individual.
- O cadastro possui três campos: SIM/NÃO, valor pré-aprovado e observação opcional. Os botões de quarto selecionam o contexto de edição, fora do formulário.
- NÃO elimina o valor anterior e apresenta “não autorizado”; a observação pode existir mesmo nesse caso.
- A observação vazia não aparece no aviso. Texto digitado é exibido como texto, nunca executado como HTML.
- Um quarto sem cadastro é sinalizado como ausente e não abre mesa. Ausência de cadastro não equivale a NÃO.
- Alterar a autorização de um quarto com mesa aberta atualiza o indicador e reapresenta o aviso.
- A demonstração usa um cadastro por quarto e uma mesa aberta por vez; encerrar descarta os pedidos da simulação.
- Valores de pedidos são somados em centavos inteiros. Não há cobrança, controle de saldo pré-aprovado ou bloqueio de consumo pelo valor.
- SIM/NÃO indica possibilidade de assinatura no cenário. NÃO não bloqueia o lançamento ilustrativo de itens; a forma real de pagamento depende de regras operacionais futuras.
- Limites de valor (R$ 0 a R$ 1.000.000), observação (240 caracteres), número (1 a 6 algarismos) e quantidade (1 a 10.000) são escolhas desta demonstração, não políticas do hotel.
- O AS-IS tem dados fixos para ensinar a repetição. Alterações na recepção alimentam exclusivamente o TO-BE.

## Estimativas e cálculos

Aplica-se **10 a 20 segundos** em todo o material, conforme a correção explícita do autor. O trecho “15 a 30 segundos” que permaneceu no documento original foi substituído pela orientação mais recente.

| Cenário | Por atendimento | Para 20 atendimentos |
| --- | --- | --- |
| Atual | 120 a 180 s | 40 a 60 min |
| Proposto | 10 a 20 s | 3 min 20 s a 6 min 40 s |
| Diferença hipotética | 100 a 170 s | 33 min 20 s a 56 min 40 s |

O limite inferior da diferença usa `atual mínimo − proposto máximo`; o superior usa `atual máximo − proposto mínimo`. As barras comparam os máximos: `20 / 180 ≈ 11,11%`. Essa proporção descreve as hipóteses de tempo, não produtividade comprovada.

Os totais representam esforço acumulado, sem travamentos. Não calculam tempo de fila, duração do turno, simultaneidade, ocupação ou resultado financeiro. A navegação é acelerada com pausas de 450 ms, sem cronômetro de desempenho. A meta ilustrativa não é resultado medido ou promessa.

## Fluxogramas

Versões editáveis em [docs/FLUXOGRAMAS.md](docs/FLUXOGRAMAS.md). A página também oferece fluxos numerados legíveis sem um renderizador Mermaid.

## Tecnologias e técnicas efetivamente utilizadas

- HTML semântico: formulários, abas, seções, `details` e `dialog` nativo.
- CSS: cores, tipografia do sistema, Grid, Flexbox e regras responsivas.
- JavaScript sem framework: objetos por quarto, funções, eventos, máquina de estados, manipulação do DOM e cálculo em centavos.
- Node.js com `node:test`: testes das regras e integração com DOM simulado por jsdom (somente desenvolvimento).
- Python com python-pptx: geração da apresentação; não é necessário para executar a aplicação.
- Modelagem AS-IS/TO-BE, refinamento de requisitos, separação entre regras e interface e validação de entradas.

Não utiliza backend, banco de dados, APIs de hotelaria, autenticação ou IA em execução. As explicações estão em [docs/GUIA-DO-CODIGO.md](docs/GUIA-DO-CODIGO.md).

## Organização

```text
smartcheck-hotel/
  index.html                         Página e elementos da simulação
  style.css                          Aparência e regras responsivas
  core.js                            Regras e cálculos independentes da interface
  app.js                             Eventos, abas e estados dos fluxos
  package.json / package-lock.json    Dependências apenas dos testes
  tests/                             Regras e integração em DOM simulado
  docs/
    GUIA-DO-CODIGO.md                 Explicação didática em blocos
    FLUXOGRAMAS.md                    AS-IS, TO-BE e circulação de dados
    PLANO-E-INTEGRACAO.md             Análise do GitHub e destino sugerido
    VALIDACAO.md                     Verificações executadas e pendentes
    ROTEIRO-DE-APRESENTACAO.md         Notas para falar com gestores
  apresentacao/
    SmartCheck_Gestores.pptx          Apresentação de cinco slides
```

## Verificações de desenvolvimento

Requer Node.js 18 ou superior e npm. A instalação é necessária somente para rodar os testes:

```sh
npm ci
npm run check
npm test
```

Veja [docs/VALIDACAO.md](docs/VALIDACAO.md) para os resultados efetivos e limites da verificação. Testes com DOM simulado não comprovam comportamento visual, foco real de modal ou funcionamento em celulares físicos.

## Repositório e portfólio

Repositório independente: [LeoDevsn/smartcheck-hotel](https://github.com/LeoDevsn/smartcheck-hotel).

O autor autorizou a criação de um repositório dedicado e o envio desta entrega. Os projetos existentes foram preservados. A análise inicial de encaixe na coleção de projetos web está registrada em `docs/PLANO-E-INTEGRACAO.md` como histórico da organização proposta.

A aplicação pode ser executada localmente abrindo `index.html`. Hospedagem pública da demonstração não foi configurada.

## Limitações e próximos passos

Esta versão é um estudo conceitual. Falta validar o mapeamento com profissionais que executam o procedimento; medir tempos reais e condições de sistema; revisar a interface em navegadores e celulares; e discutir com TI interna ou fornecedor a viabilidade de associação por quarto e integração com o sistema existente.

Uma versão operacional exigiria tratar permissões, auditoria, mudanças de ocupação e check-out, sincronização, indisponibilidade, concorrência, consentimento e políticas da empresa. Essas funcionalidades não são simuladas como se já existissem. Não insira informações confidenciais nesta demonstração.

Antes de considerar implantação, executar um piloto autorizado com critérios de validação definidos. A análise retrospectiva ao final da página foi produzida com apoio do ChatGPT e não constitui avaliação profissional independente ou certificação.
