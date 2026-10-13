import Link from "next/link";
import { prisma } from "@/lib/db";
import { brl } from "@/lib/format";
import { PageHeader, PrimaryLink, DataTable, Th, Td, Empty } from "@/components/ui";

export const dynamic = "force-dynamic";

const ABAS = [
  { key: "", label: "todos" }, { key: "simples", label: "simples" }, { key: "kit", label: "kits" },
  { key: "variacao", label: "variações" }, { key: "fabricado", label: "fabricado" }, { key: "materia-prima", label: "matéria-prima" },
];

export default async function ProdutosPage({ searchParams }: { searchParams: Promise<{ q?: string; tipo?: string }> }) {
  const { q, tipo } = await searchParams;
  const where = {
    ...(tipo ? { tipo } : {}),
    ...(q ? { OR: [{ descricao: { contains: q } }, { sku: { contains: q } }, { gtin: { contains: q } }] } : {}),
  };
  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({ where, orderBy: { descricao: "asc" } }),
    prisma.produto.count(),
  ]);

  return (
    <>
      <PageHeader title="Produtos" subtitle="Cadastro de produtos, com SKU, preço e estoque."
        action={<PrimaryLink href="/produtos/novo">Incluir produto</PrimaryLink>} />

      <form className="mb-3 flex flex-wrap gap-2" action="/produtos">
        <input name="q" defaultValue={q} placeholder="Exemplo: 165 Basic ou F165BASIC-1"
          className="min-w-[16rem] flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }} />
        <button className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Pesquisar</button>
      </form>

      <div className="mb-4 flex flex-wrap gap-1 border-b pb-2 text-sm" style={{ borderColor: "var(--border)" }}>
        {ABAS.map((a) => {
          const on = (tipo ?? "") === a.key;
          const href = a.key ? `/produtos?tipo=${a.key}` : "/produtos";
          return <Link key={a.label} href={href} className="rounded-md px-3 py-1" style={on ? { background: "var(--brand)", color: "#fff", fontWeight: 600 } : { color: "var(--muted)" }}>{a.label}</Link>;
        })}
        <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>{total} no total</span>
      </div>

      {produtos.length === 0 ? (
        <Empty>Nenhum produto. Comece em &quot;Incluir produto&quot;.</Empty>
      ) : (
        <DataTable head={<><Th>Descrição</Th><Th>Código (SKU)</Th><Th right>Preço</Th><Th right>Estoque</Th></>}>
          {produtos.map((p) => (
            <tr key={p.id} className="lin">
              <Td><Link href={`/produtos/${p.id}`} className="font-medium text-indigo-300">{p.descricao}</Link></Td>
              <Td>{p.sku || "—"}</Td>
              <Td right>{brl(p.preco)}</Td>
              <Td right><span style={{ color: p.estoque <= 0 ? "#f87171" : undefined }}>{p.estoque}</span></Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
