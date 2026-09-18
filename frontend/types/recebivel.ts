import type { Moeda, SituacaoRecebivel, TipoRecebivel } from "./enums";

// Espelha srm.dto.recebivel.*

export interface RecebivelCriarDto {
  empresaCedenteId: string;
  empresaDevedoraId: string;
  tipo: TipoRecebivel;
  valorFace: number;
  moeda: Moeda;
  dataVencimento: string; // LocalDate (yyyy-MM-dd)
}

export interface RecebivelBuscarDto {
  id: string;
  empresaCedenteId: string;
  empresaCedente: string;
  empresaDevedoraId: string;
  empresaDevedora: string;
  tipo: TipoRecebivel;
  valorFace: number;
  moeda: Moeda;
  dataVencimento: string;
  situacao: SituacaoRecebivel;
  dataCadastro: string;
  dataAtualizacao: string;
}
