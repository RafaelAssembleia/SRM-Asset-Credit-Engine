import type { Moeda, TipoRecebivel } from "./enums";

// Espelha srm.dto.precificacao.*

export interface PrecificacaoSimularDto {
  recebivelId: string;
  moedaPagamento: Moeda;
}

// Sem contrapartida no backend fornecido ainda — simula a precificação a
// partir de dados digitados no formulário, antes de o recebível existir.
// Precisa de um endpoint equivalente no PrecificacaoController (ver
// precificacaoService.simularRascunho).
export interface PrecificacaoSimularRascunhoDto {
  tipoRecebivel: TipoRecebivel;
  valorFace: number;
  moedaOrigem: Moeda;
  dataVencimento: string; // LocalDate (yyyy-MM-dd)
  moedaPagamento: Moeda;
}

export interface PrecificacaoResultadoDto {
  valorFace: number;
  taxaBase: number;
  spread: number;
  prazoMeses: number;
  valorPresente: number;
  valorDesagio: number;
  moedaPagamento: Moeda;
  idTaxaCambio: string | null;
  taxaCambio: number | null;
  valorPagamento: number;
}