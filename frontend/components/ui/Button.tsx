import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[#28594c] disabled:bg-[var(--color-ink-faint)]",
  secondary:
    "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-ink-faint)]",
  ghost: "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${BASE} ${VARIANT_CLASSES[variant]} ${className}`}>
      {children}
    </Link>
  );
}
