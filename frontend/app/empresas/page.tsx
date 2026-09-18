"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { Alert, EmptyState, Spinner } from "@/components/ui/Feedback";
import { empresaService } from "@/services/empresaService";
import type { EmpresaBuscarDto } from "@/types/empresa";
import { formatCnpj, formatData, formatId } from "@/lib/format";

export default function EmpresasPage() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<EmpresaBuscarDto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    empresaService
      .listar()
      .then(setEmpresas)
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Empresas"
        description="Cedentes e devedoras cadastradas no sistema."
        action={<LinkButton href="/empresas/novo">Nova empresa</LinkButton>}
      />

      {carregando && <Spinner label="Carregando empresas" />}
      {erro && <Alert>{erro}</Alert>}

      {!carregando && !erro && empresas.length === 0 && (
        <EmptyState
          title="Nenhuma empresa cadastrada"
          description="Cadastre a primeira empresa para começar a registrar recebíveis."
          action={<LinkButton href="/empresas/novo">Nova empresa</LinkButton>}
        />
      )}

      {!carregando && !erro && empresas.length > 0 && (
        <Table
          rows={empresas}
          rowKey={(e) => e.id}
          onRowClick={(e) => router.push(`/empresas/${e.id}`)}
          columns={[
            { header: "Razão social", render: (e) => e.razaoSocial },
            { header: "CNPJ", render: (e) => formatCnpj(e.cnpj), mono: true },
            { header: "Cadastrada em", render: (e) => formatData(e.dataCadastro) },
            { header: "ID", render: (e) => formatId(e.id) },
          ]}
        />
      )}
    </div>
  );
}
