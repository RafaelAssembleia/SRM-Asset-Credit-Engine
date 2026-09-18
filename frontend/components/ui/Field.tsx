import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const FIELD_CLASSES =
  "w-full rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)] disabled:bg-[var(--color-paper)]";

function FieldWrapper({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[var(--color-ink)]">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-[var(--color-ink-faint)]">{hint}</p>}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, id, className = "", ...props }: TextFieldProps) {
  const inputId = id ?? props.name ?? label;
  return (
    <FieldWrapper label={label} htmlFor={inputId} hint={hint}>
      <input id={inputId} className={`${FIELD_CLASSES} ${className}`} {...props} />
    </FieldWrapper>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  label,
  hint,
  id,
  options,
  placeholder,
  className = "",
  ...props
}: SelectFieldProps) {
  const selectId = id ?? props.name ?? label;
  return (
    <FieldWrapper label={label} htmlFor={selectId} hint={hint}>
      <select id={selectId} className={`${FIELD_CLASSES} ${className}`} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
