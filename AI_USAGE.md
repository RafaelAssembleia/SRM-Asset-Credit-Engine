# AI_USAGE — Uso de IA no projeto

## 1. Como a IA foi utilizada

A IA foi usada como ferramenta de apoio durante o desenvolvimento, principalmente para planejamento, geração inicial de estruturas, revisão de código e investigação de problemas.

Os principais usos foram:

- definição da estrutura inicial do backend em **Java 21 + Spring Boot + PostgreSQL**, seguindo uma arquitetura simples em camadas: `Controller -> Service -> Repository`;
- definição das entidades principais: `Empresa`, `Recebivel`, `TaxaCambio` e `Liquidacao`;
- apoio na criação de DTOs, migrations, services, repositories e testes;
- implementação e revisão do motor de precificação usando **Strategy**, `BigDecimal` e `RoundingMode.HALF_EVEN`;
- validação dos **golden cases** do desafio;
- definição do fluxo de câmbio **BRL -> pagamento em USD**, utilizando a cotação USD/BRL vigente;
- apoio na construção do frontend com **Next.js, React, TypeScript e Tailwind CSS**;
- revisão do fluxo de cadastro, simulação, liquidação e histórico;
- apoio na investigação de bugs de datas, valores monetários e exibição de moedas.

---

## 2. Exemplo em que a IA errou

Durante a implementação do filtro de vencimento dos recebíveis, inicialmente a análise focou na lógica do filtro.

Foram adicionados logs com `console.table` para comparar:

- situação do recebível;
- data retornada pelo backend;
- data selecionada no filtro;
- registros resultantes do filtro.

Os logs mostraram que o filtro estava correto: os registros de `2026-12-14` estavam sendo retornados normalmente.

O problema real estava na exibição da data. Um `LocalDate` do backend estava sendo convertido com `new Date(...)` no frontend, causando alteração do dia por causa do fuso horário.

A correção foi separar a formatação:

```ts
export function formatLocalDate(data: string) {
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}
```

Assim, datas sem horário passaram a ser tratadas como datas locais, sem conversão de timezone.

Esse caso reforçou que sugestões da IA não foram aceitas automaticamente: o comportamento foi validado com os dados reais retornados pela API antes da correção definitiva.

Outro exemplo ocorreu na formatação monetária, quando uma alteração sugerida não respeitou a assinatura da função `formatMoeda`, que exigia o valor e a moeda. O TypeScript detectou o problema durante o desenvolvimento, e a chamada foi corrigida informando explicitamente `BRL` ou a moeda de pagamento correspondente.

---

## 3. O que não foi delegado à IA

Algumas decisões foram mantidas sob validação manual:

- definição final das regras financeiras utilizadas no projeto;
- decisão de manter o recebível em **BRL** e permitir pagamento em **BRL ou USD**;
- definição de quando aplicar a conversão cambial;
- validação dos valores calculados pelos golden cases;
- conferência das migrations e relacionamentos do banco;
- validação do comportamento real da API e do frontend;
- decisão final sobre quais sugestões de código seriam incorporadas ao projeto.

A IA foi utilizada como apoio para acelerar análise e implementação, mas as decisões finais foram verificadas por testes, execução da aplicação, inspeção dos dados e comparação com os requisitos do desafio.
