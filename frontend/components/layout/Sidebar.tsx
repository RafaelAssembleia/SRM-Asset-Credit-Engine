"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Painel" },
  { href: "/empresas", label: "Empresas" },
  { href: "/recebiveis", label: "Recebíveis" },
  { href: "/taxas-cambio", label: "Taxas de câmbio" },
  { href: "/liquidacoes", label: "Liquidações" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        sticky top-0
        hidden h-screen w-60 shrink-0
        border-r border-[var(--color-line)]
        bg-[var(--color-ink)]
        md:flex md:flex-col
      "
    >
      <div className="px-6 py-7">
        <p className="font-serif-display text-xl text-white">SRM</p>
        <p className="mt-0.5 text-xs text-white/50">Plataforma de Cessão de Crédito Multimoedas</p>
      </div>
      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-white/10 px-6 py-4">
        <p className="text-xs text-white/40">2026 · Rafael Assembleia</p>
      </div>
    </aside>
  );
}
