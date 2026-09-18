"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { taxaCambioService } from "@/services/taxaCambioService";
import type { TaxaCambioBuscarDto } from "@/types/taxaCambio";
import { formatDataHora, formatId } from "@/lib/format";

export default function TaxasCambioPage() {
  const router = useRouter();
  const [taxas, setTaxas] = useState<TaxaCambioBuscarDto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    taxaCambioService
      .listar()
      .then(setTaxas)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Taxas de câmbio"
        description="Cotações cadastradas."
        action={
          <div className="flex gap-3">
            <LinkButton href="/taxas-cambio/vigente" variant="secondary">
              Consultar vigente
            </LinkButton>
            <LinkButton href="/taxas-cambio/novo">Nova taxa</LinkButton>
          </div>
        }
      />

      {carregando && <Spinner label="Carregando taxas" />}
      {erro && <Alert>{erro}</Alert>}

      {!carregando && !erro && taxas.length === 0 && (
        <EmptyState
          title="Nenhuma taxa cadastrada"
          description="Cadastre uma cotação entre um par de moedas."
          action={<LinkButton href="/taxas-cambio/novo">Nova taxa</LinkButton>}
        />
      )}

      {!carregando && !erro && taxas.length > 0 && (
        <Table
          rows={taxas}
          rowKey={(t) => t.id}
          onRowClick={(t) => router.push(`/taxas-cambio/${t.id}`)}
          columns={[
            { header: "Moedas", render: (t) => `${t.moedaOrigem} → ${t.moedaDestino}` },
            { header: "Taxa", render: (t) => t.taxa.toFixed(4) },
            { header: "Vigência", render: (t) => formatDataHora(t.dataVigencia) },
            { header: "ID", render: (t) => formatId(t.id) },
          ]}
        />
      )}
    </div>
  );
}
