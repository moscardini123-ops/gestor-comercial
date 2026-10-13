import Link from "next/link";
import { criarPedido } from "../actions";
import { PageHeader } from "@/components/ui";
import { PedidoForm } from "../PedidoForm";

export default function NovoPedido() {
  return (
    <>
      <PageHeader title="Novo pedido de venda" subtitle="Preencha os dados e os itens do pedido." />
      <Link href="/pedidos" className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar aos pedidos</Link>
      <PedidoForm action={criarPedido} />
    </>
  );
}
