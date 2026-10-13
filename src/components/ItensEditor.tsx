"use client";
import { useState } from "react";
import { brl } from "@/lib/format";

export type Linha = { descricao: string; unidade: string; quantidade: number; valorUnitario: number; tipo?: string };

export function ItensEditor({ name, comTipo = false }: { name: string; comTipo?: boolean }) {
  const [linhas, setLinhas] = useState<Linha[]>([
    { descricao: "", unidade: "UN", quantidade: 1, valorUnitario: 0, ...(comTipo ? { tipo: "servico" } : {}) },
  ]);

  function set(i: number, patch: Partial<Linha>) {
    setLinhas((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }
  function add() {
    setLinhas((prev) => [...prev, { descricao: "", unidade: "UN", quantidade: 1, valorUnitario: 0, ...(comTipo ? { tipo: "servico" } : {}) }]);
  }
  function remove(i: number) {
    setLinhas((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  const total = linhas.reduce((s, l) => s + (l.quantidade || 0) * (l.valorUnitario || 0), 0);
  const inp = "rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500";
  const st = { borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" } as const;

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(linhas)} />
      <div className="space-y-2">
        {linhas.map((l, i) => (
          <div key={i} className="flex flex-wrap items-end gap-2">
            {comTipo && (
              <select className={inp} style={st} value={l.tipo} onChange={(e) => set(i, { tipo: e.target.value })} aria-label="Tipo">
                <option value="servico">Servico</option>
                <option value="peca">Peca</option>
              </select>
            )}
            <input className={`${inp} min-w-[12rem] flex-1`} style={st} placeholder="Exemplo: Suporte tecnico" value={l.descricao} onChange={(e) => set(i, { descricao: e.target.value })} aria-label="Descricao" />
            <input className={`${inp} w-16`} style={st} placeholder="UN" value={l.unidade} onChange={(e) => set(i, { unidade: e.target.value })} aria-label="Unidade" />
            <input className={`${inp} w-20`} style={st} type="number" min="0" step="0.01" placeholder="Qtd" value={l.quantidade} onChange={(e) => set(i, { quantidade: Number(e.target.value) })} aria-label="Quantidade" />
            <input className={`${inp} w-28`} style={st} type="number" min="0" step="0.01" placeholder="Valor unit." value={l.valorUnitario} onChange={(e) => set(i, { valorUnitario: Number(e.target.value) })} aria-label="Valor unitario" />
            <span className="w-24 text-right text-sm tabular-nums" style={{ color: "var(--muted)" }}>{brl((l.quantidade || 0) * (l.valorUnitario || 0))}</span>
            <button type="button" onClick={() => remove(i)} className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950" aria-label="Remover linha">remover</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={add} className="rounded-lg border px-3 py-1.5 text-sm font-medium" style={st}>+ Adicionar item</button>
        <span className="text-sm font-semibold">Total dos itens: <span className="tabular-nums">{brl(total)}</span></span>
      </div>
    </div>
  );
}
