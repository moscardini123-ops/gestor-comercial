import Link from "next/link";
import { prisma } from "@/lib/db";
import { brl } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function Painel() {
  const [pedidos, ordens, notas, somaPedidos] = await Promise.all([
    prisma.pedido.count(),
    prisma.ordemServico.count(),
    prisma.notaFiscal.count(),
    prisma.pedido.aggregate({ _sum: { totalPedido: true } }),
  ]);

  const cards = [
    { href: "/pedidos", titulo: "Pedidos de venda", valor: pedidos, rodape: brl(somaPedidos._sum.totalPedido ?? 0) + " em vendas" },
    { href: "/ordens-servico", titulo: "Ordens de servico", valor: ordens, rodape: "assistencia e bancada" },
    { href: "/notas-fiscais", titulo: "Notas fiscais", valor: notas, rodape: "emissao e acompanhamento" },
  ];

  return (
    <>
      <PageHeader title="Painel" subtitle="Visao geral dos tres modulos." />
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="transition hover:shadow-sm">
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>{c.titulo}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{c.valor}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{c.rodape}</p>
            </Card>
          </Link>
        ))}
      </div>
      <Card className="mt-6">
        <h2 className="text-base font-semibold">Sobre este projeto</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Projeto proprio, com identidade propria. Os campos de pedidos e notas fiscais seguem a
          nomenclatura da API publica do Tiny/Olist; a ordem de servico e um modelo proprio no
          padrao de ERPs de assistencia. Nenhuma marca de terceiros e reproduzida.
        </p>
      </Card>
    </>
  );
}
