export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs" style={{ color: "var(--muted)" }}>{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500";
export const inputStyle = { borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" } as const;
