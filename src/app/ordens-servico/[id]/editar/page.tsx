import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { atualizarOrdem } from "../../actions";
import { OrdemForm } from "../../OrdemForm";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditarOrdem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ordem = await prisma.ordemServico.findUnique({ where: { id: Number(id) }, include: { cliente: true, itens: true } });
  if (!ordem) notFound();
  const action = atualizarOrdem.bind(null, ordem.id);
  return (
    <>
      <PageHeader title={`Editar ordem #${ordem.numero}`} subtitle="Altere os dados, servicos e pecas." />
      <Link href={`/ordens-servico/${ordem.id}`} className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar a ordem</Link>
      <OrdemForm action={action} inicial={ordem} rotuloBotao="Salvar alteracoes" travarSituacao />
    </>
  );
}
