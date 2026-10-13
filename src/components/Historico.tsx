import { dataBR } from "@/lib/format";

type Linha = { id: number; de: string | null; para: string; observacao: string | null; autor: string | null; criadoEm: Date };

export function Historico({ linhas }: { linhas: Linha[] }) {
  if (linhas.length === 0) {
    return <p className="text-sm" style={{ color: "var(--muted)" }}>Sem alteracoes de situacao registradas.</p>;
  }
  return (
    <ol className="relative space-y-4 border-l pl-5" style={{ borderColor: "var(--border)" }}>
      {linhas.map((l) => (
        <li key={l.id} className="relative">
          <span className="absolute -left-[1.42rem] top-1.5 h-2.5 w-2.5 rounded-full" style={{ background: "var(--brand)" }} />
          <div className="text-sm">
            <span className="font-medium">{l.de ? `${l.de} → ${l.para}` : l.para}</span>
            <span className="ml-2 text-xs" style={{ color: "var(--muted)" }}>{dataBR(l.criadoEm)}</span>
          </div>
          {l.observacao && <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>{l.observacao}</p>}
          {l.autor && <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>por {l.autor}</p>}
        </li>
      ))}
    </ol>
  );
}
