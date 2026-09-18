import Link from "next/link";
import { Card } from "@/components/ui/Card";

const SECOES = [
  {
    href: "/empresas",
    titulo: "Empresas",
    descricao: "Cadastre e consulte empresas cedentes e devedoras do sistema.",
  },
  {
    href: "/recebiveis",
    titulo: "Recebíveis",
    descricao: "Simule operações e cadastre novos recebíveis.",
  },
  {
    href: "/taxas-cambio",
    titulo: "Taxas de câmbio",
    descricao: "Acompanhe a cotação vigente, consulte o histórico e registre novas taxas.",
  },
  {
    href: "/liquidacoes",
    titulo: "Liquidações",
    descricao: "Acompanhe recebíveis pendentes, efetive liquidações e consulte o histórico das operações.",
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="mb-10 border-b border-[var(--color-line)] pb-6">
        <h1 className="font-serif-display text-3xl text-[var(--color-ink)]">
          Painel SRM
        </h1>
        <p className="mt-2 max-w-lg text-sm text-[var(--color-ink-soft)]">
          Acompanhe empresas, recebíveis, câmbio e liquidação em um único lugar.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SECOES.map((secao) => (
          <Link key={secao.href} href={secao.href}>
            <Card className="h-full transition-colors hover:border-[var(--color-accent)]">
              <p className="font-serif-display text-lg text-[var(--color-ink)]">
                {secao.titulo}
              </p>
              <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
                {secao.descricao}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
