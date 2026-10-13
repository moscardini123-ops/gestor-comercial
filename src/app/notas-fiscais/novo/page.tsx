import Link from "next/link";
import { criarNota } from "../actions";
import { PageHeader, Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";
import { ItensEditor } from "@/components/ItensEditor";
import { SITUACOES_NF, FRETE_POR_CONTA } from "@/lib/domain";

export default function NovaNota() {
  return (
    <>
      <PageHeader title="Nova nota fiscal" subtitle="Dados fiscais, destinatario e itens." />
      <Link href="/notas-fiscais" className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar as notas</Link>

      <form action={criarNota} className="space-y-5">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Destinatario"><input name="cliente" required className={inputClass} style={inputStyle} placeholder="Exemplo: Maria Silva" /></Field>
            <Field label="CPF / CNPJ" hint="Opcional"><input name="cpfCnpj" className={inputClass} style={inputStyle} placeholder="Exemplo: 12.345.678/0001-90" /></Field>
            <Field label="Tipo">
              <select name="tipoNota" className={inputClass} style={inputStyle} defaultValue="S">
                <option value="S">Saida</option>
                <option value="E">Entrada</option>
              </select>
            </Field>
            <Field label="Serie"><input type="number" name="serie" defaultValue={1} className={inputClass} style={inputStyle} /></Field>
            <Field label="Natureza da operacao"><input name="naturezaOperacao" className={inputClass} style={inputStyle} placeholder="Exemplo: Venda de mercadoria" /></Field>
            <Field label="Situacao">
              <select name="situacao" className={inputClass} style={inputStyle} defaultValue={1}>
                {SITUACOES_NF.map((s) => <option key={s.codigo} value={s.codigo}>{s.nome}</option>)}
              </select>
            </Field>
            <Field label="Frete por conta">
              <select name="fretePorConta" className={inputClass} style={inputStyle} defaultValue="R">
                {Object.entries(FRETE_POR_CONTA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Vendedor"><input name="vendedor" className={inputClass} style={inputStyle} placeholder="Exemplo: Joao" /></Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Itens</h2>
          <ItensEditor name="itens" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Frete (R$)"><input type="number" step="0.01" min="0" name="valorFrete" defaultValue="0" className={inputClass} style={inputStyle} /></Field>
            <Field label="Desconto (R$)"><input type="number" step="0.01" min="0" name="valorDesconto" defaultValue="0" className={inputClass} style={inputStyle} /></Field>
          </div>
        </Card>

        <Card>
          <Field label="Observacoes"><textarea name="obs" rows={2} className={inputClass} style={inputStyle} placeholder="Exemplo: nota referente ao pedido 1004" /></Field>
        </Card>

        <div className="flex gap-2">
          <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>Salvar nota</button>
          <Link href="/notas-fiscais" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
        </div>
      </form>
    </>
  );
}
