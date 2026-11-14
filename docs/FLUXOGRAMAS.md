# Fluxos do SmartCheck Hotel

Diagramas conceituais. Não descrevem uma integração implantada. Podem ser renderizados pelo GitHub e por editores compatíveis com Mermaid.

## Processo atual — AS-IS

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

Não localizar uma autorização não equivale a uma autorização negada. Carregamentos podem ocorrer nas transições; travamentos reais não são reproduzidos. A demonstração fixa dois cadastros fictícios no quarto 1010 para evidenciar a repetição.

## Processo proposto — TO-BE

```mermaid
flowchart TD
    A[Recepção seleciona quarto] --> B[Registra SIM ou NÃO, valor e observação opcional]
    B --> C[Salva autorização vinculada ao quarto]
    C --> D[Atendente informa quarto e abre mesa]
    D --> E{Quarto cadastrado?}
    E -->|Não| F[Informar ausência de cadastro e manter mesa fechada]
    E -->|Sim| G[Abrir aviso automaticamente]
    G --> H[Exibir SIM ou NÃO; valor se SIM; observação se preenchida]
    H --> I[Atendente fecha aviso no X]
    I --> J[Mesa mostra quarto e ASSINA: SIM ou NÃO]
    J --> K[Lançar pedidos fictícios]
```

## Circulação dos dados no código

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
