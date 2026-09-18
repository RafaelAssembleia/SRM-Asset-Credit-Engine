"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { SelectField, TextField } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { recebivelService } from "@/services/recebivelService";
import { empresaService } from "@/services/empresaService";
import { precificacaoService } from "@/services/precificacaoService";
import type { RecebivelCriarDto } from "@/types/recebivel";
import type { EmpresaBuscarDto } from "@/types/empresa";
import type { PrecificacaoResultadoDto } from "@/types/precificacao";
import { MOEDAS, MOEDA_LABELS, TIPOS_RECEBIVEL, TIPO_RECEBIVEL_LABELS, type Moeda } from "@/types/enums";
import { formatMoeda, formatPercent } from "@/lib/format";

const FORM_VAZIO: RecebivelCriarDto = {
  empresaCedenteId: "",
  empresaDevedoraId: "",
  tipo: "DUPLICATA_MERCANTIL",
  valorFace: 0,
  moeda: "BRL",
  dataVencimento: "",
};

// Debounce, em ms, aplicado apenas ao valor de face — os demais campos que
// compõem o cálculo (tipo, moeda, vencimento, moeda de pagamento) disparam
// a simulação imediatamente ao mudar.
const DEBOUNCE_VALOR_FACE_MS = 400;

function ResultadoLinha({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-line)] py-2.5 last:border-0">
      <dt className="text-sm text-[var(--color-ink-soft)]">{label}</dt>
      <dd className="font-tabular text-sm text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

export default function NovoRecebivelPage() {
  const router = useRouter();

  const [empresas, setEmpresas] = useState<EmpresaBuscarDto[]>([]);
  const [carregandoEmpresas, setCarregandoEmpresas] = useState(true);

  const [form, setForm] = useState<RecebivelCriarDto>(FORM_VAZIO);
  const [moedaPagamento, setMoedaPagamento] = useState<Moeda>("BRL");
  const [debouncedValorFace, setDebouncedValorFace] = useState(form.valorFace);
  const [valorFaceInput, setValorFaceInput] = useState("");

  const [simulacao, setSimulacao] = useState<PrecificacaoResultadoDto | null>(null);
  const [simulando, setSimulando] = useState(false);
  const [erroSimulacao, setErroSimulacao] = useState<string | null>(null);
  const [simulacaoAtualizada, setSimulacaoAtualizada] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  useEffect(() => {
    empresaService
      .listar()
      .then(setEmpresas)
      .catch((e: Error) => setErroEnvio(e.message))
      .finally(() => setCarregandoEmpresas(false));
  }, []);

  // Debounce só do valor de face, digitado tecla a tecla.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValorFace(form.valorFace), DEBOUNCE_VALOR_FACE_MS);
    return () => clearTimeout(timer);
  }, [form.valorFace]);

  async function executarSimulacao() {
    if (!debouncedValorFace || debouncedValorFace <= 0 || !form.dataVencimento) {
      setSimulacao(null);
      return;
    }
    setSimulando(true);
    setErroSimulacao(null);
    try {

      const resultado = await precificacaoService.simularRascunho({
        tipoRecebivel: form.tipo,
        valorFace: debouncedValorFace,
        moedaOrigem: form.moeda,
        dataVencimento: form.dataVencimento,
        moedaPagamento,
      });

      setSimulacao(resultado);
      setSimulacaoAtualizada(true);
    } catch (err) {
      setErroSimulacao(err instanceof Error ? err.message : "Erro ao simular valor líquido.");
    } finally {
      setSimulando(false);
    }
  }

  // Atualização automática: dispara sempre que qualquer campo que compõe o
  // cálculo muda — valor de face (já debounced acima), tipo, moeda do
  // recebível, data de vencimento ou moeda de pagamento.
  useEffect(() => {
    setSimulacaoAtualizada(false);
    executarSimulacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValorFace, form.tipo, form.moeda, form.dataVencimento, moedaPagamento]);

  async function handleCriar(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErroEnvio(null);
    try {
      const resposta = await recebivelService.criar(form);
      router.push(`/recebiveis/${resposta.id}`);
    } catch (err) {
      setErroEnvio(err instanceof Error ? err.message : "Erro ao cadastrar recebível.");
      setEnviando(false);
    }
  }

  const opcoesEmpresa = empresas.map((e) => ({ value: e.id, label: e.razaoSocial }));

  return (
    <div>
      <PageHeader
        title="Novo recebível"
        description="Preencha os dados da operação e acompanhe a simulação ao lado."
        action={
          <LinkButton href="/recebiveis" variant="secondary">
            Voltar
          </LinkButton>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="font-serif-display text-lg text-[var(--color-ink)]">Novo recebível</p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Preencha os dados da operação. A simulação será calculada antes da criação.
          </p>

          {carregandoEmpresas ? (
            <Spinner label="Carregando empresas" />
          ) : (
            <form onSubmit={handleCriar} className="mt-6 space-y-5">
              {erroEnvio && <Alert>{erroEnvio}</Alert>}

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Empresa cedente"
                  required
                  placeholder="Selecione…"
                  options={opcoesEmpresa}
                  value={form.empresaCedenteId}
                  onChange={(e) => setForm({ ...form, empresaCedenteId: e.target.value })}
                />
                <SelectField
                  label="Empresa devedora"
                  required
                  placeholder="Selecione…"
                  options={opcoesEmpresa}
                  value={form.empresaDevedoraId}
                  onChange={(e) => setForm({ ...form, empresaDevedoraId: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Tipo do recebível"
                  required
                  options={TIPOS_RECEBIVEL.map((t) => ({ value: t, label: TIPO_RECEBIVEL_LABELS[t] }))}
                  value={form.tipo}
                  onChange={(e) =>
                    setForm({ ...form, tipo: e.target.value as RecebivelCriarDto["tipo"] })
                  }
                />
                <TextField
                  label="Valor de face"
                  type="text"
                  inputMode="decimal"
                  required
                  value={valorFaceInput}
                  onChange={(e) => {
                    const valor = e.target.value;
                    // vazio ou número com no máximo 2 casas decimais
                    // usando padrão br para delimitador decimal
                    if (valor === "" || /^\d+(,\d{0,2})?$/.test(valor)) {
                      setValorFaceInput(valor);

                      setForm({
                        ...form,
                        valorFace:
                          valor === ""
                            ? 0
                            : Number(valor.replace(",", ".")),
                      });
                    }
                  }}
                  placeholder="R$ 0,00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Moeda do recebível"
                  value="Real (BRL)"
                  disabled
                />
                <TextField
                  label="Data de vencimento"
                  type="date"
                  required
                  value={form.dataVencimento}
                  onChange={(e) => setForm({ ...form, dataVencimento: e.target.value })}
                />
              </div>

              <hr className="border-[var(--color-line)]" />

              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={executarSimulacao} disabled={simulando}>
                  {simulando ? "Simulando…" : "Simular valor líquido"}
                </Button>
                <Button type="submit" disabled={enviando}>
                  {enviando ? "Criando…" : "Criar recebível"}
                </Button>
              </div>

              {simulacaoAtualizada && !simulando && (
                <p className="text-xs text-[var(--color-accent)]">
                  Simulação atualizada. Revise os valores antes de criar o recebível.
                </p>
              )}
            </form>
          )}
        </Card>

        <Card>
          <p className="font-serif-display text-lg text-[var(--color-ink)]">Simulação</p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Estimativa com base nos dados informados.
          </p>

          <div className="mt-6">
            <SelectField
              label="Moeda de pagamento"
              options={MOEDAS.map((m) => ({ value: m, label: MOEDA_LABELS[m] }))}
              value={moedaPagamento}
              onChange={(e) => setMoedaPagamento(e.target.value as Moeda)}
            />
          </div>

          <div className="mt-5">
            {simulando && <Spinner label="Calculando" />}
            {erroSimulacao && <Alert>{erroSimulacao}</Alert>}

            {!simulando && !erroSimulacao && !simulacao && (
              <p className="py-8 text-center text-sm text-[var(--color-ink-faint)]">
                Preencha valor de face e vencimento para ver a simulação.
              </p>
            )}

            {!simulando && simulacao && (
              <>
                <dl>
                  <ResultadoLinha
                    label="Valor de face"
                    value={formatMoeda(simulacao.valorFace, form.moeda)}
                  />
                  <ResultadoLinha label="Prazo" value={`${simulacao.prazoMeses} meses`} />
                  <ResultadoLinha label="Taxa base" value={formatPercent(simulacao.taxaBase)} />
                  <ResultadoLinha label="Spread" value={formatPercent(simulacao.spread)} />
                  <ResultadoLinha
                    label="Valor presente"
                    value={formatMoeda(simulacao.valorPresente, form.moeda)}
                  />
                  <ResultadoLinha
                    label="Deságio"
                    value={formatMoeda(simulacao.valorDesagio, form.moeda)}
                  />
                </dl>

                <div className="mt-4 rounded-md bg-[var(--color-paper)] p-4">
                  <p className="text-xs text-[var(--color-ink-soft)]">Valor líquido estimado</p>
                  <p className="mt-1 font-tabular text-2xl font-medium text-[var(--color-ink)]">
                    {formatMoeda(simulacao.valorPagamento, simulacao.moedaPagamento)}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}