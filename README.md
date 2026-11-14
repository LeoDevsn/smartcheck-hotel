# SmartCheck Hotel

**Estudo de caso conceitual e demonstração ilustrativa de pré-autorização por quarto.**

Observação do problema operacional e idealização da melhoria: **LeoDevsn**. A IA apoiou a análise, a documentação e o desenvolvimento do protótipo. As decisões de implementação tomadas pelo Codex estão identificadas separadamente dos requisitos definidos pelo autor. Não é um sistema implantado, não representa o software do hotel e não contém dados reais de hóspedes. O apoio de IA ocorreu no desenvolvimento; a aplicação não executa um modelo de IA.

## Experimentar

Extraia a pasta completa e abra `index.html` em um navegador moderno com suporte a `<dialog>`. Não é necessário instalar bibliotecas para usar a demonstração; mantenha `core.js`, `app.js` e `style.css` ao lado do HTML. Tudo funciona sem conexão depois de extrair os arquivos.

1. Em **Processo atual**, consulte o quarto `1010`, abra os detalhes e o hóspede fictício A. Sem encontrar autorização, feche o cadastro, digite o quarto novamente e consulte o hóspede fictício B.
2. Em **Recepção**, escolha `1010`, `2020` ou `3030`; informe SIM/NÃO, valor e observação opcional; salve.
3. Em **Abertura da mesa**, informe o mesmo quarto. Confira o aviso e feche no X. Lance pedidos fictícios, remova itens ou encerre a mesa.
4. Ajuste a quantidade de atendimentos para explorar o esforço acumulado estimado.

Os dados ficam na memória da aba. Recarregar restaura os exemplos; abas e computadores diferentes não compartilham alterações.

## Processo real observado pelo autor

No cenário relatado pelo autor em hotelaria, o atendente informa o quarto, acessa detalhes e abre um cadastro individual para verificar a pré-autorização de consumo. Se não localizar a informação, precisa fechar a consulta e percorrer novamente as telas até outro hóspede. A ausência de retorno direto à lista, carregamentos e travamentos ocasionais aumentam o esforço e podem contribuir para filas em alta demanda.

A referência atual de **2 a 3 minutos por atendimento**, quando o sistema não trava, é uma estimativa relatada, ainda sem validação com a equipe. Natal, Réveillon e Carnaval são exemplos de períodos em que o volume pode ampliar o impacto. Não se atribuem resultados medidos a esses períodos.

## Objetivo principal e solução conceitual proposta pelo autor

O SmartCheck nasceu da observação de LeoDevsn sobre consultas repetitivas e navegação por várias telas para verificar a pré-autorização de consumo de um quarto. A melhoria idealizada pelo autor é simplificar o cadastro na recepção e integrar a informação diretamente à abertura da mesa, eliminando consultas paralelas desnecessárias e reduzindo o tempo para iniciar o atendimento.

O projeto demonstra essa melhoria operacional de forma conceitual. Não reproduz nem implementa o sistema real do hotel.

### Regras de negócio — requisitos centrais definidos pelo autor

- A autorização de consumo é vinculada ao quarto.
- A recepção cadastra três informações: pré-autorização SIM/NÃO, valor pré-aprovado e observação opcional.
- Ao abrir a mesa e informar o quarto, o atendente recebe automaticamente um aviso com essas informações.
- Após fechar o aviso, o atendente continua lançando os pedidos.
- Na mesa permanecem visíveis o número do quarto e o indicador **ASSINA: SIM/NÃO**.
- A finalidade é facilitar a operação e reduzir o tempo necessário para iniciar o atendimento.

Esses requisitos expressam a solução idealizada por LeoDevsn. Os comportamentos técnicos abaixo foram escolhidos pelo Codex para viabilizar a demonstração e não devem ser atribuídos ao autor como requisitos operacionais nem ao funcionamento real do hotel.

### Atendimento sem quarto: passante ou pagamento na hora

Conforme esclarecimento de LeoDevsn, **a ausência de quarto não impede a abertura de uma mesa**: existe a opção de atendimento como **passante** ou com **pagamento na hora**. A proposta do SmartCheck melhora a consulta da pré-autorização quando o atendimento está vinculado a um quarto; não propõe restringir a abertura de mesas a hóspedes com quarto.

O protótipo atual demonstra somente o caminho vinculado a um quarto cadastrado e ainda não representa essas alternativas. Seu bloqueio de entrada vazia ou quarto não cadastrado é uma limitação da implementação feita pelo Codex, não uma regra da operação nem uma sugestão do autor. Ausência de quarto, quarto não cadastrado no protótipo e autorização NÃO são situações distintas.

Os detalhes de como representar passante e pagamento na hora na interface precisam ser explicados e aprovados pelo autor antes de qualquer alteração no código. A forma de integração desses caminhos ao sistema real dependeria de avaliação da operação e da equipe de TI ou do fornecedor.

## Decisões de implementação e limitações da simulação

| Escolha do Codex no protótipo | Finalidade e limite |
| --- | --- |
| O protótipo exige um dos quartos cadastrados para abrir a mesa | Limitação do caminho demonstrado pelo Codex. Não contempla passante ou pagamento na hora, opções esclarecidas pelo autor. Não significa que uma mesa real dependa de quarto. |
| Alterar a autorização com mesa aberta atualiza o indicador e reapresenta o aviso | Torna a alteração visível na demonstração. Não é uma regra original do autor para atualização de mesas reais. |
| Apenas uma mesa aberta por vez | Simplifica o estado da interface. Não representa a capacidade ou a organização do hotel. |
| Encerrar a mesa descarta os pedidos | Permite reiniciar o exercício. Não define política de exclusão, fechamento ou retenção de registros reais. |
| Valor entre R$ 0 e R$ 1.000.000, até duas casas decimais; observação de até 240 caracteres; quarto com 1 a 6 algarismos; de 1 a 10.000 atendimentos | Limites técnicos escolhidos para entradas e cálculos do protótipo; não são políticas do hotel nem requisitos originais do autor. |
| Selecionar NÃO zera o valor anterior; o campo fica desabilitado e o aviso oculta o valor | Tratamento técnico adotado pelo Codex para o valor pré-aprovado. Não estabelece como o sistema real deve armazenar ou atualizar esse dado. |
| Sem controle de saldo, débito do valor pré-aprovado ou bloqueio por limite | O protótipo apenas exibe a informação e soma os pedidos. Não implementa regras financeiras. |
| Lançamentos fictícios são permitidos com ASSINA: SIM e ASSINA: NÃO | Permite explorar a interface. Não define permissão real de consumo, assinatura ou forma de pagamento. |
| Produtos e preços fixos; soma em centavos inteiros; remoção de itens | Escolhas didáticas do Codex para ilustrar pedidos, sem cobrança, integração financeira ou catálogo real. |
| Quartos 1010, 2020 e 3030; hóspedes fictícios A e B; autorização no segundo cadastro do AS-IS | Dados inventados pelo Codex para demonstrar a repetição. Não correspondem a registros do hotel. O AS-IS é fixo; alterações na recepção alimentam apenas o TO-BE. |
| Pausas de 450 ms entre telas do AS-IS | Recurso visual acelerado, sem relação de medição com os tempos relatados. |
| Dados somente na memória da aba; recarregar restaura os exemplos | Simplificação técnica do protótipo, sem persistência ou compartilhamento entre computadores. |
| Botões selecionam o quarto fora do formulário; observação vazia fica oculta; texto usa `textContent`; janela usa `dialog` | Escolhas de interface e tratamento de dados da implementação. A seleção de quarto é contexto de edição, não um quarto campo de cadastro. |
| Entradas adicionais usadas nos testes, como quarto 9999 e valores inválidos | Casos artificiais para verificar o código; não são dados operacionais nem requisitos da proposta. |

Essas escolhas descrevem o estado atual do protótipo. Não foram homologadas como regras operacionais. Esta revisão altera somente documentação e textos dos slides; o código e o comportamento da demonstração foram preservados.

## Responsabilidades e avaliação antes de eventual implantação

| Origem ou responsável | Papel neste estudo de caso |
| --- | --- |
| LeoDevsn — observação operacional | Relato do processo real: consultas repetidas, navegação por várias telas, ausência de retorno direto à lista e esperas ocasionais. |
| LeoDevsn — solução conceitual | Idealização da melhoria e definição dos requisitos centrais descritos acima. |
| Codex, com apoio do ChatGPT | Apoio à análise e documentação; desenvolvimento do protótipo e escolhas técnicas explicitadas na seção de implementação. |
| Equipe de TI ou fornecedor, com operação e gestão | Avaliar e especificar os requisitos de uma possível implantação, sem assumir as escolhas do protótipo como regras aprovadas. |

Uma avaliação futura precisaria definir o tratamento de quarto sem cadastro, atualização de autorização com mesa aberta, mesas simultâneas, persistência e auditoria dos pedidos, limites de campos, uso do valor pré-aprovado, saldo e permissões de consumo. Também precisaria avaliar integração, sincronização, indisponibilidade, mudanças de ocupação e check-out, acessos e políticas da empresa. São pontos a avaliar, não requisitos já aprovados pelo autor ou funcionalidades reais demonstradas.

## Estimativas e cálculos

**Processo atual: 2 a 3 minutos por atendimento** é uma estimativa relatada pelo autor, sem medição formal. **Proposta: 10 a 20 segundos para o fluxo inicial** é uma meta ilustrativa definida para o estudo, não um resultado alcançado. Os cálculos abaixo apenas exploram essas hipóteses.

| Cenário | Por atendimento | Para 20 atendimentos |
| --- | --- | --- |
| Atual | 120 a 180 s | 40 a 60 min |
| Proposto — meta ilustrativa | 10 a 20 s | 3 min 20 s a 6 min 40 s |
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

O registro das correções de autoria e finalidade está em [docs/REVISAO-DE-AUTORIA.md](docs/REVISAO-DE-AUTORIA.md).

## Repositório e portfólio

Repositório independente: [LeoDevsn/smartcheck-hotel](https://github.com/LeoDevsn/smartcheck-hotel).

O autor autorizou a criação de um repositório dedicado e o envio desta entrega. Os projetos existentes foram preservados. A análise inicial de encaixe na coleção de projetos web está registrada em `docs/PLANO-E-INTEGRACAO.md` como histórico da organização proposta.

A aplicação pode ser executada localmente abrindo `index.html`. Hospedagem pública da demonstração não foi configurada.

## Limitações e próximos passos

Esta versão é um estudo conceitual. Falta validar o mapeamento com profissionais que executam o procedimento; medir tempos reais e condições de sistema; revisar a interface em navegadores e celulares; e discutir com TI interna ou fornecedor a viabilidade de associação por quarto e integração com o sistema existente.

Os pontos para avaliação de TI ou fornecedor estão separados acima dos requisitos centrais do autor. Nenhuma escolha técnica do protótipo deve ser adotada automaticamente em produção. Não insira informações confidenciais nesta demonstração.

Antes de considerar implantação, executar um piloto autorizado com critérios de validação definidos. A análise retrospectiva ao final da página foi produzida com apoio do ChatGPT e não constitui avaliação profissional independente ou certificação.
