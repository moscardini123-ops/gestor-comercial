import Link from "next/link";
import { prisma } from "@/lib/db";
import { brl, dataBR } from "@/lib/format";
import { PageHeader, PrimaryLink, DataTable, Th, Td, Empty } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import { SITUACOES_NF, toneNF } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function NotasPage({ searchParams }: { searchParams: Promise<{ q?: string; situacao?: string }> }) {
  const { q, situacao } = await searchParams;
  const notas = await prisma.notaFiscal.findMany({
    where: {
      ...(situacao ? { situacao: Number(situacao) } : {}),
      ...(q ? { OR: [{ numero: Number(q) || -1 }, { cliente: { nome: { contains: q } } }] } : {}),
    },
    include: { cliente: true },
    orderBy: { numero: "desc" },
  });

  return (
    <>
      <PageHeader title="Notas fiscais" subtitle="Emissao e acompanhamento das NF-e."
        action={<PrimaryLink href="/notas-fiscais/novo">Nova nota</PrimaryLink>} />

      <form className="mb-4 flex flex-wrap gap-2" action="/notas-fiscais">
        <input name="q" defaultValue={q} placeholder="Exemplo: 101 ou Maria Silva"
          className="min-w-[14rem] flex-1 rounded-lg border px-3 py-2 text-sm placeholder:text-slate-400"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }} />
        <select name="situacao" defaultValue={situacao ?? ""} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}>
          <option value="">Todas as situacoes</option>
          {SITUACOES_NF.map((s) => <option key={s.codigo} value={s.codigo}>{s.nome}</option>)}
        </select>
        <button className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Filtrar</button>
      </form>

      {notas.length === 0 ? (
        <Empty>Nenhuma nota encontrada. Crie a primeira em &quot;Nova nota&quot;.</Empty>
      ) : (
        <DataTable head={<><Th>Numero</Th><Th>Serie</Th><Th>Cliente</Th><Th>Emissao</Th><Th>Situacao</Th><Th right>Valor</Th></>}>
          {notas.map((n) => (
            <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <Td><Link href={`/notas-fiscais/${n.id}`} className="font-semibold text-indigo-600 dark:text-indigo-300">#{n.numero}</Link></Td>
              <Td>{n.serie}</Td>
              <Td>{n.cliente.nome}</Td>
              <Td>{dataBR(n.dataEmissao)}</Td>
              <Td><StatusPill label={n.descricaoSituacao} tone={toneNF(n.situacao)} /></Td>
              <Td right>{brl(n.valorNota)}</Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
