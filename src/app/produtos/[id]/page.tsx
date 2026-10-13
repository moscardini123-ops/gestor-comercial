import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { brl } from "@/lib/format";
import { PageHeader, Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ProdutoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.produto.findUnique({ where: { id: Number(id) } });
  if (!p) notFound();
  const margem = p.preco > 0 ? ((p.preco - p.custo) / p.preco) * 100 : 0;
  return (
    <>
      <PageHeader title={p.descricao} subtitle={p.sku ? `SKU ${p.sku}` : undefined}
        action={<Link href={`/produtos/${p.id}/editar`} className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Editar</Link>} />
      <Link href="/produtos" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar aos produtos</Link>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt style={{ color: "var(--muted)" }}>Preço</dt><dd className="tabular-nums">{brl(p.preco)}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Custo</dt><dd className="tabular-nums">{brl(p.custo)}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Margem</dt><dd className="tabular-nums">{margem.toFixed(1)}%</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Estoque</dt><dd className="tabular-nums">{p.estoque}</dd></div>
          </dl>
        </Card>
        <Card>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt style={{ color: "var(--muted)" }}>GTIN/EAN</dt><dd>{p.gtin || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>NCM</dt><dd>{p.ncm || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Categoria</dt><dd>{p.categoria || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Tipo</dt><dd>{p.tipo}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Situação</dt><dd>{p.situacao}</dd></div>
          </dl>
        </Card>
      </div>
    </>
  );
}
