"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { LinkButton } from "@/components/ui/Button";
import { liquidacaoService } from "@/services/liquidacaoService";
import type { LiquidacaoBuscarDto } from "@/types/liquidacao";
import { formatDataHora, formatMoeda } from "@/lib/format";

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-line)] py-3 last:border-0">
      <dt className="text-xs text-[var(--color-ink-soft)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

export default function LiquidacaoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [liquidacao, setLiquidacao] = useState<LiquidacaoBuscarDto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    liquidacaoService
      .buscarPorId(id)
      .then(setLiquidacao)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [id]);

  return (
    <div>
      <PageHeader
        title="Liquidação"
        description="Detalhes do pagamento registrado."
        action={
          <LinkButton href="/liquidacoes" variant="secondary">
            Voltar
          </LinkButton>
        }
      />
      {carregando && <Spinner label="Carregando liquidação" />}
      {erro && <Alert>{erro}</Alert>}
      {liquidacao && (
        <Card className="max-w-lg">
          <dl>
            <Item
              label="Valor pago"
              value={
                <span className="font-tabular">
                  {formatMoeda(liquidacao.valorPagamento, liquidacao.moedaPagamento)}
                </span>
              }
            />
            <Item
              label="Valor presente"
              value={
                <span className="font-tabular">
                  {formatMoeda(liquidacao.valorPresente, "BRL")}
                </span>
              }
            />
            <Item
              label="Valor de deságio"
              value={
                <span className="font-tabular">
                  {formatMoeda(liquidacao.valorDesagio, "BRL")}
                </span>
              }
            />
            <Item label="Taxa base" value={<span className="font-tabular">{liquidacao.taxaBase}</span>} />
            <Item label="Spread" value={<span className="font-tabular">{liquidacao.spread}</span>} />
            <Item label="Prazo (meses)" value={liquidacao.prazoMeses} />
            {liquidacao.taxaCambio !== null && (
              <Item
                label="Taxa de câmbio aplicada"
                value={<span className="font-tabular">{liquidacao.taxaCambio}</span>}
              />
            )}
            <Item
              label="Recebível"
              value={<span className="font-tabular">{liquidacao.recebivelId}</span>}
            />
            <Item
              label="Chave de idempotência"
              value={<span className="font-tabular">{liquidacao.chaveIdempotencia}</span>}
            />
            <Item label="ID" value={<span className="font-tabular">{liquidacao.id}</span>} />
            <Item label="Liquidado em" value={formatDataHora(liquidacao.dataLiquidacao)} />
            <Item label="Cadastrado em" value={formatDataHora(liquidacao.dataCadastro)} />
          </dl>
        </Card>
      )}
    </div>
  );
}
