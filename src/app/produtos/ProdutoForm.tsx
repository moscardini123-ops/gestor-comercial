import Link from "next/link";
import { Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";

type Init = {
  descricao?: string; sku?: string | null; gtin?: string | null; ncm?: string | null;
  tipo?: string; categoria?: string | null; preco?: number; custo?: number; estoque?: number; situacao?: string;
};

const TIPOS = ["simples", "kit", "variacao", "fabricado", "materia-prima"];

export function ProdutoForm({ action, inicial, rotuloBotao = "Salvar produto" }: { action: (fd: FormData) => void | Promise<void>; inicial?: Init; rotuloBotao?: string }) {
  return (
    <form action={action} className="space-y-5">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Descrição"><input name="descricao" required defaultValue={inicial?.descricao} className={inputClass} style={inputStyle} placeholder="Exemplo: Forerunner 165 Basic - Branca" /></Field></div>
          <Field label="Código (SKU)"><input name="sku" defaultValue={inicial?.sku ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: F165BASIC-1" /></Field>
          <Field label="GTIN / EAN"><input name="gtin" defaultValue={inicial?.gtin ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 753759326609" /></Field>
          <Field label="NCM"><input name="ncm" defaultValue={inicial?.ncm ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 8517.62.72" /></Field>
          <Field label="Categoria"><input name="categoria" defaultValue={inicial?.categoria ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Relógios" /></Field>
          <Field label="Tipo">
            <select name="tipo" defaultValue={inicial?.tipo ?? "simples"} className={inputClass} style={inputStyle}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Situação">
            <select name="situacao" defaultValue={inicial?.situacao ?? "ativo"} className={inputClass} style={inputStyle}>
              <option value="ativo">ativo</option>
              <option value="inativo">inativo</option>
            </select>
          </Field>
          <Field label="Preço (R$)"><input type="number" step="0.01" min="0" name="preco" defaultValue={inicial?.preco ?? 0} className={inputClass} style={inputStyle} /></Field>
          <Field label="Custo (R$)" hint="Uso interno, apuração de margem"><input type="number" step="0.01" name="custo" defaultValue={inicial?.custo ?? 0} className={inputClass} style={inputStyle} /></Field>
          <Field label="Estoque disponível"><input type="number" step="1" name="estoque" defaultValue={inicial?.estoque ?? 0} className={inputClass} style={inputStyle} /></Field>
        </div>
      </Card>
      <div className="flex gap-2">
        <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>{rotuloBotao}</button>
        <Link href="/produtos" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
      </div>
    </form>
  );
}
