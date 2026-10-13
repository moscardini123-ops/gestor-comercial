import type { DadosEmpresa } from "@/lib/empresa";

export function CabecalhoEmpresa({ empresa }: { empresa: DadosEmpresa }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-6">
      <div className="text-2xl font-black italic tracking-tight">{empresa.nome}</div>
      <div className="text-right text-[11px] leading-snug text-slate-600">
        {empresa.cnpj && <div>{empresa.cnpj}</div>}
        {empresa.site && <div>{empresa.site}</div>}
        {empresa.telefone && <div>{empresa.telefone}</div>}
        {empresa.endereco && <div>{empresa.endereco}</div>}
        {(empresa.cidade || empresa.uf) && <div>{[empresa.cidade, empresa.uf].filter(Boolean).join(" - ")}</div>}
        {empresa.cep && <div>{empresa.cep}</div>}
        {empresa.ie && <div>{empresa.ie}</div>}
      </div>
    </div>
  );
}

export function Folha({ children }: { children: React.ReactNode }) {
  return (
    <div className="tema-claro folha mx-auto my-0 max-w-[820px] rounded-lg bg-white p-10 text-slate-900 shadow-sm print:p-8"
      style={{ colorScheme: "light" }}>
      {children}
    </div>
  );
}

export function QuadroCliente({ titulo, linhas, lado }: { titulo: string; linhas: (string | null | undefined)[]; lado: { rotulo: string; valor: string }[] }) {
  return (
    <div className="mb-4 grid grid-cols-3 gap-3 text-[12px]">
      <div className="col-span-2 rounded border border-slate-300 p-3">
        <div className="mb-1 font-bold">{titulo}</div>
        {linhas.filter(Boolean).map((l, i) => <div key={i} className="text-slate-700">{l}</div>)}
      </div>
      <div className="rounded border border-slate-300">
        {lado.map((x, i) => (
          <div key={i} className={`flex justify-between gap-2 px-3 py-2 ${i < lado.length - 1 ? "border-b border-slate-200" : ""}`}>
            <span className="font-bold">{x.rotulo}</span><span className="text-slate-700">{x.valor || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
