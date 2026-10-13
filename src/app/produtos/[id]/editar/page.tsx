import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { atualizarProduto } from "../../actions";
import { ProdutoForm } from "../../ProdutoForm";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditarProduto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.produto.findUnique({ where: { id: Number(id) } });
  if (!p) notFound();
  const action = atualizarProduto.bind(null, p.id);
  return (
    <>
      <PageHeader title={`Editar ${p.descricao}`} />
      <Link href={`/produtos/${p.id}`} className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar ao produto</Link>
      <ProdutoForm action={action} inicial={p} rotuloBotao="Salvar alterações" />
    </>
  );
}
