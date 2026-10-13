import Link from "next/link";
import { prisma } from "@/lib/db";
import { brl } from "@/lib/format";

export const dynamic = "force-dynamic";

const CUSTO_VARIAVEL_VENDA = 128; // modelo do gerencial
const CUSTO_FIXO_MES = 6199;

export default async function Painel() {
  const agora = new Date();
  const ini = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const [pedidos, ordens, notas, produtos, clientes, garantias, pedidosMes] = await Promise.all([
    prisma.pedido.count(),
    prisma.ordemServico.count(),
    prisma.notaFiscal.count(),
    prisma.produto.count(),
    prisma.cliente.count(),
    prisma.garantia.count(),
    prisma.pedido.findMany({ where: { dataPedido: { gte: ini } }, select: { totalPedido: true } }),
  ]);

  const receitaMes = pedidosMes.reduce((s, p) => s + p.totalPedido, 0);
  const nVendas = pedidosMes.length;
  const contribuicao = receitaMes - nVendas * CUSTO_VARIAVEL_VENDA - CUSTO_FIXO_MES;

  const atalhos = [
    { href: "/pedidos/novo", label: "Novo pedido de venda" },
    { href: "/ordens-servico/novo", label: "Nova ordem de serviço" },
    { href: "/termos", label: "Termos de garantia" },
    { href: "/produtos", label: "Produtos" },
  ];
  const cards = [
    { href: "/pedidos", titulo: "Pedidos de venda", valor: pedidos },
    { href: "/ordens-servico", titulo: "Ordens de serviço", valor: ordens },
    { href: "/notas-fiscais", titulo: "Notas fiscais", valor: notas },
    { href: "/produtos", titulo: "Produtos", valor: produtos },
    { href: "/clientes", titulo: "Clientes e fornecedores", valor: clientes },
    { href: "/garantias", titulo: "Garantias (SAC)", valor: garantias },
  ];

  const hora = agora.getHours();
  const saud = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{saud}</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Gerencial estilo Olist, com documentos e termo de garantia.</p>
        </div>
      </div>

      {/* Resultado do mes (modelo do gerencial) */}
      <div className="mb-5 rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Resultado do mês (modelo)</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums" style={{ color: contribuicao >= 0 ? "#34d399" : "#f87171" }}>{brl(contribuicao)}</p>
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {nVendas} vendas · receita {brl(receitaMes)} · Σ(venda − {brl(CUSTO_VARIAVEL_VENDA)}) − custo fixo {brl(CUSTO_FIXO_MES)}. Modelo aproximado do fechamento; ajuste os parâmetros conforme seu custo real.
        </p>
      </div>

      {/* Atalhos */}
      <div className="mb-5 rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Meus atalhos</h2>
        <div className="flex flex-wrap gap-2">
          {atalhos.map((a) => (
            <Link key={a.href} href={a.href} className="rounded-lg border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>{a.label}</Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <div className="rounded-xl border p-5 transition hover:border-indigo-500" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>{c.titulo}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{c.valor}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
