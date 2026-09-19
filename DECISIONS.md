# DECISIONS — SRM Credit Engine

Este documento registra decisões de escopo e simplificações adotadas durante o desenvolvimento do projeto.

O objetivo foi priorizar a corretude das regras financeiras, a clareza do código e o fluxo principal da aplicação, evitando adicionar funcionalidades que aumentariam a complexidade sem trazer valor direto ao desafio.

## 1. Arquitetura simples em camadas

Foi utilizada a arquitetura:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
PostgreSQL
```

### Motivo

O escopo do projeto não justificava a quantidade adicional de abstrações. A estrutura em camadas atende bem às regras atuais e mantém o código simples de entender, testar e evoluir.

---

## 2. Recebíveis somente em BRL

Os recebíveis são cadastrados apenas em **BRL**.

A moeda de pagamento pode ser:

- BRL
- USD

### Motivo

O requisito principal de cross-currency do desafio é um título em BRL com pagamento em USD.

Adicionar recebíveis originalmente em USD e conversões nos dois sentidos aumentaria o número de regras cambiais sem necessidade para o fluxo solicitado.

---

## 3. Taxa de câmbio cadastrada manualmente

As cotações USD/BRL são cadastradas pelo operador e armazenadas com data e hora de vigência.

Não foi realizada integração com um provedor externo de câmbio.

### Motivo

O objetivo foi priorizar a regra de seleção da taxa vigente e a utilização correta dessa taxa na liquidação.

Uma integração externa adicionaria preocupações como autenticação, indisponibilidade, retry e timeout sem ser necessária para validar o fluxo principal.

---

## 4. Moeda representada por Enum

Não foi criada uma tabela de moedas.

As moedas disponíveis são representadas por um `enum` na aplicação.

### Motivo

O escopo atual utiliza apenas BRL e USD. Uma tabela dedicada adicionaria complexidade sem benefício prático neste momento.

---

## 5. Precificação não é uma entidade

A precificação não possui tabela própria no banco.

Ela é tratada como uma regra de negócio e utiliza Strategy para definir o spread de cada tipo de recebível.

### Motivo

A simulação de precificação não representa, por si só, uma operação que precise ser persistida.

Os dados importantes são armazenados como snapshot quando ocorre a liquidação.

---

## 6. Extrato não possui tabela própria

Não foi criada uma entidade ou tabela de extrato.

O histórico pode ser obtido a partir das liquidações registradas.

### Motivo

Criar uma nova tabela duplicaria informações que já existem na liquidação.

O extrato deve ser uma visão/consulta sobre esses dados.

---

## 7. Liquidação integral

O projeto considera uma liquidação única e integral para cada recebível.

Não foram implementadas liquidações parciais, parcelamentos, cancelamentos ou estornos.

### Motivo

Essas funcionalidades exigiriam novas regras de saldo, estados intermediários e auditoria adicional.

O fluxo principal do desafio é atendido com:

```text
PENDENTE → LIQUIDADO
```

---

## 8. Idempotência sem tratamento avançado de concorrência

Foi implementada idempotência através de uma chave única para evitar que a mesma requisição gere duas liquidações.

### Motivo

A idempotência atende ao cenário de retry de rede e duplo clique previsto no fluxo principal.

---

## 9. Modelo de dados reduzido ao domínio principal

O banco foi mantido com as principais entidades:

- Empresa
- Recebivel
- TaxaCambio
- Liquidacao

Não foram criadas tabelas adicionais para contas bancárias, moedas, precificações ou extratos.

### Motivo

A intenção foi manter o modelo normalizado e focado apenas nas informações necessárias para executar e auditar uma operação.

---

## 10. Prioridade do desenvolvimento

A prioridade do projeto foi:

1. garantir precisão nos cálculos financeiros;
2. reproduzir os golden cases;
3. garantir integridade da liquidação;
4. implementar idempotência;
5. manter rastreabilidade dos valores utilizados;
6. entregar um fluxo completo entre backend e frontend.

Funcionalidades que não eram necessárias para validar esses pontos foram mantidas fora do escopo.

## Conclusão

As simplificações foram feitas deliberadamente para manter o projeto proporcional ao problema.

A intenção foi evitar complexidade prematura e entregar um fluxo principal completo, compreensível e testável, deixando pontos de evolução claramente identificados.
