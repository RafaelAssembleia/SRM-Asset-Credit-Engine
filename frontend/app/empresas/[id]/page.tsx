"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { LinkButton } from "@/components/ui/Button";
import { empresaService } from "@/services/empresaService";
import type { EmpresaBuscarDto } from "@/types/empresa";
import { formatCnpj, formatDataHora } from "@/lib/format";

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-line)] py-3 last:border-0">
      <dt className="text-xs text-[var(--color-ink-soft)]">{label}</dt>
      <dd className="mt-1 text-sm text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

export default function EmpresaDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [empresa, setEmpresa] = useState<EmpresaBuscarDto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    empresaService
      .buscarPorId(id)
      .then(setEmpresa)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [id]);

  return (
    <div>
      <PageHeader
        title={empresa?.razaoSocial ?? "Empresa"}
        description="Detalhes do cadastro."
        action={
          <LinkButton href="/empresas" variant="secondary">
            Voltar
          </LinkButton>
        }
      />
      {carregando && <Spinner label="Carregando empresa" />}
      {erro && <Alert>{erro}</Alert>}
      {empresa && (
        <Card className="max-w-lg">
          <dl>
            <Item label="Razão social" value={empresa.razaoSocial} />
            <Item label="CNPJ" value={formatCnpj(empresa.cnpj)} />
            <Item label="ID" value={<span className="font-tabular">{empresa.id}</span>} />
            <Item label="Cadastrada em" value={formatDataHora(empresa.dataCadastro)} />
            <Item label="Atualizada em" value={formatDataHora(empresa.dataAtualizacao)} />
          </dl>
        </Card>
      )}
    </div>
  );
}
