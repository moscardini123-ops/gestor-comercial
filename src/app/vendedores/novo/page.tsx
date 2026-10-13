import Link from "next/link";
import { criarVendedor } from "../actions";
import { PageHeader, Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";

export default function NovoVendedor() {
  return (
    <>
      <PageHeader title="Incluir vendedor" />
      <Link href="/vendedores" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar</Link>
      <form action={criarVendedor} className="space-y-5">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome"><input name="nome" required className={inputClass} style={inputStyle} placeholder="Exemplo: João" /></Field>
            <Field label="E-mail"><input name="email" type="email" className={inputClass} style={inputStyle} placeholder="Exemplo: joao@email.com" /></Field>
            <Field label="Comissão (%)"><input name="comissaoPct" type="number" step="0.1" min="0" defaultValue={0} className={inputClass} style={inputStyle} /></Field>
          </div>
        </Card>
        <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>Salvar vendedor</button>
      </form>
    </>
  );
}
