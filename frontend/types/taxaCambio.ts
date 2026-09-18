import type { Moeda } from "./enums";

// Espelha srm.dto.taxaCambio.*

export interface TaxaCambioCriarDto {
  moedaOrigem: Moeda;
  moedaDestino: Moeda;
  taxa: number;
  dataVigencia: string; // LocalDateTime (ISO 8601)
}

export interface TaxaCambioBuscarDto {
  id: string;
  moedaOrigem: Moeda;
  moedaDestino: Moeda;
  taxa: number;
  dataVigencia: string;
  dataCadastro: string;
  dataAtualizacao: string;
}
