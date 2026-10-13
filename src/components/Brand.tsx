export function Brand({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--brand)" />
        <path d="M9 16.5l4.2 4.2L23 11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ color: "var(--ink)" }}>Gestor<span style={{ color: "var(--brand)" }}>Comercial</span></span>
    </span>
  );
}
