import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHeader, Card } from "@/components/ui";
import { TextoFormatado } from "@/components/TextoFormatado";

export const dynamic = "force-dynamic";

export default async function TermoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await prisma.termoGarantia.findUnique({ where: { id: Number(id) } });
  if (!t) notFound();
  return (
    <>
      <PageHeader title={t.nome}
        action={<Link href={`/termos/${t.id}/editar`} className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Editar</Link>} />
      <Link href="/termos" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar aos termos</Link>
      <Card><TextoFormatado texto={t.conteudo} className="text-sm" /></Card>
    </>
  );
}
