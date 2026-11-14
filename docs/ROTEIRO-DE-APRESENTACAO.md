# Roteiro para apresentar o caso

Apresentação de cinco slides em `apresentacao/SmartCheck_Gestores.pptx`. Público: gestores sem necessidade de conhecimento de programação.

## Slide 1 — Contexto e problema observado

“Durante minha atuação na hotelaria, observei que consultar a pré-autorização podia exigir várias telas. A estimativa que estou usando é de 2 a 3 minutos por atendimento, quando o sistema não trava. Ainda preciso validá-la com quem executa o procedimento diariamente.”

Não identificar hotel, hóspedes ou dados internos. Apresentar o caso como proposta conceitual.

## Slide 2 — Processo atual

Mostrar o caminho: quarto → resultado → detalhes → hóspede → cadastro. Se não localizar a autorização, explicar que é necessário fechar e reiniciar a consulta. Usar a simulação AS-IS para demonstrar essa repetição com os hóspedes fictícios A e B.

## Slide 3 — Solução proposta

Explicar os três campos na recepção e a autorização vinculada ao quarto. Na abertura da mesa, mostrar a janela temporária. Fechar no X e apontar que só o número do quarto e ASSINA: SIM/NÃO permanecem na área de autorização da mesa.

## Slide 4 — Comparação ilustrativa

“Para 20 atendimentos, a hipótese atual acumula 40 a 60 minutos. A meta de 10 a 20 segundos acumularia 3 minutos e 20 segundos a 6 minutos e 40 segundos. São estimativas a validar; a simulação não mede o sistema real.”

A diferença de esforço é de 33 min 20 s a 56 min 40 s, calculada por extremos. Não afirmar que esse tempo inteiro será recuperado em um turno ou que mede espera de fila. Lembrar Natal, Réveillon e Carnaval como exemplos de alta demanda.

## Slide 5 — Validação e próximos passos

Apresentar benefícios esperados: reduzir consulta repetida, tornar a informação disponível na abertura e apoiar a decisão no fechamento. Solicitar avaliação de viabilidade à TI interna ou ao fornecedor, conforme governança da empresa. Antes de implantação, validar as regras, medir tempos reais e planejar um piloto autorizado.

## Em uma entrevista de estágio

Destacar identificação do problema, mapeamento AS-IS/TO-BE, requisitos, modelagem por quarto, interface por eventos e verificação de hipóteses. Explicar a contribuição do autor no refinamento operacional e o apoio do ChatGPT no desenvolvimento. Não apresentar a retrospectiva da IA como certificação de competência e não afirmar que a aplicação contém IA em execução.
