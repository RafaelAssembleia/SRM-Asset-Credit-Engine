# SRM Credit Engine

Plataforma full stack para **gestão, precificação e liquidação de recebíveis multimoedas**, simulando uma operação de cessão de crédito com foco em precisão financeira, integridade dos dados e simplicidade de execução.

## Tecnologias

**Backend:** Java 21, Spring Boot, Spring Data JPA, PostgreSQL, Flyway, JUnit e Mockito.  
**Frontend:** Next.js, React, TypeScript e Tailwind CSS.  
**Infraestrutura:** Docker e Docker Compose.

### Por que essas tecnologias?

No backend, escolhi Java 21 com Spring Boot por ser uma stack madura, amplamente utilizada em sistemas corporativos e adequada para regras de negócio, persistência e validações.

No frontend, utilizei Next.js com React e TypeScript para ter uma interface moderna, tipada e organizada, com boa produtividade no desenvolvimento.

Na infraestrutura, usei Docker e Docker Compose para simplificar a execução do projeto, permitindo subir frontend, backend e PostgreSQL de forma padronizada em qualquer ambiente.

## Principais funcionalidades

- cadastro e consulta de empresas;
- cadastro e acompanhamento de recebíveis;
- simulação de valor presente e deságio;
- cadastro e consulta de taxas de câmbio USD/BRL;
- liquidação em BRL ou USD;
- idempotência nas liquidações;
- histórico das operações.

## Como rodar o projeto

### Pré-requisitos

Para executar a aplicação em uma nova máquina, é necessário ter instalado apenas:

- Git;
- Docker;
- Docker Desktop.

Não é necessário instalar Java, Maven, Node.js, npm ou PostgreSQL localmente.

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2. Entre na pasta do projeto

```bash
cd SRM-Asset-Credit-Engine
```

### 3. Suba a aplicação

```bash
docker compose up --build
```

Na primeira execução, o processo pode levar alguns minutos porque o Docker precisa baixar as imagens e instalar as dependências.

Quando os containers estiverem prontos, acesse:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

O PostgreSQL é iniciado automaticamente pelo Docker Compose.

### 4. Parar a aplicação

```bash
docker compose down
```

Para remover também os dados persistidos no volume do PostgreSQL:

```bash
docker compose down -v
```

## Regras financeiras

A precificação utiliza:

```text
Valor Presente = Valor de Face / (1 + Taxa Base + Spread) ^ Prazo
```

Premissas principais:

- taxa base de **1% ao mês**;
- Duplicata Mercantil: spread de **1,5% ao mês**;
- Cheque Pré-datado: spread de **2,5% ao mês**;
- cálculos com `BigDecimal` e arredondamento `HALF_EVEN`;
- recebíveis em BRL e pagamentos em BRL ou USD.

## Documentação

- `SPEC.md` — premissas e regras do projeto;
- `REVIEW.md` — code review do endpoint de liquidação;
- `DECISIONS.md` — decisões e simplificações adotadas;
- `AI_USAGE.md` — registro do uso de IA durante o desenvolvimento.
