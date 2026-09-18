"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { SelectField, TextField } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { taxaCambioService } from "@/services/taxaCambioService";
import type { TaxaCambioCriarDto } from "@/types/taxaCambio";
import { MOEDAS, MOEDA_LABELS } from "@/types/enums";

const VAZIO: TaxaCambioCriarDto = {
  moedaOrigem: "USD",
  moedaDestino: "BRL",
  taxa: 0,
  dataVigencia: "",
};

export default function NovaTaxaCambioPage() {
  const router = useRouter();
  const [form, setForm] = useState<TaxaCambioCriarDto>(VAZIO);
  const [taxaInput, setTaxaInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setEnviando(true);
    setErro(null);
    try {
      const resposta = await taxaCambioService.criar(form);
      router.push(`/taxas-cambio/${resposta.id}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar taxa.");
      setEnviando(false);
    }
  }

  return (
    <div>
      <PageHeader title="Nova taxa de câmbio" description="Cadastre uma cotação entre duas moedas." />
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
            label="Taxa"
            type="text"
            inputMode="decimal"
            required
            value={taxaInput}
            onChange={(e) => {
              const taxa = e.target.value;
              if (taxa === "" || /^\d+(\,\d{0,4})?$/.test(taxa)) {
                setTaxaInput(taxa);

                if (taxa !== "" && taxa !== ".") {
                  setForm({ ...form, taxa: Number(taxa.replace(",", ".")) });
                }
              }
            }}
            placeholder="R$ 0,0000"
          />
          <TextField
            label="Data de vigência"
            type="datetime-local"
            required
            value={form.dataVigencia}
            onChange={(e) => setForm({ ...form, dataVigencia: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={enviando}>
              {enviando ? "Salvando…" : "Salvar taxa"}
            </Button>
            <LinkButton href="/taxas-cambio" variant="secondary">
              Cancelar
            </LinkButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
