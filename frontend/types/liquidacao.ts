import type { Moeda } from "./enums";

// Espelha srm.dto.liquidacao.*

export interface LiquidacaoCriarDto {
  recebivelId: string;
  moedaPagamento: Moeda;
  chaveIdempotencia: string;
}

export interface LiquidacaoBuscarDto {
  id: string;
  recebivelId: string;
  idTaxaCambio: string | null;
  chaveIdempotencia: string;
  valorFace: number;
  taxaBase: number;
  spread: number;
  prazoMeses: number;
  valorPresente: number;
  valorDesagio: number;
  moedaPagamento: Moeda;
  taxaCambio: number | null;
  valorPagamento: number;
  dataLiquidacao: string;
  dataCadastro: string;
  dataAtualizacao: string;
}
