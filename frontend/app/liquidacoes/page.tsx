"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { liquidacaoService } from "@/services/liquidacaoService";
import { recebivelService } from "@/services/recebivelService";
import { empresaService } from "@/services/empresaService";
import type { LiquidacaoBuscarDto } from "@/types/liquidacao";
import type { RecebivelBuscarDto } from "@/types/recebivel";
import type { EmpresaBuscarDto } from "@/types/empresa";
import { formatDataHora, formatId, formatMoeda } from "@/lib/format";

export default function LiquidacoesPage() {
  const router = useRouter();
  const [liquidacoes, setLiquidacoes] = useState<LiquidacaoBuscarDto[]>([]);
  const [recebiveis, setRecebiveis] = useState<RecebivelBuscarDto[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaBuscarDto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([liquidacaoService.listar(), recebivelService.listar(), empresaService.listar()])
      .then(([l, r, e]) => {
        setLiquidacoes(l);
        setRecebiveis(r);
        setEmpresas(e);
      })
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  const recebiveisPorId = useMemo(() => {
    const mapa = new Map<string, RecebivelBuscarDto>();
    recebiveis.forEach((r) => mapa.set(r.id, r));
    return mapa;
  }, [recebiveis]);

  const empresasPorId = useMemo(() => {
    const mapa = new Map<string, string>();
    empresas.forEach((e) => mapa.set(e.id, e.razaoSocial));
    return mapa;
  }, [empresas]);

  return (
    <div>
      <PageHeader
        title="Liquidações"
        description="Histórico das operações de liquidação concluídas."
        action={<LinkButton href="/liquidacoes/novo">Nova liquidação</LinkButton>}
      />

      {carregando && <Spinner label="Carregando liquidações" />}
      {erro && <Alert>{erro}</Alert>}

      {!carregando && !erro && liquidacoes.length === 0 && (
        <EmptyState
          title="Nenhuma liquidação registrada"
          description="Registre a liquidação de um recebível já precificado."
          action={<LinkButton href="/liquidacoes/novo">Nova liquidação</LinkButton>}
        />
      )}

      {!carregando && !erro && liquidacoes.length > 0 && (
        <Table
          rows={liquidacoes}
          rowKey={(l) => l.id}
          onRowClick={(l) => router.push(`/liquidacoes/${l.id}`)}
          columns={[
            {
              header: "Valor pago",
              render: (l) => formatMoeda(l.valorPagamento, l.moedaPagamento)
            },
            {
              header: "Empresa Cedente",
              render: (l) => {
                var recebivel = recebiveisPorId.get(l.recebivelId);
                if (!recebivel) return "—";
                return empresasPorId.get(recebivel.empresaCedenteId) ?? "—";
              }
            },
            {
              header: "Empresa Devedora",
              render: (l) => {
                var recebivel = recebiveisPorId.get(l.recebivelId);
                if (!recebivel) return "—";
                return empresasPorId.get(recebivel.empresaDevedoraId) ?? "—";
              }
            },
            { header: "Liquidado em", render: (l) => formatDataHora(l.dataLiquidacao) },
            { header: "ID", render: (l) => formatId(l.id) },
          ]}
        />
      )}
    </div>
  );
}
