import Link from "next/link";
import { Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";
import { ItensEditor, type Linha } from "@/components/ItensEditor";
import { SITUACOES_PEDIDO, FRETE_POR_CONTA } from "@/lib/domain";
import { dataInput } from "@/lib/format";

type PedidoInit = {
  cliente?: { nome: string; cpfCnpj: string | null };
  situacao?: string;
  dataPrevista?: Date | null;
  condicaoPagamento?: string | null;
  vendedor?: string | null;
  fretePorConta?: string;
  formaEnvio?: string | null;
  codigoRastreamento?: string | null;
  valorFrete?: number;
  valorDesconto?: number;
  obs?: string | null;
  termoId?: number | null;
  itens?: { descricao: string; unidade: string; quantidade: number; valorUnitario: number }[];
};

export function PedidoForm({
  action, inicial, rotuloBotao = "Salvar pedido", travarSituacao = false, termos = [],
}: {
  action: (formData: FormData) => void | Promise<void>;
  inicial?: PedidoInit;
  rotuloBotao?: string;
  travarSituacao?: boolean;
  termos?: { id: number; nome: string }[];
}) {
  const linhas: Linha[] | undefined = inicial?.itens?.map((i) => ({ descricao: i.descricao, unidade: i.unidade, quantidade: i.quantidade, valorUnitario: i.valorUnitario }));
  return (
    <form action={action} className="space-y-5">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cliente"><input name="cliente" required defaultValue={inicial?.cliente?.nome} className={inputClass} style={inputStyle} placeholder="Exemplo: Maria Silva" /></Field>
          <Field label="CPF / CNPJ" hint="Opcional"><input name="cpfCnpj" defaultValue={inicial?.cliente?.cpfCnpj ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 123.456.789-00" /></Field>
          <Field label="Situacao" hint={travarSituacao ? "Use \"Trocar situacao\" na tela do pedido para registrar no historico" : undefined}>
            <select name="situacao" defaultValue={inicial?.situacao ?? "Em aberto"} disabled={travarSituacao} className={inputClass} style={inputStyle}>
              {SITUACOES_PEDIDO.map((s) => <option key={s.nome} value={s.nome}>{s.nome}</option>)}
            </select>
          </Field>
          <Field label="Previsao de entrega"><input type="date" name="dataPrevista" defaultValue={dataInput(inicial?.dataPrevista)} className={inputClass} style={inputStyle} /></Field>
          <Field label="Condicao de pagamento"><input name="condicaoPagamento" defaultValue={inicial?.condicaoPagamento ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: 30/60 dias" /></Field>
          <Field label="Vendedor"><input name="vendedor" defaultValue={inicial?.vendedor ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Joao" /></Field>
          <Field label="Frete por conta">
            <select name="fretePorConta" defaultValue={inicial?.fretePorConta ?? "R"} className={inputClass} style={inputStyle}>
              {Object.entries(FRETE_POR_CONTA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Forma de envio"><input name="formaEnvio" defaultValue={inicial?.formaEnvio ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: Correios PAC" /></Field>
          <Field label="Codigo de rastreio" hint="A transportadora e deduzida do codigo"><input name="codigoRastreamento" defaultValue={inicial?.codigoRastreamento ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: AA123456789BR" /></Field>
          <Field label="Termo de garantia" hint="Opcional; sai no documento impresso">
            <select name="termoId" defaultValue={inicial?.termoId ?? ""} className={inputClass} style={inputStyle}>
              <option value="">Nenhum</option>
              {termos.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </Field>
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
        <Field label="Observacoes"><textarea name="obs" rows={3} defaultValue={inicial?.obs ?? ""} className={inputClass} style={inputStyle} placeholder="Exemplo: entregar no periodo da tarde" /></Field>
      </Card>

      <div className="flex gap-2">
        <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>{rotuloBotao}</button>
        <Link href="/pedidos" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
      </div>
    </form>
  );
}
