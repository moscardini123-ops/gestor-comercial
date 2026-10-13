import Link from "next/link";
import { criarTermo } from "../actions";
import { PageHeader } from "@/components/ui";
import { TermoForm } from "../TermoForm";

export default function NovoTermo() {
  return (
    <>
      <PageHeader title="Novo termo de garantia" />
      <Link href="/termos" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar aos termos</Link>
      <TermoForm action={criarTermo} />
    </>
  );
}
