# Verificação da entrega

Data: 14/11/2026. Ambiente: Linux, Node.js e Python. As verificações abaixo foram executadas na entrega local. Posteriormente, o autor autorizou o envio ao repositório dedicado `LeoDevsn/smartcheck-hotel`. Hospedagem da demonstração não foi configurada.

## Verificações executadas

| Verificação | Resultado |
| --- | --- |
| Sintaxe de `core.js` e `app.js` com `node --check` | Aprovada |
| Testes com `node:test` e jsdom | 10 passaram; zero falhas |
| IDs do HTML e referências internas/ARIA | Sem duplicação ou referências ausentes |
| Vínculos locais de scripts, CSS, guia e apresentação | Arquivos de destino presentes |
| Apresentação PPTX | ZIP íntegro, cinco slides, elementos dentro dos limites de página |

## Cobertura dos 10 testes — comportamentos do protótipo

Os testes exercitam escolhas de implementação do Codex e a representação dos requisitos centrais na interface. Aprovação técnica dos testes não transforma essas escolhas em requisitos do autor ou regras aprovadas pelo hotel. Os testes e o código permanecem inalterados nesta revisão.

1. Alterar um quarto preserva os demais e não modifica os exemplos de outra sessão.
2. NÃO zera o valor e observação vazia é permitida.
3. Entradas inválidas e quartos sem cadastro são recusados.
4. Para 20 atendimentos, o proposto acumula 200–400 s; a diferença hipotética é 2.000–3.400 s.
5. A quantidade de atendimentos é inteira entre 1 e 10.000.
6. O cadastro alimenta o aviso; o texto digitado não vira HTML; a mesa conserva só o indicador na área de autorização; pedidos somam e podem ser removidos.
7. NÃO oculta o valor; observação só aparece quando preenchida; quarto ausente não abre mesa.
8. Alterar autorização de uma mesa aberta atualiza o indicador e reapresenta o aviso.
9. Navegação entre abas por teclado e tratamento de quantidade inválida.
10. O AS-IS exige nova digitação do quarto para chegar ao segundo cadastro, depois de abrir o primeiro.

## Limites da verificação

A infraestrutura de controle de navegador prevista para este ambiente não estava disponível. Não houve execução em navegador real, captura de tela, inspeção visual em celular, teste com leitores de tela ou validação do foco e da modalidade nativos do `dialog`.

Os testes de interface usam jsdom e substituem `showModal` e `close` por implementações simplificadas. Eles verificam a lógica e a atualização do DOM, não o comportamento completo do navegador. A apresentação foi verificada estruturalmente; não foi renderizada por PowerPoint ou LibreOffice, portanto a revisão visual final dos slides permanece pendente.

Não se afirma conformidade WCAG, aprovação operacional, integração com hotel, produtividade medida ou homologação. Os 2–3 min são uma estimativa relatada pelo autor, sem medição formal; os 10–20 s são uma meta ilustrativa da proposta, não um resultado alcançado. Medição e avaliação com profissionais da operação permanecem pendentes.

## Roteiro de revisão manual recomendado

1. Extrair o pacote e abrir `index.html` em Chrome, Edge, Firefox ou Safari atual.
2. Revisar em largura de computador e celular: legibilidade, rolagem e ausência de cortes.
3. Executar a consulta AS-IS em A e depois B, repetindo a digitação do quarto.
4. Editar 1010 para SIM com valor e observação; abrir mesa, ler aviso e fechar no X e com Escape.
5. Editar 2020 para NÃO sem observação e 3030 para NÃO com observação; verificar as diferenças nos avisos.
6. Tentar quarto 9999; confirmar o aviso de ausência sem confundi-lo com autorização negada.
7. Usar teclado nas abas, formulários e modal; verificar foco visível, fechamento e retorno aos produtos.
8. Lançar água e café, remover um item e encerrar a mesa. Não deve ocorrer cobrança ou persistência.
9. Confirmar a faixa proposta para 20 e 100 atendimentos; tentar zero e quantidade fracionária.
10. Abrir os cinco slides em PowerPoint ou aplicativo compatível e revisar fontes, quebras de linha e alinhamentos.
