import type { SituacaoRecebivel } from "@/types/enums";
import { SITUACAO_LABELS } from "@/types/enums";

const TONE_CLASSES: Record<SituacaoRecebivel, string> = {
  PENDENTE: "bg-[var(--color-rose-soft)] text-[var(--color-rose)]",
  LIQUIDADO: "bg-[var(--color-accent-soft)] text-[var(--color-accent)]",
};

export function SituacaoBadge({ situacao }: { situacao: SituacaoRecebivel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[situacao]}`}
    >
      {SITUACAO_LABELS[situacao]}
    </span>
  );
}
