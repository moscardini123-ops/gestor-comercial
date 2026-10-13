import Link from "next/link";
import { Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";

export function TermoForm({ action, inicial, rotuloBotao = "Salvar termo" }: { action: (fd: FormData) => void | Promise<void>; inicial?: { nome?: string; conteudo?: string }; rotuloBotao?: string }) {
  return (
    <form action={action} className="space-y-5">
      <Card>
        <Field label="Nome do termo"><input name="nome" required defaultValue={inicial?.nome} className={inputClass} style={inputStyle} placeholder="Exemplo: Termo de garantia 12 meses" /></Field>
        <div className="mt-4">
          <Field label="Conteúdo" hint='Use **negrito** e "- " para itens. Será impresso no documento.'>
            <textarea name="conteudo" required rows={18} defaultValue={inicial?.conteudo} className={inputClass} style={{ ...inputStyle, fontFamily: "ui-monospace, monospace", fontSize: 13 }} placeholder="Exemplo: **1. Cobertura da Garantia** ..." />
          </Field>
        </div>
      </Card>
      <div className="flex gap-2">
        <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>{rotuloBotao}</button>
        <Link href="/termos" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
      </div>
    </form>
  );
}
