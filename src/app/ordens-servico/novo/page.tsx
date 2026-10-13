import Link from "next/link";
import { criarOrdem } from "../actions";
import { PageHeader } from "@/components/ui";
import { OrdemForm } from "../OrdemForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NovaOrdem() {
  const termos = await prisma.termoGarantia.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } });
  return (
    <>
      <PageHeader title="Nova ordem de serviço" subtitle="Reparo ou upgrade, com termo de garantia." />
      <Link href="/ordens-servico" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar as ordens</Link>
      <OrdemForm action={criarOrdem} termos={termos} />
    </>
  );
}
