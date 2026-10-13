import Link from "next/link";
import { criarOrdem } from "../actions";
import { PageHeader } from "@/components/ui";
import { OrdemForm } from "../OrdemForm";

export default function NovaOrdem() {
  return (
    <>
      <PageHeader title="Nova ordem de servico" subtitle="Equipamento, defeito e servicos executados." />
      <Link href="/ordens-servico" className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar as ordens</Link>
      <OrdemForm action={criarOrdem} />
    </>
  );
}
