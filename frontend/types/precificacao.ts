import type { Moeda, TipoRecebivel } from "./enums";

// Espelha srm.dto.precificacao.*

export interface PrecificacaoSimularDto {
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