# Análise do portfólio e plano de integração

## Inspeção realizada

Consulta somente de leitura pelo conector GitHub em 14/11/2026. A busca `user:LeoDevsn` retornou 26 repositórios acessíveis. Foram aprofundadas a raiz e o README dos candidatos relevantes abaixo. Não se afirma revisão completa do código de todos os repositórios.

| Repositório | Evidência consultada | Decisão |
| --- | --- | --- |
| `Projetos-HTML-CSS-JavaScript` | README com três projetos; pastas Calculadora de Média, Move-Click e sistema-controle-notas | Melhor destino: coleção de projetos web independentes |
| `balcao-pdv` | Raiz e README: caixa para mercearias, Python e interface web | Produto com domínio próprio; preservar |
| `orcaflow` | Raiz e README: clientes, orçamentos e agenda, Python/Flask | Produto com domínio próprio; preservar |

Não foi encontrado um repositório SmartCheck entre os resultados acessíveis. A escolha da coleção web evita misturar o estudo de hotelaria com os produtos de caixa e orçamento.

## Plano apresentado antes da implementação

1. Preparar uma nova pasta local `smartcheck-hotel`, sem alterar outros projetos.
2. Criar página responsiva em HTML, CSS e JavaScript, sem dependências de execução.
3. Separar regras por quarto da interface e explicar os blocos durante a construção.
4. Implementar AS-IS, cadastro e TO-BE com dados fictícios.
5. Incluir impacto ajustável com 10–20 s, fluxogramas e retrospectiva descritiva.
6. Entregar apresentação, documentação, guia didático e verificações.
7. Manter incorporação e publicação remotas pendentes de autorização.

## Decisão posterior do autor

Após a entrega local, o autor optou por um repositório independente, criou `LeoDevsn/smartcheck-hotel` e autorizou o envio dos arquivos. Esse é o destino adotado. A alternativa abaixo permanece apenas como registro do plano inicial; não é necessário executá-la.

## Alternativa inicial: incorporar na coleção web

Copiar a pasta completa para `Projetos-HTML-CSS-JavaScript/smartcheck-hotel/`. Não mover, renomear ou substituir as pastas existentes. No README principal, atualizar a contagem de três para quatro projetos e acrescentar:

```markdown
- [SmartCheck Hotel](smartcheck-hotel/README.md): estudo de caso conceitual de pré-autorização por quarto, com simulação ilustrativa e desenvolvimento apoiado por IA.
```

Essa é uma instrução de integração futura; nenhuma mudança foi feita no README remoto. Publicação por GitHub Pages também não foi configurada.
