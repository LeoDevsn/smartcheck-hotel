# Fluxos do SmartCheck Hotel

A observação operacional e a solução conceitual são de LeoDevsn. O Codex apoiou sua documentação e criou os fluxos técnicos do protótipo. Os diagramas não reproduzem o sistema real do hotel nem descrevem uma integração implantada. Podem ser renderizados pelo GitHub e por editores compatíveis com Mermaid.

## Processo real relatado pelo autor — AS-IS

```mermaid
flowchart TD
    A[Consultar quarto e digitar número] --> B[Abrir resultado]
    B --> C[Acessar detalhes do quarto]
    C --> D[Escolher hóspede e abrir cadastro]
    D --> E{Encontrou pré-autorização?}
    E -->|Sim| F[Usar informação no atendimento]
    E -->|Não| G[Fechar cadastro]
    G --> H{Há outro hóspede a consultar?}
    H -->|Sim| A
    H -->|Não| I[Informação não localizada nos cadastros consultados]
```

Não localizar uma autorização não equivale a uma autorização negada. Carregamentos podem ocorrer nas transições; travamentos reais não são reproduzidos. Para ilustrar esse relato, o Codex escolheu dois cadastros fictícios no quarto 1010. Essa massa de dados não é uma informação real do hotel.

## Solução conceitual definida pelo autor — TO-BE

O fluxo abaixo recorta apenas a consulta de pré-autorização para atendimento vinculado a quarto. Segundo o autor, também é possível abrir mesa sem quarto, como passante ou com pagamento na hora. Essas alternativas não são impedidas pela proposta e não estão representadas no protótipo atual.

Este fluxo contém os requisitos centrais idealizados por LeoDevsn. O tratamento de exceções deve ser avaliado antes de uma eventual implantação.

```mermaid
flowchart TD
    A[Recepção cadastra autorização por quarto] --> B[SIM ou NÃO, valor pré-aprovado e observação opcional]
    B --> C[Atendente abre mesa e informa quarto]
    C --> D[Aviso automático com informações da autorização]
    D --> E[Fechar aviso e continuar lançando pedidos]
    E --> F[Mesa mantém quarto e ASSINA: SIM ou NÃO]
```

## Fluxo técnico escolhido pelo Codex para a demonstração

O bloqueio abaixo é uma escolha do protótipo, não um requisito operacional original do autor. O mesmo se aplica à mesa única, reapresentação do aviso, descarte de pedidos e demais limitações registradas no README.

```mermaid
flowchart TD
    A[Informar quarto na demonstração] --> B{Quarto fictício cadastrado?}
    B -->|Não| C[Mostrar ausência e manter mesa fechada no protótipo]
    B -->|Sim| D[Consultar objeto na memória e abrir aviso]
    D --> E[Fechar aviso e lançar itens fictícios]
    E --> F[Encerrar a única mesa e descartar pedidos simulados]
```

## Circulação dos dados na implementação do Codex

```mermaid
flowchart LR
    A[Formulário da recepção] --> B[criarAutorizacao valida e normaliza]
    B --> C[Objeto quartos indexado pelo número]
    D[Formulário abrir mesa] --> E[consultarQuarto]
    C --> E
    E --> F[Dialog com informação temporária]
    E --> G[Indicador ASSINA na mesa]
    H[Produtos fictícios] --> I[Lista de pedidos em centavos]
    I --> J[Total ilustrativo]
```

Não existe envio a servidor: ambos os formulários acessam o mesmo objeto na memória da página. Recarregar elimina alterações.
