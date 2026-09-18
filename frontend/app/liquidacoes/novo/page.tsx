"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton, Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { SelectField, TextField } from "@/components/ui/Field";
import { Alert, Spinner, EmptyState } from "@/components/ui/Feedback";
import { Modal } from "@/components/ui/Modal";
import { recebivelService } from "@/services/recebivelService";
import { empresaService } from "@/services/empresaService";
import { liquidacaoService } from "@/services/liquidacaoService";
import type { RecebivelBuscarDto } from "@/types/recebivel";
import type { EmpresaBuscarDto } from "@/types/empresa";
import { MOEDAS, MOEDA_LABELS, TIPOS_RECEBIVEL, TIPO_RECEBIVEL_LABELS, type Moeda } from "@/types/enums";
import { formatLocalDate, formatMoeda } from "@/lib/format";


function gerarChaveIdempotencia() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function LiquidacoesPendentesPage() {
  const router = useRouter();

  const [recebiveis, setRecebiveis] = useState<RecebivelBuscarDto[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaBuscarDto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [vencimentoDe, setVencimentoDe] = useState("");
  const [vencimentoAte, setVencimentoAte] = useState("");

  const [selecionado, setSelecionado] = useState<RecebivelBuscarDto | null>(null);
  const [moedaPagamento, setMoedaPagamento] = useState<Moeda>("BRL");
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

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

const pendentes = useMemo(() => {
  return recebiveis.filter((r) => {
    const dataVencimento = r.dataVencimento.slice(0, 10);

    const passouSituacao = r.situacao === "PENDENTE";

    const passouEmpresa =
      !filtroEmpresa ||
      r.empresaCedenteId === filtroEmpresa;

    const passouTipo =
      !filtroTipo ||
      r.tipo === filtroTipo;

    const passouDe =
      !vencimentoDe ||
      dataVencimento >= vencimentoDe;

    const passouAte =
      !vencimentoAte ||
      dataVencimento <= vencimentoAte;

    return (
      passouSituacao &&
      passouEmpresa &&
      passouTipo &&
      passouDe &&
      passouAte
    );
  });
}, [
  recebiveis,
  filtroEmpresa,
  filtroTipo,
  vencimentoDe,
  vencimentoAte,
]);


  function abrirModal(recebivel: RecebivelBuscarDto) {
    setSelecionado(recebivel);
    setMoedaPagamento(recebivel.moeda);
    setErroEnvio(null);
  }

  function fecharModal() {
    setSelecionado(null);
  }

  async function confirmarLiquidacao() {
    if (!selecionado) return;
    setEnviando(true);
    setErroEnvio(null);
    try {
      const resposta = await liquidacaoService.criar({
        recebivelId: selecionado.id,
        moedaPagamento,
        chaveIdempotencia: gerarChaveIdempotencia(),
      });
      router.push(`/liquidacoes/${resposta.id}`);
    } catch (err) {
      setErroEnvio(err instanceof Error ? err.message : "Erro ao liquidar recebível.");
      setEnviando(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Liquidações pendentes"
        description="Recebíveis disponíveis para liquidação."
        action={
          <LinkButton href="/liquidacoes" variant="secondary">
            Ver histórico
          </LinkButton>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SelectField
          label="Empresa"
          options={[{ value: "", label: "Todas" }, ...empresas.map((e) => ({ value: e.id, label: e.razaoSocial }))]}
          value={filtroEmpresa}
          onChange={(e) => setFiltroEmpresa(e.target.value)}
        />
        <SelectField
          label="Tipo"
          options={[
            { value: "", label: "Todos" },
            ...TIPOS_RECEBIVEL.map((t) => ({ value: t, label: TIPO_RECEBIVEL_LABELS[t] })),
          ]}
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        />
        <TextField
          label="Vencimento de"
          type="date"
          value={vencimentoDe}
          onChange={(e) => setVencimentoDe(e.target.value)}
        />
        <TextField
          label="Vencimento até"
          type="date"
          value={vencimentoAte}
          onChange={(e) => setVencimentoAte(e.target.value)}
        />
      </div>
      <p className="mb-6 text-xs text-[var(--color-ink-faint)]">
        Status: Pendente (única situação liquidável nesta fila)
      </p>

      {carregando && <Spinner label="Carregando recebíveis pendentes" />}
      {erro && <Alert>{erro}</Alert>}

      {!carregando && !erro && pendentes.length === 0 && (
        <EmptyState
          title="Nenhum recebível pendente com esses filtros"
          description="Ajuste os filtros acima ou aguarde novos recebíveis serem cadastrados."
        />
      )}

      {!carregando && !erro && pendentes.length > 0 && (
        <Table
          rows={pendentes}
          rowKey={(r) => r.id}
          columns={[
            {
              header: "Empresa",
              render: (r) => empresasPorId.get(r.empresaCedenteId) ?? "—",
            },
            { header: "Tipo", render: (r) => TIPO_RECEBIVEL_LABELS[r.tipo] },
            {
              header: "Valor",
              render: (r) => formatMoeda(r.valorFace, r.moeda)
            },
            { header: "Vencimento", render: (r) => formatLocalDate(r.dataVencimento) },
            { header: "Moeda", render: (r) => r.moeda },
            {
              header: "Ação",
              render: (r) => (
                <Button variant="secondary" onClick={() => abrirModal(r)}>
                  Liquidar
                </Button>
              ),
            },
          ]}
        />
      )}

      <Modal open={!!selecionado} onClose={fecharModal} title="Nova liquidação">
        {selecionado && (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-[var(--color-ink-soft)]">Recebível</p>
              <p className="mt-1 text-sm text-[var(--color-ink)]">
                {TIPO_RECEBIVEL_LABELS[selecionado.tipo]} ·{" "}
                <span className="font-tabular">
                  {formatMoeda(selecionado.valorFace, selecionado.moeda)}
                </span>{" "}
                · vence em {formatLocalDate(selecionado.dataVencimento)}
              </p>
            </div>

            <dl className="rounded-md border border-[var(--color-line)] p-3 text-sm">
              <div className="flex justify-between border-b border-[var(--color-line)] py-1.5 last:border-0">
                <dt className="text-[var(--color-ink-soft)]">Tipo</dt>
                <dd>{TIPO_RECEBIVEL_LABELS[selecionado.tipo]}</dd>
              </div>
              <div className="flex justify-between border-b border-[var(--color-line)] py-1.5 last:border-0">
                <dt className="text-[var(--color-ink-soft)]">Valor</dt>
                <dd className="font-tabular">
                  {formatMoeda(selecionado.valorFace, selecionado.moeda)}
                </dd>
              </div>
              <div className="flex justify-between border-b border-[var(--color-line)] py-1.5 last:border-0">
                <dt className="text-[var(--color-ink-soft)]">Vencimento</dt>
                <dd>{formatLocalDate(selecionado.dataVencimento)}</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-[var(--color-ink-soft)]">Situação</dt>
                <dd>Pendente</dd>
              </div>
            </dl>

            <SelectField
              label="Moeda de pagamento"
              options={MOEDAS.map((m) => ({ value: m, label: MOEDA_LABELS[m] }))}
              value={moedaPagamento}
              onChange={(e) => setMoedaPagamento(e.target.value as Moeda)}
            />

            {erroEnvio && <Alert>{erroEnvio}</Alert>}

            <div className="flex gap-3 pt-1">
              <Button onClick={confirmarLiquidacao} disabled={enviando}>
                {enviando ? "Liquidando…" : "Liquidar recebível"}
              </Button>
              <Button variant="secondary" onClick={fecharModal} disabled={enviando}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}