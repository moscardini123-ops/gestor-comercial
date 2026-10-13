import Link from "next/link";
import { Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";
import { ItensEditor, type Linha } from "@/components/ItensEditor";
import { SITUACOES_NF, FRETE_POR_CONTA } from "@/lib/domain";

type NotaInit = {
  cliente?: { nome: string; cpfCnpj: string | null };
  tipoNota?: string;
  serie?: number;
  naturezaOperacao?: string | null;
  situacao?: number;
  fretePorConta?: string;
  vendedor?: string | null;
  valorFrete?: number;
  valorDesconto?: number;
  obs?: string | null;
  itens?: { descricao: string; unidade: string; quantidade: number; valorUnitario: number }[];
};

export function NotaForm({
  action, inicial, rotuloBotao = "Salvar nota", travarSituacao = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  inicial?: NotaInit;
  rotuloBotao?: string;
  travarSituacao?: boolean;
}) {
  const linhas: Linha[] | undefined = inicial?.itens?.map((i) => ({ descricao: i.descricao, unidade: i.unidade, quantidade: i.quantidade, valorUnitario: i.valorUnitario }));
  return (
    <form action={action} className="space-y-5">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Destinatario"><input name="cliente" required defaultValue={inicial?.cliente?.nome} className={inputClass} style={inputStyle} placeholder="Exemplo: Maria Silva" /></Field>
          <Field label="CPF / CNPJ" hint="Opcional"><input name="cpfCnpj" defaultValue={inicial?.cliente?.cpfCnpj ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 12.345.678/0001-90" /></Field>
          <Field label="Tipo">
            <select name="tipoNota" defaultValue={inicial?.tipoNota ?? "S"} className={inputClass} style={inputStyle}>
              <option value="S">Saida</option>
              <option value="E">Entrada</option>
            </select>
          </Field>
          <Field label="Serie"><input type="number" name="serie" defaultValue={inicial?.serie ?? 1} className={inputClass} style={inputStyle} /></Field>
          <Field label="Natureza da operacao"><input name="naturezaOperacao" defaultValue={inicial?.naturezaOperacao ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Venda de mercadoria" /></Field>
          <Field label="Situacao" hint={travarSituacao ? "Use \"Trocar situacao\" na tela da nota para registrar no historico" : undefined}>
            <select name="situacao" defaultValue={inicial?.situacao ?? 1} disabled={travarSituacao} className={inputClass} style={inputStyle}>
              {SITUACOES_NF.map((s) => <option key={s.codigo} value={s.codigo}>{s.nome}</option>)}
            </select>
          </Field>
          <Field label="Frete por conta">
            <select name="fretePorConta" defaultValue={inicial?.fretePorConta ?? "R"} className={inputClass} style={inputStyle}>
              {Object.entries(FRETE_POR_CONTA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Vendedor"><input name="vendedor" defaultValue={inicial?.vendedor ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Joao" /></Field>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Itens</h2>
        <ItensEditor name="itens" initial={linhas} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Frete (R$)"><input type="number" step="0.01" min="0" name="valorFrete" defaultValue={inicial?.valorFrete ?? 0} className={inputClass} style={inputStyle} /></Field>
          <Field label="Desconto (R$)"><input type="number" step="0.01" min="0" name="valorDesconto" defaultValue={inicial?.valorDesconto ?? 0} className={inputClass} style={inputStyle} /></Field>
        </div>
      </Card>

      <Card>
        <Field label="Observacoes"><textarea name="obs" rows={2} defaultValue={inicial?.obs ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: nota referente ao pedido 1004" /></Field>
      </Card>

      <div className="flex gap-2">
        <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>{rotuloBotao}</button>
        <Link href="/notas-fiscais" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
      </div>
    </form>
  );
}
