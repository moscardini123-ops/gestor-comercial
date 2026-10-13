import Link from "next/link";
import { Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";
import { ItensEditor, type Linha } from "@/components/ItensEditor";
import { SITUACOES_OS } from "@/lib/domain";
import { dataInput } from "@/lib/format";

type OrdemInit = {
  cliente?: { nome: string; cpfCnpj: string | null };
  situacao?: string;
  dataPrevista?: Date | null;
  equipamento?: string | null;
  numeroSerie?: string | null;
  tecnico?: string | null;
  defeitoRelatado?: string | null;
  diagnostico?: string | null;
  solucao?: string | null;
  obs?: string | null;
  itens?: { tipo: string; descricao: string; quantidade: number; valorUnitario: number }[];
};

export function OrdemForm({
  action, inicial, rotuloBotao = "Salvar ordem", travarSituacao = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  inicial?: OrdemInit;
  rotuloBotao?: string;
  travarSituacao?: boolean;
}) {
  const linhas: Linha[] | undefined = inicial?.itens?.map((i) => ({ tipo: i.tipo, descricao: i.descricao, unidade: "UN", quantidade: i.quantidade, valorUnitario: i.valorUnitario }));
  return (
    <form action={action} className="space-y-5">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cliente"><input name="cliente" required defaultValue={inicial?.cliente?.nome} className={inputClass} style={inputStyle} placeholder="Exemplo: Maria Silva" /></Field>
          <Field label="CPF / CNPJ" hint="Opcional"><input name="cpfCnpj" defaultValue={inicial?.cliente?.cpfCnpj ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 123.456.789-00" /></Field>
          <Field label="Situacao" hint={travarSituacao ? "Use \"Trocar situacao\" na tela da ordem para registrar no historico" : undefined}>
            <select name="situacao" defaultValue={inicial?.situacao ?? "Aberta"} disabled={travarSituacao} className={inputClass} style={inputStyle}>
              {SITUACOES_OS.map((s) => <option key={s.nome} value={s.nome}>{s.nome}</option>)}
            </select>
          </Field>
          <Field label="Previsao de conclusao"><input type="date" name="dataPrevista" defaultValue={dataInput(inicial?.dataPrevista)} className={inputClass} style={inputStyle} /></Field>
          <Field label="Equipamento"><input name="equipamento" defaultValue={inicial?.equipamento ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Notebook Dell Inspiron" /></Field>
          <Field label="Numero de serie"><input name="numeroSerie" defaultValue={inicial?.numeroSerie ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: SN-48213" /></Field>
          <Field label="Tecnico responsavel"><input name="tecnico" defaultValue={inicial?.tecnico ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Carlos" /></Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Defeito relatado"><textarea name="defeitoRelatado" rows={3} defaultValue={inicial?.defeitoRelatado ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: nao liga" /></Field>
          <Field label="Diagnostico"><textarea name="diagnostico" rows={3} defaultValue={inicial?.diagnostico ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: fonte queimada" /></Field>
          <Field label="Solucao"><textarea name="solucao" rows={3} defaultValue={inicial?.solucao ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: troca da fonte" /></Field>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Servicos e pecas</h2>
        <ItensEditor name="itens" comTipo initial={linhas} />
      </Card>

      <Card>
        <Field label="Observacoes"><textarea name="obs" rows={2} defaultValue={inicial?.obs ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: cliente retira na loja" /></Field>
      </Card>

      <div className="flex gap-2">
        <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>{rotuloBotao}</button>
        <Link href="/ordens-servico" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
      </div>
    </form>
  );
}
