import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader, Card } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ClienteDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.cliente.findUnique({ where: { id: Number(id) }, include: { _count: { select: { pedidos: true, ordens: true, notas: true } } } });
  if (!c) notFound();
  return (
    <>
      <PageHeader title={c.nome} subtitle={c.papel}
        action={<Link href={`/clientes/${c.id}/editar`} className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Editar</Link>} />
      <Link href="/clientes" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar aos cadastros</Link>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt style={{ color: "var(--muted)" }}>CPF/CNPJ</dt><dd>{c.cpfCnpj || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Tipo</dt><dd>{c.tipoPessoa === "J" ? "Jurídica" : c.tipoPessoa === "E" ? "Estrangeiro" : "Física"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>E-mail</dt><dd>{c.email || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Telefone</dt><dd>{c.fone || "—"}</dd></div>
            <div className="col-span-2"><dt style={{ color: "var(--muted)" }}>Endereço</dt><dd>{[c.endereco, c.numero, c.bairro, c.cidade, c.uf].filter(Boolean).join(", ") || "—"}</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Movimentação</h2>
          <dl className="grid grid-cols-3 gap-4 text-center">
            <div><dt className="text-xs" style={{ color: "var(--muted)" }}>Pedidos</dt><dd className="text-2xl font-semibold tabular-nums">{c._count.pedidos}</dd></div>
            <div><dt className="text-xs" style={{ color: "var(--muted)" }}>Ordens</dt><dd className="text-2xl font-semibold tabular-nums">{c._count.ordens}</dd></div>
            <div><dt className="text-xs" style={{ color: "var(--muted)" }}>Notas</dt><dd className="text-2xl font-semibold tabular-nums">{c._count.notas}</dd></div>
          </dl>
        </Card>
      </div>
    </>
  );
}
