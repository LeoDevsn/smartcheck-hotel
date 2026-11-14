# Entenda o SmartCheck em blocos

Este guia acompanha o código entregue. Você pode usar a busca do editor por `BLOCO` para encontrar as partes correspondentes. Os trechos abaixo são recortes explicativos das funções reais; abra os arquivos para ver o contexto completo.

## Autoria e finalidade das decisões

A melhoria operacional e seus requisitos centrais foram idealizados por **LeoDevsn**, a partir de sua observação do trabalho em hotelaria. A IA apoiou a análise, a documentação e o desenvolvimento. A associação por quarto, os três campos da recepção, o aviso automático e o indicador ASSINA: SIM/NÃO expressam a proposta do autor.

Os objetos, validações, limites, bloqueio de quarto sem cadastro, reapresentação do aviso, mesa única, descarte de pedidos, tratamento numérico do valor e dados fictícios descritos neste guia são **decisões do Codex para implementar o protótipo**. Não descrevem o funcionamento real do hotel nem requisitos operacionais definidos pelo autor. A classificação completa está no README, em “Decisões de implementação e limitações da simulação”.

Antes de eventual implantação, operação, gestão e TI ou fornecedor precisariam avaliar esses comportamentos e especificar as regras adequadas. O guia explica o código existente; esta revisão documental não altera a demonstração.

## 1. O papel de cada arquivo

O **HTML** organiza os elementos: campos, botões, painéis e janela. O **CSS** define cores, espaçamento e adaptação à largura da tela. O **JavaScript** responde às ações e muda os dados e elementos.

`core.js` reúne a modelagem da autorização por quarto, validações e cálculos do protótipo, que não dependem de botões ou campos. Nem toda validação nesse arquivo é um requisito do autor. `app.js` liga essas regras à página. Como o HTML carrega os dois scripts com `defer`, o navegador espera a estrutura da página ficar pronta e executa os scripts na ordem: primeiro as regras, depois a interface.

```html
<script src="core.js" defer></script>
<script src="app.js" defer></script>
```

Não há framework ou etapa de compilação. Para executar, basta extrair todos os arquivos e abrir o HTML. Node e jsdom servem apenas para os testes.

## 2. Dados organizados por quarto — `core.js`, bloco 1

```js
const exemplos = {
  '1010': {
    autorizada: true,
    valorCentavos: 50000,
    observacao: 'Consumo de alimentos e bebidas.'
  },
  // Outros quartos fictícios aparecem no arquivo completo.
};
```

Um **objeto** agrupa informações. A chave `'1010'` é o número do quarto; seu conteúdo é outro objeto com três propriedades. `true` significa SIM e `false` significa NÃO: são valores **booleanos**. O valor `50000` representa R$ 500,00 em centavos.

O número é texto porque identifica um quarto; não é uma quantidade para somar. O formato preserva eventuais zeros iniciais. Na demonstração só existem 1010, 2020 e 3030.

```js
const quartos = regras.criarQuartos();
```

Essa função cria cópias dos exemplos para a página. Cada execução começa com dados próprios. Não existe cadastro de hóspede no fluxo proposto, pois a regra é por quarto.

## 3. Validar e salvar — `core.js` e `app.js`, bloco 4

```js
quartos[quartoEditado] = regras.criarAutorizacao(
  $('cadastro').elements.autorizada.value === 'sim',
  $('valor').value,
  $('observacao').value
);
```

`quartoEditado` guarda o contexto escolhido nos botões 1010, 2020 e 3030. Os colchetes acessam a propriedade correspondente. O lado direito valida o formulário e produz o objeto que será salvo nessa propriedade.

`=== 'sim'` compara o valor da seleção com o texto `'sim'`; o resultado é um booleano. A função `criarAutorizacao` verifica valor, casas decimais e tamanho da observação. Por escolha do Codex para este protótipo, se a autorização é NÃO, o valor normalizado é zero. Esse tratamento do valor não foi definido pelo autor como regra operacional.

```js
$('cadastro').addEventListener('submit', (evento) => {
  evento.preventDefault();
  // Validação, gravação em quartos e mensagem ao usuário.
});
```

`addEventListener` registra o que fazer quando acontece um **evento**. `submit` é o envio do formulário. `preventDefault()` impede que o navegador recarregue a página, pois a simulação trata os dados localmente.

`$` é apenas uma função curta que usamos para `document.getElementById`. Não é jQuery. `try/catch` permite capturar uma falha de validação e mostrar sua mensagem sem interromper toda a página.

**Experimento:** salve uma observação no 2020. Consulte o 1010: a alteração não aparece nele. Cada chave mantém seu próprio cadastro.

## 4. Como o cadastro chega à mesa — `app.js`, bloco 5

```js
const dados = regras.consultarQuarto(quartos, $('quarto-mesa').value);
mesaAberta = { numero: dados.numero, pedidos: [] };
renderizarMesa();
mostrarAviso();
```

Os formulários da recepção e da mesa compartilham a variável `quartos`. A função `consultarQuarto` lê exatamente o número informado, valida o formato e recusa números sem cadastro. Essa recusa é uma escolha do Codex para limitar a demonstração; não faz parte dos requisitos centrais definidos pelo autor.

`mesaAberta` é o **estado** da mesa: número do quarto e lista de pedidos. `null` indica que não há mesa aberta. A interface usa esse estado para saber o que exibir.

Os dados não “viajam” por internet. Tudo está na mesma aba. Em um sistema real, seria necessário um servidor ou integração para que a recepção e o atendimento em equipamentos diferentes consultassem dados sincronizados.

## 5. A janela automática — `app.js`, bloco 5

```js
$('aviso-valor').hidden = !dados.autorizada;
$('aviso-observacao').hidden = !dados.observacao;
$('aviso-observacao').textContent = dados.observacao
  ? `Observação: ${dados.observacao}` : '';
if (!dialog.open) dialog.showModal();
```

`hidden` oculta um elemento. O `!` significa negação: se não está autorizado, ocultar o valor. Uma observação vazia também é ocultada. O **operador ternário** `condição ? opção1 : opção2` escolhe o texto de acordo com a condição.

`textContent` coloca texto na página sem interpretá-lo como HTML. Isso é importante porque a observação é digitada pelo usuário.

`dialog` é o elemento HTML nativo de janela modal. `showModal()` abre a janela; o X chama `dialog.close()`. O navegador também permite fechá-la com Escape. Depois, o código direciona o foco ao primeiro produto. O comportamento real de foco precisa de validação em navegador; os testes automatizados usam uma simulação do dialog.

```js
$('mesa-assina').textContent = `ASSINA: ${dados.autorizada ? 'SIM' : 'NÃO'}`;
```

A função `renderizarMesa()` preenche só o indicador na área de autorização da mesa. O valor e a observação permanecem no dialog fechado. Se você editar a autorização de uma mesa aberta, o código atualiza o indicador e abre o aviso novamente. Reapresentar esse aviso foi uma decisão do Codex para o protótipo, não um requisito operacional original do autor.

## 6. Pedidos e total — `app.js`, bloco 6

```js
mesaAberta.pedidos.push({ ...produto });
const total = mesaAberta.pedidos.reduce(
  (soma, pedido) => soma + pedido.centavos, 0
);
```

`pedidos` é um **array**, uma lista. `push` acrescenta um item. `{ ...produto }` cria uma cópia do produto. `reduce` percorre a lista, acumulando a soma, começando em zero. No arquivo real, essa expressão é passada a `regras.moeda` para exibir o total.

Água custa 600 centavos e café custa 800. A soma é 1400, exibida como R$ 14,00. Inteiros evitam alguns problemas de arredondamento de valores decimais em JavaScript.

Cada botão Remover exclui a posição correspondente da lista e redesenha o total. Por simplificação escolhida pelo Codex, há uma única mesa aberta por vez e encerrá-la descarta os pedidos fictícios. A demonstração permite itens com SIM ou NÃO, não controla saldo, não debita o valor autorizado e não realiza cobrança. Esses comportamentos não estabelecem regras reais de consumo, pagamento ou retenção de registros.

## 7. AS-IS como máquina de estados — `app.js`, bloco 7

```js
let etapaAtual = 'consulta';
let hospedeEscolhido = null;
let consultados = new Set();
let buscas = 0;
```

Uma **máquina de estados** organiza as telas possíveis. Aqui elas são `consulta`, `resultado`, `detalhes` e `cadastro`. `renderizarAtual()` escolhe o conteúdo conforme o estado.

Um `Set` registra quais hóspedes já foram consultados, sem repeti-los. Isso orienta a próxima tentativa, mas não fornece um atalho para a lista: depois de abrir um cadastro individual, o único caminho oferecido é fechar e digitar o quarto de novo.

```js
window.setTimeout(() => {
  antes();
  etapaAtual = etapa;
  carregando = false;
  tela.removeAttribute('aria-busy');
  renderizarAtual();
  // Em seguida, o arquivo completo ajusta o foco.
}, 450);
```

`setTimeout` agenda uma ação após 450 milissegundos. Essa espera é artificial e acelerada. Não representa nem mede os 2–3 minutos relatados. `carregando` impede cliques duplicados durante a transição.

O hóspede fictício A não tem a informação no cadastro; o B tem. Esse cenário fixo existe para ensinar o custo da navegação repetida. O cadastro da recepção altera o TO-BE, não esse cenário didático fixo. Os dados A/B e os valores foram criados pelo Codex; não são registros históricos do hotel.

## 8. Comparação de impacto — `core.js` e `app.js`, bloco 8

```js
return {
  atual: [n * 120, n * 180],
  proposto: [n * 10, n * 20],
  economia: [n * (120 - 20), n * (180 - 10)]
};
```

`n` é a quantidade de atendimentos. Cada array contém limite mínimo e máximo, em segundos. Para 20 atendimentos, o proposto é de 200 a 400 segundos: 3 min 20 s a 6 min 40 s.

A diferença usa os extremos conservadores. O menor ganho hipotético é o menor tempo atual menos o maior proposto. O maior é o maior atual menos o menor proposto. Essa conta resulta em 33 min 20 s a 56 min 40 s para 20 atendimentos.

Não é um resultado observado. Não permite afirmar produtividade, redução real de fila ou retorno financeiro. A faixa atual de 2–3 min é uma estimativa relatada, sem medição formal; a de 10–20 s é uma meta ilustrativa para o fluxo inicial. Ambas precisam de avaliação operacional, e a meta não é resultado alcançado.

## 9. Abas e adaptação visual

`selecionarAba()` oculta os outros painéis e atualiza `aria-selected`. As setas, Home e End permitem navegar entre as abas pelo teclado. Isso é diferente dos estados internos do AS-IS: a aba escolhe a experiência; a máquina de estados escolhe a tela dentro da experiência.

No CSS, Grid e Flexbox organizam colunas e alinhamentos. As regras `@media` mudam a composição para telas menores. `:focus-visible` mostra o foco do teclado e `prefers-reduced-motion` desativa a rolagem suave quando solicitada pelo usuário.

Esses recursos são cuidados de implementação; não equivalem a uma certificação de acessibilidade. A inspeção visual e o uso com tecnologias assistivas continuam pendentes.

## 10. Como os testes ajudam

`tests/core.test.cjs` verifica regras sem interface: quartos independentes, NÃO zerando valor, entradas inválidas e faixas de tempo. `tests/interface.test.cjs` executa os scripts em um DOM simulado com jsdom para verificar a passagem dos dados do cadastro ao aviso, os pedidos e o reinício do AS-IS.

Esses testes verificam o comportamento programado pelo Codex para a demonstração; não validam os requisitos junto à operação nem aprovam as escolhas técnicas para uso real. Também não confirmam a aparência, o dialog real, o teclado virtual ou o uso em celular físico. Consulte `VALIDACAO.md` para o que foi efetivamente executado.

## Continue estudando

1. Mude a observação do 3030 e veja que ela aparece mesmo com NÃO.
2. Apague essa observação, salve e veja que a linha some do aviso.
3. Abra 1010, lance água e café e confira R$ 14,00; remova a água e confira R$ 8,00.
4. Altere para 50 atendimentos e refaça as multiplicações em segundos.
5. Recarregue a página e observe a restauração dos dados. Pense no papel que um banco de dados teria em uma versão futura.

O apoio de IA ajudou a traduzir o relato em código e explicações. A revisão das regras pelo autor e a validação com profissionais continuam essenciais para aproximar a proposta do processo real.
