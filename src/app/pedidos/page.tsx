import Link from "next/link";
import { prisma } from "@/lib/db";
import { brl, dataBR } from "@/lib/format";
import { PageHeader, PrimaryLink, DataTable, Th, Td, Empty } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import { SITUACOES_PEDIDO, tonePedido } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function PedidosPage({ searchParams }: { searchParams: Promise<{ q?: string; situacao?: string }> }) {
  const { q, situacao } = await searchParams;
  const pedidos = await prisma.pedido.findMany({
    where: {
      ...(situacao ? { situacao } : {}),
      ...(q ? { OR: [{ numero: Number(q) || -1 }, { cliente: { nome: { contains: q } } }] } : {}),
    },
    include: { cliente: true, _count: { select: { itens: true } } },
    orderBy: { numero: "desc" },
  });

  return (
    <>
      <PageHeader title="Pedidos de venda" subtitle="Lista de pedidos, com cliente, situacao e total."
        action={<PrimaryLink href="/pedidos/novo">Novo pedido</PrimaryLink>} />

      <form className="mb-4 flex flex-wrap gap-2" action="/pedidos">
        <input name="q" defaultValue={q} placeholder="Exemplo: 1004 ou Maria Silva"
          className="min-w-[14rem] flex-1 rounded-lg border px-3 py-2 text-sm placeholder:text-slate-400"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }} />
        <select name="situacao" defaultValue={situacao ?? ""}
          className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }}>
          <option value="">Todas as situacoes</option>
          {SITUACOES_PEDIDO.map((s) => <option key={s.nome} value={s.nome}>{s.nome}</option>)}
        </select>
        <button className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Filtrar</button>
      </form>

      {pedidos.length === 0 ? (
        <Empty>Nenhum pedido encontrado. Crie o primeiro em &quot;Novo pedido&quot;.</Empty>
      ) : (
        <DataTable head={<><Th>Numero</Th><Th>Cliente</Th><Th>Data</Th><Th>Situacao</Th><Th right>Itens</Th><Th right>Total</Th></>}>
          {pedidos.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <Td><Link href={`/pedidos/${p.id}`} className="font-semibold text-indigo-600 dark:text-indigo-300">#{p.numero}</Link></Td>
              <Td>{p.cliente.nome}</Td>
              <Td>{dataBR(p.dataPedido)}</Td>
              <Td><StatusPill label={p.situacao} tone={tonePedido(p.situacao)} /></Td>
              <Td right>{p._count.itens}</Td>
              <Td right>{brl(p.totalPedido)}</Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
