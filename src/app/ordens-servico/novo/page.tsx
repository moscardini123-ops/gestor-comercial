import Link from "next/link";
import { criarOrdem } from "../actions";
import { PageHeader, Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";
import { ItensEditor } from "@/components/ItensEditor";
import { SITUACOES_OS } from "@/lib/domain";

export default function NovaOrdem() {
  return (
    <>
      <PageHeader title="Nova ordem de servico" subtitle="Equipamento, defeito e servicos executados." />
      <Link href="/ordens-servico" className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar as ordens</Link>

      <form action={criarOrdem} className="space-y-5">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente"><input name="cliente" required className={inputClass} style={inputStyle} placeholder="Exemplo: Maria Silva" /></Field>
            <Field label="CPF / CNPJ" hint="Opcional"><input name="cpfCnpj" className={inputClass} style={inputStyle} placeholder="Exemplo: 123.456.789-00" /></Field>
            <Field label="Situacao">
              <select name="situacao" className={inputClass} style={inputStyle} defaultValue="Aberta">
                {SITUACOES_OS.map((s) => <option key={s.nome} value={s.nome}>{s.nome}</option>)}
              </select>
            </Field>
            <Field label="Previsao de conclusao"><input type="date" name="dataPrevista" className={inputClass} style={inputStyle} /></Field>
            <Field label="Equipamento"><input name="equipamento" className={inputClass} style={inputStyle} placeholder="Exemplo: Notebook Dell Inspiron" /></Field>
            <Field label="Numero de serie"><input name="numeroSerie" className={inputClass} style={inputStyle} placeholder="Exemplo: SN-48213" /></Field>
            <Field label="Tecnico responsavel"><input name="tecnico" className={inputClass} style={inputStyle} placeholder="Exemplo: Carlos" /></Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Defeito relatado"><textarea name="defeitoRelatado" rows={3} className={inputClass} style={inputStyle} placeholder="Exemplo: nao liga" /></Field>
            <Field label="Diagnostico"><textarea name="diagnostico" rows={3} className={inputClass} style={inputStyle} placeholder="Exemplo: fonte queimada" /></Field>
            <Field label="Solucao"><textarea name="solucao" rows={3} className={inputClass} style={inputStyle} placeholder="Exemplo: troca da fonte" /></Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Servicos e pecas</h2>
          <ItensEditor name="itens" comTipo />
        </Card>

        <Card>
          <Field label="Observacoes"><textarea name="obs" rows={2} className={inputClass} style={inputStyle} placeholder="Exemplo: cliente retira na loja" /></Field>
        </Card>

        <div className="flex gap-2">
          <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>Salvar ordem</button>
          <Link href="/ordens-servico" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
        </div>
      </form>
    </>
  );
}
