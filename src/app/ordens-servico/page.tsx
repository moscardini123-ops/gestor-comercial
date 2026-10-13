import Link from "next/link";
import { prisma } from "@/lib/db";
import { brl, dataBR } from "@/lib/format";
import { PageHeader, PrimaryLink, DataTable, Th, Td, Empty } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import { SITUACOES_OS, toneOS } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function OrdensPage({ searchParams }: { searchParams: Promise<{ q?: string; situacao?: string }> }) {
  const { q, situacao } = await searchParams;
  const ordens = await prisma.ordemServico.findMany({
    where: {
      ...(situacao ? { situacao } : {}),
      ...(q ? { OR: [{ numero: Number(q) || -1 }, { cliente: { nome: { contains: q } } }, { equipamento: { contains: q } }] } : {}),
    },
    include: { cliente: true },
    orderBy: { numero: "desc" },
  });

  return (
    <>
      <PageHeader title="Ordens de servico" subtitle="Assistencia e bancada: equipamento, defeito e status."
        action={<PrimaryLink href="/ordens-servico/novo">Nova ordem</PrimaryLink>} />

      <form className="mb-4 flex flex-wrap gap-2" action="/ordens-servico">
        <input name="q" defaultValue={q} placeholder="Exemplo: 512 ou Notebook Dell"
          className="min-w-[14rem] flex-1 rounded-lg border px-3 py-2 text-sm placeholder:text-slate-400"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }} />
        <select name="situacao" defaultValue={situacao ?? ""} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}>
          <option value="">Todas as situacoes</option>
          {SITUACOES_OS.map((s) => <option key={s.nome} value={s.nome}>{s.nome}</option>)}
        </select>
        <button className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Filtrar</button>
      </form>

      {ordens.length === 0 ? (
        <Empty>Nenhuma ordem encontrada. Crie a primeira em &quot;Nova ordem&quot;.</Empty>
      ) : (
        <DataTable head={<><Th>Numero</Th><Th>Cliente</Th><Th>Equipamento</Th><Th>Abertura</Th><Th>Situacao</Th><Th right>Total</Th></>}>
          {ordens.map((o) => (
            <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <Td><Link href={`/ordens-servico/${o.id}`} className="font-semibold text-indigo-600 dark:text-indigo-300">#{o.numero}</Link></Td>
              <Td>{o.cliente.nome}</Td>
              <Td>{o.equipamento || "—"}</Td>
              <Td>{dataBR(o.dataAbertura)}</Td>
              <Td><StatusPill label={o.situacao} tone={toneOS(o.situacao)} /></Td>
              <Td right>{brl(o.valorTotal)}</Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
