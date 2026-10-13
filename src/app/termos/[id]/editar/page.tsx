import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { atualizarTermo } from "../../actions";
import { TermoForm } from "../../TermoForm";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditarTermo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await prisma.termoGarantia.findUnique({ where: { id: Number(id) } });
  if (!t) notFound();
  const action = atualizarTermo.bind(null, t.id);
  return (
    <>
      <PageHeader title={`Editar ${t.nome}`} />
      <Link href={`/termos/${t.id}`} className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar ao termo</Link>
      <TermoForm action={action} inicial={t} rotuloBotao="Salvar alterações" />
    </>
  );
}
