import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { atualizarCliente } from "../../actions";
import { ClienteForm } from "../../ClienteForm";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditarCliente({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await prisma.cliente.findUnique({ where: { id: Number(id) } });
  if (!c) notFound();
  const action = atualizarCliente.bind(null, c.id);
  return (
    <>
      <PageHeader title={`Editar ${c.nome}`} />
      <Link href={`/clientes/${c.id}`} className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar ao cadastro</Link>
      <ClienteForm action={action} inicial={c} rotuloBotao="Salvar alterações" />
    </>
  );
}
