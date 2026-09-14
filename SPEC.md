# SRM Credit Engine — Especificação Inicial

## 1. Objetivo

O SRM Credit Engine tem como objetivo permitir a simulação e a liquidação de recebíveis, considerando o tipo do título, o prazo, o risco representado pelo spread e a moeda de pagamento.

O sistema deve permitir operações em BRL e USD, mantendo precisão nos cálculos financeiros, rastreabilidade das liquidações e proteção contra duplicidades.

Este documento registra as principais premissas adotadas durante o desenvolvimento, principalmente nos pontos em que o enunciado deixa espaço para mais de uma interpretação.

---

## 2. Premissas adotadas

### 2.1 Prazo utilizado no cálculo

A fórmula de valor presente utiliza um prazo, mas o enunciado não define completamente como esse prazo deve ser calculado a partir da data de vencimento.

Para esta implementação, será considerado o prazo em meses inteiros entre a data da operação e a data de vencimento.

Essa decisão também aproxima o comportamento da aplicação dos golden cases fornecidos no desafio, que utilizam meses inteiros.

Em um cenário real, eu confirmaria com o negócio se o prazo deve ser calculado em meses inteiros, dias corridos, dias úteis ou de forma proporcional.

### 2.2 Conversão da data de vencimento para prazo

O usuário informará uma data de vencimento, enquanto o motor de precificação trabalha com um prazo.

A aplicação será responsável por transformar a data de vencimento em quantidade de meses antes de executar o cálculo.

Para simplificar o escopo inicial, vencimentos anteriores à data da operação não serão aceitos.

Caso a data resulte em um prazo que não corresponda exatamente a meses inteiros, a regra deverá ser revisada com o negócio antes de uma utilização em produção.

### 2.3 Taxa base

O enunciado utiliza uma taxa base na fórmula, mas não define qual deve ser sua origem na operação normal do sistema.

Para esta implementação, será utilizada uma taxa base de 1,00% ao mês, seguindo a referência utilizada nos golden cases.

A taxa será tratada de forma isolada da lógica principal para facilitar uma futura mudança para um valor configurável ou armazenado no banco.

Em um cenário real, eu perguntaria se essa taxa vem de uma configuração interna, índice financeiro, tabela do banco ou algum serviço externo.

### 2.4 Spread por tipo de recebível

Cada tipo de recebível possui um spread específico:

- Duplicata Mercantil: 1,5% ao mês.
- Cheque Pré-datado: 2,5% ao mês.

Essas regras serão implementadas utilizando o padrão Strategy, evitando que a lógica de precificação fique concentrada em condicionais dentro de um único serviço.

Para o escopo atual, os spreads serão considerados regras fixas do domínio.

Caso esses valores precisem ser alterados frequentemente pelo negócio, eles poderão futuramente ser movidos para uma configuração ou estrutura persistida.

### 2.5 Precisão dos valores monetários

Valores financeiros não serão representados utilizando `float` ou `double`.

No backend Java, será utilizado `BigDecimal` para valores monetários, taxas, spreads e câmbio.

No banco de dados, serão utilizados tipos `NUMERIC` ou `DECIMAL`, com precisão adequada para valores monetários e taxas cambiais.

A intenção é evitar erros de ponto flutuante que possam gerar diferenças de centavos durante os cálculos.

### 2.6 Arredondamento

A política adotada será `HALF_EVEN`, também conhecida como banker's rounding.

Os valores monetários apresentados como resultado terão duas casas decimais.

O arredondamento será feito apenas no momento definido pela regra financeira, evitando arredondamentos desnecessários durante etapas intermediárias.

Nos golden cases, será seguida exatamente a regra especificada pelo desafio.

No caso de pagamento em USD, o valor presente em BRL será arredondado antes da conversão cambial, conforme definido nos casos de aferição.

### 2.7 Taxa de câmbio

O sistema poderá possuir várias taxas de câmbio registradas ao longo do tempo, cada uma com sua própria data e hora de vigência.

Para esta implementação, a liquidação utilizará a taxa vigente mais recente disponível no momento em que a operação for confirmada.

Por exemplo:

- 10:00: USD = R$ 5,40
- 11:00: USD = R$ 5,45
- liquidação realizada às 11:30

Nesse caso, será utilizada a cotação de R$ 5,45.

A taxa efetivamente usada será registrada junto à liquidação para permitir auditoria futura.

### 2.8 Simulação e liquidação

A simulação não será considerada uma garantia do valor final da operação.

Se a taxa de câmbio mudar entre o momento da simulação e o momento da liquidação, o sistema utilizará a taxa vigente na liquidação e recalculará o valor.

Exemplo:

- usuário simula com USD a R$ 5,40;
- antes da confirmação, a cotação passa para R$ 5,45;
- a liquidação será feita utilizando R$ 5,45.

Essa decisão evita utilizar uma taxa antiga sem que exista uma regra explícita de reserva ou travamento de câmbio.

Em um sistema real, eu confirmaria com o negócio se a cotação exibida durante a simulação deve ser congelada durante algum período.

### 2.9 Conversão de BRL para USD

Para esta implementação, a cotação será interpretada no formato:

`1 USD = X BRL`

Exemplo:

`1 USD = R$ 5,00`

Assim, para converter R$ 1.000,00 para USD:

`1000 / 5 = USD 200`

Portanto, pagamentos em USD serão calculados dividindo o valor presente em BRL pela cotação vigente.

### 2.10 Moedas suportadas

O escopo inicial da aplicação será limitado a:

- BRL
- USD

Apesar de o contexto mencionar uma operação multimoedas, não serão adicionadas outras moedas sem uma necessidade específica.

A estrutura deverá, porém, evitar dependências desnecessárias que impeçam uma expansão futura.

### 2.11 Liquidação do recebível

Para esta implementação, cada recebível poderá ser liquidado integralmente apenas uma vez.

Liquidações parciais não fazem parte do escopo atual.

Isso significa que um recebível já liquidado não poderá gerar uma nova liquidação.

Em um cenário real, eu confirmaria com o negócio se existem pagamentos parciais, antecipações fracionadas ou outras formas de liquidação.

### 2.12 Idempotência

O endpoint de liquidação deverá ser idempotente.

Isso significa que uma mesma solicitação repetida não poderá gerar duas liquidações.

Um exemplo simples seria um usuário clicar duas vezes no botão de confirmação ou o frontend reenviar a mesma requisição após uma falha de rede.

A aplicação utilizará uma `Idempotency-Key`, enviada pelo cliente e armazenada junto à operação.

A chave terá uma restrição de unicidade no banco de dados.

Ao receber novamente uma requisição com a mesma chave, o sistema não criará uma nova liquidação.

Também será considerada inválida a tentativa de reutilizar uma mesma chave de idempotência para uma operação com dados diferentes.

### 2.13 Transação e consistência

A liquidação envolve mais de uma alteração no banco.

Por exemplo:

1. registrar a liquidação;
2. alterar o estado do recebível para liquidado.

Essas operações deverão acontecer dentro da mesma transação.

Se qualquer etapa falhar, toda a operação deverá ser desfeita.

Isso evita situações em que uma liquidação seja criada, mas o recebível continue sendo considerado disponível para nova liquidação.

### 2.14 Auditabilidade

Toda liquidação deverá guardar informações suficientes para explicar como seu valor foi obtido.

Serão registrados, no mínimo:

- recebível relacionado;
- cedente;
- valor de face;
- tipo do recebível;
- prazo utilizado;
- taxa base utilizada;
- spread utilizado;
- valor presente calculado;
- deságio;
- moeda de pagamento;
- taxa de câmbio utilizada, quando aplicável;
- data e hora da liquidação;
- chave de idempotência.

Uma liquidação concluída será considerada imutável do ponto de vista da aplicação.

Não serão disponibilizados endpoints para editar ou excluir uma liquidação já registrada.

### 2.15 Datas e horário

Os timestamps serão persistidos de forma consistente, preferencialmente em UTC.

A aplicação poderá converter esses horários para apresentação ao usuário quando necessário.

Essa decisão evita ambiguidades relacionadas a servidor, ambiente ou localização do usuário.

### 2.16 Extrato por período

Os filtros de período do extrato serão aplicados sobre a data da liquidação.

O período será tratado de forma inclusiva.

Por exemplo, um filtro de 01/09 até 30/09 deverá incluir todas as liquidações realizadas durante esses dias.

Além do período, o extrato poderá ser filtrado por cedente e moeda.

### 2.17 Regra de cálculo no frontend

O frontend não implementará novamente a fórmula financeira.

O backend será a fonte oficial da regra de precificação.

O frontend enviará os dados da operação ao backend e apresentará o resultado recebido.

Essa decisão evita diferenças entre uma implementação em Java e outra em TypeScript.

A simulação poderá ser atualizada automaticamente sempre que os campos obrigatórios estiverem preenchidos e válidos.

---

## 3. Perguntas que eu faria ao negócio

Antes de levar uma solução como essa para produção, eu buscaria esclarecer os seguintes pontos:

1. O prazo financeiro deve ser calculado em meses, dias corridos ou dias úteis?
2. Como tratar períodos que não correspondem exatamente a meses inteiros?
3. Qual é a origem real da taxa base?
4. A taxa base possui histórico ou apenas um valor atual?
5. Os spreads dos tipos de recebível são fixos ou configuráveis?
6. Qual taxa de câmbio deve ser usada na liquidação?
7. A taxa mostrada durante uma simulação deve permanecer válida até a confirmação?
8. Existe algum período de validade para uma simulação?
9. Existem liquidações parciais?
10. Um recebível pode ser reaberto ou cancelado depois de liquidado?
11. Existe alguma necessidade de estorno?
12. Qual é o timezone oficial utilizado pela operação?
13. Qual deve ser o comportamento quando não existir uma cotação de câmbio válida?
14. Existem outras moedas previstas além de BRL e USD?
15. Qual política oficial de arredondamento deve ser usada fora dos golden cases?

---

## 4. Critérios de aceite

### Corretude

- Os três golden cases fornecidos no desafio devem passar exatamente ao centavo.
- Nenhum valor financeiro deve utilizar `float` ou `double`.
- A regra de arredondamento deve ser aplicada de forma consistente.
- A conversão para USD deve respeitar a taxa efetivamente utilizada na operação.

### Integridade

- Uma liquidação não poderá ficar parcialmente registrada.
- Um recebível não poderá ser liquidado duas vezes.
- Requisições repetidas não poderão gerar liquidações duplicadas.
- Liquidações concluídas não poderão ser alteradas através da API.

### Segurança

- Todos os dados recebidos pela API deverão ser validados.
- Consultas ao banco não deverão utilizar concatenação direta de parâmetros fornecidos pelo usuário.
- Credenciais e segredos não deverão ser armazenados no código-fonte.
- Erros internos não deverão expor detalhes sensíveis da aplicação.

### Usabilidade

- O operador deverá conseguir informar os dados do recebível e visualizar a simulação antes da liquidação.
- Erros de preenchimento deverão ser apresentados de forma clara.
- O sistema deverá informar o valor presente, deságio e moeda de pagamento de forma compreensível.
- O histórico deverá permitir consultar as liquidações realizadas.

### Desempenho

Para o escopo do desafio, o objetivo será manter as operações comuns de simulação e liquidação simples e rápidas, sem introduzir infraestrutura de alta escala antes de existir necessidade.

O extrato deverá utilizar filtros no banco de dados e evitar carregar dados desnecessários em memória.

Decisões voltadas para cenários de escala muito elevada serão consideradas fora do escopo desta implementação.

---

## 5. Observação sobre os golden cases

Os golden cases fornecidos pelo desafio possuem regras próprias e obrigatórias para aferição.

Neles deverão ser utilizados:

- taxa base de 1,00% ao mês;
- prazo em meses inteiros;
- juros compostos mensais;
- arredondamento `HALF_EVEN`;
- duas casas decimais;
- arredondamento apenas no resultado definido pelo enunciado;
- no cross-currency, conversão do valor presente em BRL já arredondado.

Esses testes serão tratados como critérios obrigatórios de corretude do motor de precificação.