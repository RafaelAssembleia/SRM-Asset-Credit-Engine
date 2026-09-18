"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { SituacaoBadge } from "@/components/ui/Badge";
import { recebivelService } from "@/services/recebivelService";
import type { RecebivelBuscarDto } from "@/types/recebivel";
import { TIPO_RECEBIVEL_LABELS } from "@/types/enums";
import { formatLocalDate, formatId, formatMoeda } from "@/lib/format";
import { EmpresaBuscarDto } from "@/types/empresa";
import { empresaService } from "@/services/empresaService";

export default function RecebiveisPage() {
  const router = useRouter();
  const [recebiveis, setRecebiveis] = useState<RecebivelBuscarDto[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaBuscarDto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([recebivelService.listar(), empresaService.listar()])
      .then(([r, e]) => {
        setRecebiveis(r);
        setEmpresas(e);
      })
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  const empresasPorId = useMemo(() => {
    const mapa = new Map<string, string>();
    empresas.forEach((e) => mapa.set(e.id, e.razaoSocial));
    return mapa;
  }, [empresas]);

  return (
    <div>
      <PageHeader
        title="Recebíveis"
        description="Visão geral dos recebíveis em carteira."
        action={<LinkButton href="/recebiveis/novo">Novo recebível</LinkButton>}
      />

      {carregando && <Spinner label="Carregando recebíveis" />}
      {erro && <Alert>{erro}</Alert>}

      {!carregando && !erro && recebiveis.length === 0 && (
        <EmptyState
          title="Nenhum recebível cadastrado"
          description="Cadastre um recebível vinculado a uma cedente e uma devedora."
          action={<LinkButton href="/recebiveis/novo">Novo recebível</LinkButton>}
        />
      )}

      {!carregando && !erro && recebiveis.length > 0 && (
        <Table
          rows={recebiveis}
          rowKey={(r) => r.id}
          onRowClick={(r) => router.push(`/recebiveis/${r.id}`)}
          columns={[
            { header: "Tipo", render: (r) => TIPO_RECEBIVEL_LABELS[r.tipo] },
            {
              header: "Valor de face",
              render: (r) => formatMoeda(r.valorFace, r.moeda)
            },
            { header: "Vencimento", render: (r) => formatLocalDate(r.dataVencimento) },
            {
              header: "Empresa Cedente",
              render: (r) => empresasPorId.get(r.empresaCedenteId) ?? "—",
            },
            {
              header: "Empresa Devedora",
              render: (r) => empresasPorId.get(r.empresaDevedoraId) ?? "—",
            },
            { header: "Situação", render: (r) => <SituacaoBadge situacao={r.situacao} /> },
            { header: "ID", render: (r) => formatId(r.id) },
          ]}
        />
      )}
    </div>
  );
}
