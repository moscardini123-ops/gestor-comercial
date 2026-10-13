import Link from "next/link";
import { Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";

type Init = Partial<{
  nome: string; nomeFantasia: string | null; tipoPessoa: string; papel: string; cpfCnpj: string | null;
  ie: string | null; email: string | null; fone: string | null; endereco: string | null; numero: string | null;
  bairro: string | null; cep: string | null; cidade: string | null; uf: string | null;
}>;

export function ClienteForm({ action, inicial, rotuloBotao = "Salvar cadastro" }: { action: (fd: FormData) => void | Promise<void>; inicial?: Init; rotuloBotao?: string }) {
  return (
    <form action={action} className="space-y-5">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome / Razão social"><input name="nome" required defaultValue={inicial?.nome} className={inputClass} style={inputStyle} placeholder="Exemplo: Maria Silva" /></Field>
          <Field label="Nome fantasia"><input name="nomeFantasia" defaultValue={inicial?.nomeFantasia ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Bike Center" /></Field>
          <Field label="Papel">
            <select name="papel" defaultValue={inicial?.papel ?? "cliente"} className={inputClass} style={inputStyle}>
              <option value="cliente">cliente</option><option value="fornecedor">fornecedor</option>
              <option value="transportador">transportador</option><option value="outro">outro</option>
            </select>
          </Field>
          <Field label="Tipo de pessoa">
            <select name="tipoPessoa" defaultValue={inicial?.tipoPessoa ?? "F"} className={inputClass} style={inputStyle}>
              <option value="F">Física</option><option value="J">Jurídica</option><option value="E">Estrangeiro</option>
            </select>
          </Field>
          <Field label="CPF / CNPJ"><input name="cpfCnpj" defaultValue={inicial?.cpfCnpj ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 123.456.789-00" /></Field>
          <Field label="Inscrição estadual"><input name="ie" defaultValue={inicial?.ie ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Isento" /></Field>
          <Field label="E-mail"><input name="email" type="email" defaultValue={inicial?.email ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: maria@email.com" /></Field>
          <Field label="Telefone"><input name="fone" defaultValue={inicial?.fone ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: (21) 99999-8888" /></Field>
          <Field label="Endereço"><input name="endereco" defaultValue={inicial?.endereco ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Rua das Flores" /></Field>
          <Field label="Número"><input name="numero" defaultValue={inicial?.numero ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 100" /></Field>
          <Field label="Bairro"><input name="bairro" defaultValue={inicial?.bairro ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Centro" /></Field>
          <Field label="CEP"><input name="cep" defaultValue={inicial?.cep ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 24000-000" /></Field>
          <Field label="Cidade"><input name="cidade" defaultValue={inicial?.cidade ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Niterói" /></Field>
          <Field label="UF"><input name="uf" maxLength={2} defaultValue={inicial?.uf ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: RJ" /></Field>
        </div>
      </Card>
      <div className="flex gap-2">
        <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>{rotuloBotao}</button>
        <Link href="/clientes" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
      </div>
    </form>
  );
}
