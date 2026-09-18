"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { LinkButton } from "@/components/ui/Button";
import { taxaCambioService } from "@/services/taxaCambioService";
import type { TaxaCambioBuscarDto } from "@/types/taxaCambio";
import { formatDataHora } from "@/lib/format";

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-line)] py-3 last:border-0">
      <dt className="text-xs text-[var(--color-ink-soft)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

export default function TaxaCambioDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [taxa, setTaxa] = useState<TaxaCambioBuscarDto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    taxaCambioService
      .buscarPorId(id)
      .then(setTaxa)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [id]);

  return (
    <div>
      <PageHeader
        title={taxa ? `${taxa.moedaOrigem} → ${taxa.moedaDestino}` : "Taxa de câmbio"}
        description="Detalhes da cotação cadastrada."
        action={
          <LinkButton href="/taxas-cambio" variant="secondary">
            Voltar
          </LinkButton>
        }
      />
      {carregando && <Spinner label="Carregando taxa" />}
      {erro && <Alert>{erro}</Alert>}
      {taxa && (
        <Card className="max-w-lg">
          <dl>
            <Item label="Moeda de origem" value={taxa.moedaOrigem} />
            <Item label="Moeda de destino" value={taxa.moedaDestino} />
            <Item label="Taxa" value={<span className="font-tabular">{taxa.taxa.toFixed(4)}</span>} />
            <Item label="Vigência" value={formatDataHora(taxa.dataVigencia)} />
            <Item label="ID" value={<span className="font-tabular">{taxa.id}</span>} />
            <Item label="Cadastrada em" value={formatDataHora(taxa.dataCadastro)} />
            <Item label="Atualizada em" value={formatDataHora(taxa.dataAtualizacao)} />
          </dl>
        </Card>
      )}
    </div>
  );
}
