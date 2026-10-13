import Link from "next/link";
import { criarPedido } from "../actions";
import { PageHeader } from "@/components/ui";
import { PedidoForm } from "../PedidoForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NovoPedido() {
  const termos = await prisma.termoGarantia.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } });
  return (
    <>
      <PageHeader title="Novo pedido de venda" subtitle="Preencha os dados e os itens do pedido." />
      <Link href="/pedidos" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar aos pedidos</Link>
      <PedidoForm action={criarPedido} termos={termos} />
    </>
  );
}
