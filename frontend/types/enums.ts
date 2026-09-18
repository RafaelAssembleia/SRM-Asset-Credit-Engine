export const MOEDAS = ["BRL", "USD" ] as const;
export type Moeda = (typeof MOEDAS)[number];

export const MOEDA_LABELS: Record<Moeda, string> = {
  BRL: "Real (BRL)",
  USD: "Dólar (USD)",
};