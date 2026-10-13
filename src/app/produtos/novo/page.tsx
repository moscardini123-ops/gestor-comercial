import Link from "next/link";
import { criarProduto } from "../actions";
import { PageHeader } from "@/components/ui";
import { ProdutoForm } from "../ProdutoForm";

export default function NovoProduto() {
  return (
    <>
      <PageHeader title="Incluir produto" subtitle="Cadastro de um novo produto." />
      <Link href="/produtos" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar aos produtos</Link>
      <ProdutoForm action={criarProduto} />
    </>
  );
}
