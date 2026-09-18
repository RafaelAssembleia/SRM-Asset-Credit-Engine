"use client";

import { useState, type FormEvent } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { SelectField, TextField } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { taxaCambioService } from "@/services/taxaCambioService";
import type { TaxaCambioBuscarDto } from "@/types/taxaCambio";
import { MOEDAS, MOEDA_LABELS, type Moeda } from "@/types/enums";
import { formatDataHora } from "@/lib/format";

export default function TaxaVigentePage() {
  const [moedaOrigem, setMoedaOrigem] = useState<Moeda>("USD");
  const [moedaDestino, setMoedaDestino] = useState<Moeda>("BRL");
  const [dataReferencia, setDataReferencia] = useState("");
  const [resultado, setResultado] = useState<TaxaCambioBuscarDto | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    setResultado(null);
    try {
      const taxa = await taxaCambioService.buscarTaxaVigente(
        moedaOrigem,
        moedaDestino,
        dataReferencia
      );
      setResultado(taxa);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao consultar taxa vigente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Taxa vigente"
        description="Consulte a cotação vigente em uma data de referência."
        action={
          <LinkButton href="/taxas-cambio" variant="secondary">
            Voltar
          </LinkButton>
        }
      />
      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {erro && <Alert>{erro}</Alert>}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Moeda de origem"
              value="Dólar (USD)"
              disabled             
            />
            <TextField
              label="Moeda de destino"
              value="Real (BRL)"
              disabled
            />
          </div>
          <TextField
            label="Data de referência"
            type="datetime-local"
            required
            value={dataReferencia}
            onChange={(e) => setDataReferencia(e.target.value)}
          />
          <Button type="submit" disabled={carregando}>
            {carregando ? "Consultando…" : "Consultar"}
          </Button>
        </form>
      </Card>

      {carregando && <Spinner label="Consultando taxa" />}

      {resultado && (
        <Card className="mt-6 max-w-lg">
          <p className="text-xs text-[var(--color-ink-soft)]">Taxa vigente</p>
          <p className="mt-1 font-serif-display text-2xl text-[var(--color-ink)]">
            {resultado.moedaOrigem} → {resultado.moedaDestino}:{" "}
            <span className="font-tabular">{resultado.taxa.toFixed(4)}</span>
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            Vigente desde {formatDataHora(resultado.dataVigencia)}
          </p>
        </Card>
      )}
    </div>
  );
}
