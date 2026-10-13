import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { brl, dataBR } from "@/lib/format";
import { PageHeader, Card, DataTable, Th, Td } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import { TrocarSituacao } from "@/components/TrocarSituacao";
import { Historico } from "@/components/Historico";
import { tonePedido, FRETE_POR_CONTA, SITUACOES_PEDIDO } from "@/lib/domain";
import { listarHistorico } from "@/lib/historico";
import { trocarSituacaoPedido } from "../actions";

export const dynamic = "force-dynamic";

export default async function PedidoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.pedido.findUnique({ where: { id: Number(id) }, include: { cliente: true, itens: true } });
  if (!p) notFound();
  const historico = await listarHistorico("pedido", p.id);

  return (
    <>
      <PageHeader title={`Pedido #${p.numero}`} subtitle={`Aberto em ${dataBR(p.dataPedido)}`}
        action={<div className="flex items-center gap-3">
          <StatusPill label={p.situacao} tone={tonePedido(p.situacao)} />
          <Link href={`/pedidos/${p.id}/imprimir`} className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Imprimir</Link>
          <Link href={`/pedidos/${p.id}/editar`} className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Editar</Link>
        </div>} />
      <Link href="/pedidos" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar aos pedidos</Link>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Cliente</h2>
          <p className="mt-2 font-medium">{p.cliente.nome}</p>
          {p.cliente.cpfCnpj && <p className="text-sm" style={{ color: "var(--muted)" }}>{p.cliente.cpfCnpj}</p>}
          {p.cliente.email && <p className="text-sm" style={{ color: "var(--muted)" }}>{p.cliente.email}</p>}
        </Card>
        <Card className="md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Dados do pedido</h2>
          <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt style={{ color: "var(--muted)" }}>Previsao de entrega</dt><dd>{dataBR(p.dataPrevista)}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Condicao de pagamento</dt><dd>{p.condicaoPagamento || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Frete por conta</dt><dd>{FRETE_POR_CONTA[p.fretePorConta] || p.fretePorConta}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Forma de envio</dt><dd>{p.formaEnvio || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Codigo de rastreio</dt><dd>{p.codigoRastreamento || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Vendedor</dt><dd>{p.vendedor || "—"}</dd></div>
          </dl>
        </Card>
      </div>

      <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Itens</h2>
      <DataTable head={<><Th>Descricao</Th><Th>Un.</Th><Th right>Qtd</Th><Th right>Valor unit.</Th><Th right>Total</Th></>}>
        {p.itens.map((it) => (
          <tr key={it.id}>
            <Td>{it.descricao}</Td><Td>{it.unidade}</Td><Td right>{it.quantidade}</Td>
            <Td right>{brl(it.valorUnitario)}</Td><Td right>{brl(it.quantidade * it.valorUnitario)}</Td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-4 flex justify-end">
        <Card className="w-full max-w-xs">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between"><dt style={{ color: "var(--muted)" }}>Produtos</dt><dd className="tabular-nums">{brl(p.totalProdutos)}</dd></div>
            <div className="flex justify-between"><dt style={{ color: "var(--muted)" }}>Frete</dt><dd className="tabular-nums">{brl(p.valorFrete)}</dd></div>
            <div className="flex justify-between"><dt style={{ color: "var(--muted)" }}>Desconto</dt><dd className="tabular-nums">- {brl(p.valorDesconto)}</dd></div>
            <div className="flex justify-between border-t pt-1.5 font-semibold" style={{ borderColor: "var(--border)" }}><dt>Total</dt><dd className="tabular-nums">{brl(p.totalPedido)}</dd></div>
          </dl>
        </Card>
      </div>
      {p.obs && <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}><strong>Obs.:</strong> {p.obs}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Trocar situacao</h2>
          <TrocarSituacao action={trocarSituacaoPedido} id={p.id} atual={p.situacao}
            opcoes={SITUACOES_PEDIDO.map((s) => ({ valor: s.nome, nome: s.nome }))} />
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Historico de situacao</h2>
          <Historico linhas={historico} />
        </Card>
      </div>
    </>
  );
}
