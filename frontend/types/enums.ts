export const MOEDAS = ["BRL", "USD" ] as const;
export type Moeda = (typeof MOEDAS)[number];

export const TIPOS_RECEBIVEL = [
  "DUPLICATA_MERCANTIL",
  "CHEQUE_PRE_DATADO",
] as const;
export type TipoRecebivel = (typeof TIPOS_RECEBIVEL)[number];

export const SITUACOES_RECEBIVEL = [
  "PENDENTE",
  "LIQUIDADO",
] as const;
export type SituacaoRecebivel = (typeof SITUACOES_RECEBIVEL)[number];

export const MOEDA_LABELS: Record<Moeda, string> = {
  BRL: "Real (BRL)",
  USD: "Dólar (USD)",
};

export const SITUACAO_LABELS: Record<SituacaoRecebivel, string> = {
  PENDENTE: "PENDENTE",
  LIQUIDADO: "LIQUIDADO",
};

export const TIPO_RECEBIVEL_LABELS: Record<TipoRecebivel, string> = {
  DUPLICATA_MERCANTIL: "Duplicata Mercantil",
  CHEQUE_PRE_DATADO: "Cheque Pré-Datado",
};