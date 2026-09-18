export function Alert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success";
  children: React.ReactNode;
}) {
  const classes =
    tone === "error"
      ? "border-[var(--color-rose-soft)] bg-[var(--color-rose-soft)] text-[var(--color-rose)]"
      : "border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]";
  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${classes}`} role="alert">
      {children}
    </div>
  );
}

export function Spinner({ label = "Carregando" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-10 text-sm text-[var(--color-ink-soft)]">
      <span
        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-accent)]"
        aria-hidden
      />
      {label}…
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-line)] px-6 py-12 text-center">
      <p className="text-sm font-medium text-[var(--color-ink)]">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-[var(--color-ink-soft)]">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
