import Link from "next/link";
import { criarNota } from "../actions";
import { PageHeader } from "@/components/ui";
import { NotaForm } from "../NotaForm";

export default function NovaNota() {
  return (
    <>
      <PageHeader title="Nova nota fiscal" subtitle="Dados fiscais, destinatario e itens." />
      <Link href="/notas-fiscais" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar as notas</Link>
      <NotaForm action={criarNota} />
    </>
  );
}
