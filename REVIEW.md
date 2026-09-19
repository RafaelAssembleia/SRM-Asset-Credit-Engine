# REVIEW.md

## Code Review — `settlement.controller.ts`

### 1. Falta de transação
**Severidade:** Crítica

**Problema:**  
O `INSERT` da liquidação e o `UPDATE` do recebível são executados separadamente.

Se uma operação funcionar e a outra falhar, os dados podem ficar inconsistentes.

**Impacto:**  
O recebível pode continuar como pendente mesmo após uma liquidação ter sido criada, permitindo uma nova liquidação.

**Correção:**  
Executar todo o processo dentro de uma transação e realizar `rollback` em caso de erro.

---

### 2. Erros são ignorados
**Severidade:** Crítica

**Problema:**  
O bloco `catch` ignora a exceção e o endpoint continua retornando sucesso.

```ts
catch (e) {
  // se falhar aqui, o insert já rodou, então segue o jogo
}
```

**Impacto:**  
O usuário pode receber uma resposta de sucesso mesmo quando a liquidação falhou.

**Correção:**  
Não ignorar exceções. Em caso de erro, desfazer a operação e retornar uma resposta HTTP adequada.

---

### 3. Precisão inadequada para valores financeiros
**Severidade:** Alta

**Problema:**  
O cálculo usa `Number`, `Math.pow` e `toFixed`, que trabalham com ponto flutuante.

**Impacto:**  
Podem ocorrer diferenças de centavos no cálculo final.

**Correção:**  
Utilizar uma biblioteca ou tipo decimal apropriado para valores financeiros e aplicar a regra de arredondamento definida pelo negócio, como `HALF_EVEN`.

---

### 4. Taxas estão na escala errada
**Severidade:** Alta

**Problema:**  
As taxas foram informadas como:

```ts
const BASE_RATE = 1.0;
const spread = receivable.type === "DUPLICATA" ? 1.5 : 2.5;
```

Na fórmula, os valores deveriam ser:

```text
1%   = 0.01
1,5% = 0.015
2,5% = 0.025
```

**Impacto:**  
O valor presente calculado fica incorreto.

**Correção:**  
Representar as taxas na escala decimal correta e validar os resultados com testes automatizados.

---

### 5. Uso inadequado dos códigos HTTP
**Severidade:** Média

**Problema:**  
O endpoint sempre retorna `200 OK`, inclusive quando ocorre algum erro.

**Correção:**  
Retornar códigos HTTP de acordo com o resultado da operação, por exemplo:

- `201 Created` para liquidação criada;
- `400 Bad Request` para dados inválidos;
- `404 Not Found` para recebível inexistente;
- `409 Conflict` para conflito de regra de negócio;
- `500 Internal Server Error` para erro inesperado.

---

## Conclusão

O endpoint precisa de ajustes antes de ser considerado seguro para produção.

Os principais pontos são:

- garantir transação na liquidação;
- tratar corretamente os erros;
- usar precisão decimal adequada;
- corrigir a escala das taxas;
- retornar códigos HTTP coerentes.

Esses problemas podem causar cálculos incorretos, respostas de sucesso indevidas e inconsistência de dados.
