export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4 border-b border-[var(--color-line)] pb-6">
      <div>
        <h1 className="font-serif-display text-2xl text-[var(--color-ink)]">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-sm text-[var(--color-ink-soft)]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
