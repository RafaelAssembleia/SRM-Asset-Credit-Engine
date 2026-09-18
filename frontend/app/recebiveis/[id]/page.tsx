"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { LinkButton } from "@/components/ui/Button";
import { SituacaoBadge } from "@/components/ui/Badge";
import { recebivelService } from "@/services/recebivelService";
import { empresaService } from "@/services/empresaService";
import type { RecebivelBuscarDto } from "@/types/recebivel";
import { TIPO_RECEBIVEL_LABELS } from "@/types/enums";
import { formatLocalDate, formatDataHora, formatMoeda } from "@/lib/format";

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-line)] py-3 last:border-0">
      <dt className="text-xs text-[var(--color-ink-soft)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

export default function RecebivelDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [recebivel, setRecebivel] = useState<RecebivelBuscarDto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    recebivelService
      .buscarPorId(id)
      .then(async (recebivelBusca) => {
        const [empresaCedenteBusca, empresaDevedoraBusca] = await Promise.all([
          empresaService.buscarPorId(recebivelBusca.empresaCedenteId),
          empresaService.buscarPorId(recebivelBusca.empresaDevedoraId),
        ]);

        const recebivel = {
          ...recebivelBusca,
          empresaCedente: empresaCedenteBusca.razaoSocial,
          empresaDevedora: empresaDevedoraBusca.razaoSocial,
        };

        setRecebivel(recebivel);
      })
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [id]);

  return (
    <div>
      <PageHeader
        title="Recebível"
        description="Detalhes do recebível cadastrado."
        action={
          <div className="flex gap-3">
            <LinkButton href="/recebiveis" variant="secondary">
              Voltar
            </LinkButton>
          </div>
        }
      />
      {carregando && <Spinner label="Carregando recebível" />}
      {erro && <Alert>{erro}</Alert>}
      {recebivel && (
        <Card className="max-w-lg">
          <dl>
            <Item label="Tipo" value={TIPO_RECEBIVEL_LABELS[recebivel.tipo]} />
            <Item label="Situação" value={<SituacaoBadge situacao={recebivel.situacao} />} />
            <Item
              label="Valor de face"
              value={
                <span className="font-tabular">
                  {formatMoeda(recebivel.valorFace, recebivel.moeda)}
                </span>
              }
            />
            <Item label="Vencimento" value={formatLocalDate(recebivel.dataVencimento)} />
            <Item
              label="Empresa cedente"
              value={<span className="font-tabular">{recebivel.empresaCedente}</span>}
            />
            <Item
              label="Empresa devedora"
              value={<span className="font-tabular">{recebivel.empresaDevedora}</span>}
            />
            <Item label="ID" value={<span className="font-tabular">{recebivel.id}</span>} />
            <Item label="Cadastrado em" value={formatDataHora(recebivel.dataCadastro)} />
            <Item label="Atualizado em" value={formatDataHora(recebivel.dataAtualizacao)} />
          </dl>
        </Card>
      )}
    </div>
  );
}
