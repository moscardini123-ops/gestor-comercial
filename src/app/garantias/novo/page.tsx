import Link from "next/link";
import { criarGarantia } from "../actions";
import { PageHeader, Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";

export default function NovaGarantia() {
  return (
    <>
      <PageHeader title="Abrir garantia" subtitle="Novo acionamento de garantia (SAC)." />
      <Link href="/garantias" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar</Link>
      <form action={criarGarantia} className="space-y-5">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente"><input name="clienteNome" required className={inputClass} style={inputStyle} placeholder="Exemplo: Maria Silva" /></Field>
            <Field label="CPF"><input name="cpf" className={inputClass} style={inputStyle} placeholder="Exemplo: 123.456.789-00" /></Field>
            <Field label="Modelo"><input name="modelo" className={inputClass} style={inputStyle} placeholder="Exemplo: Forerunner 165" /></Field>
            <Field label="Número de série"><input name="serial" className={inputClass} style={inputStyle} placeholder="Exemplo: 89T0313637" /></Field>
            <div className="sm:col-span-2"><Field label="Problema relatado"><textarea name="problema" rows={3} className={inputClass} style={inputStyle} placeholder="Exemplo: não liga" /></Field></div>
            <div className="sm:col-span-2"><Field label="Observações internas"><textarea name="obs" rows={2} className={inputClass} style={inputStyle} placeholder="Exemplo: recebido pelos Correios" /></Field></div>
          </div>
        </Card>
        <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>Abrir garantia</button>
      </form>
    </>
  );
}
