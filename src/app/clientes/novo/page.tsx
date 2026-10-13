import Link from "next/link";
import { criarCliente } from "../actions";
import { PageHeader } from "@/components/ui";
import { ClienteForm } from "../ClienteForm";

export default function NovoCliente() {
  return (
    <>
      <PageHeader title="Incluir cadastro" subtitle="Novo cliente, fornecedor ou transportador." />
      <Link href="/clientes" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar aos cadastros</Link>
      <ClienteForm action={criarCliente} />
    </>
  );
}
