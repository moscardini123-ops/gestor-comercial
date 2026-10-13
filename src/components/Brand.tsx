export function Brand() {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight text-[15px]">
      <svg width={26} height={26} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--brand)" />
        <path d="M9 16.5l4.2 4.2L23 11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ color: "#fff" }}>Gestor<span style={{ color: "var(--brand-2)" }}>LBS</span></span>
    </span>
  );
}
