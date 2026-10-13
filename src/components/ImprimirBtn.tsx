"use client";
export function ImprimirBtn() {
  return (
    <button onClick={() => window.print()} className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>
      Imprimir / Salvar PDF
    </button>
  );
}
