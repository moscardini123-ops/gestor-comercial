import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { atualizarNota } from "../../actions";
import { NotaForm } from "../../NotaForm";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditarNota({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nota = await prisma.notaFiscal.findUnique({ where: { id: Number(id) }, include: { cliente: true, itens: true } });
  if (!nota) notFound();
  const action = atualizarNota.bind(null, nota.id);
  return (
    <>
      <PageHeader title={`Editar nota #${nota.numero}`} subtitle="Altere os dados fiscais e os itens." />
      <Link href={`/notas-fiscais/${nota.id}`} className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar a nota</Link>
      <NotaForm action={action} inicial={nota} rotuloBotao="Salvar alteracoes" travarSituacao />
    </>
  );
}
