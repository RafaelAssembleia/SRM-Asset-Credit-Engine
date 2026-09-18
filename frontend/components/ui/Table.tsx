export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right";
  mono?: boolean;
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-line)]">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-line)] bg-[var(--color-paper)]">
            {columns.map((col) => (
              <th
                key={col.header}
                className={`px-4 py-3 font-medium text-[var(--color-ink-soft)] ${col.align === "right" ? "text-right" : "text-left"
                  }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-[var(--color-line)] last:border-0 transition-colors hover:bg-black/[0.04] ${onRowClick ? "cursor-pointer" : ""
                }`}
            >
              {columns.map((col) => (
                <td
                  key={col.header}
                  className={`px-4 py-3 text-[var(--color-ink)] ${col.align === "right" ? "text-right" : "text-left"
                    } ${col.mono ? "font-tabular" : ""}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
