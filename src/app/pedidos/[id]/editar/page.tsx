import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { atualizarPedido } from "../../actions";
import { PedidoForm } from "../../PedidoForm";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditarPedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({ where: { id: Number(id) }, include: { cliente: true, itens: true } });
  if (!pedido) notFound();
  const action = atualizarPedido.bind(null, pedido.id);
  return (
    <>
      <PageHeader title={`Editar pedido #${pedido.numero}`} subtitle="Altere os dados e os itens." />
      <Link href={`/pedidos/${pedido.id}`} className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar ao pedido</Link>
      <PedidoForm action={action} inicial={pedido} rotuloBotao="Salvar alteracoes" travarSituacao />
    </>
  );
}
