"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Field";
import { Button, LinkButton } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { empresaService } from "@/services/empresaService";
import type { EmpresaCriarDto } from "@/types/empresa";

export default function NovaEmpresaPage() {
  const router = useRouter();
  const [form, setForm] = useState<EmpresaCriarDto>({ razaoSocial: "", cnpj: "" });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const resposta = await empresaService.criar(form);
      router.push(`/empresas/${resposta.id}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao cadastrar empresa.");
      setEnviando(false);
    }
  }

  // Função para criar uma mascara no input de cnpj.
  function formatarCnpj(valor: string) {
    return valor
      .replace(/\D/g, "")
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return (
    <div>
      <PageHeader title="Nova empresa" description="Cadastre uma cedente ou devedora." />
      <Card className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          {erro && <Alert>{erro}</Alert>}
          <TextField
            label="Razão social"
            required
            value={form.razaoSocial}
            onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
            placeholder="Ex.: Comércio e Indústria Alfa Ltda."
          />
          <TextField
            label="CNPJ"
            required
            value={formatarCnpj(form.cnpj)}
            onChange={(e) => {
              const somenteNumeros = e.target.value.replace(/\D/g, "").slice(0, 14);
              setForm({ ...form, cnpj: somenteNumeros });
            }}
            inputMode="numeric"
            placeholder="00.000.000/0000-00"
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={enviando}>
              {enviando ? "Salvando…" : "Salvar empresa"}
            </Button>
            <LinkButton href="/empresas" variant="secondary">
              Cancelar
            </LinkButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
