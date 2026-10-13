import Link from "next/link";
import { criarPedido } from "../actions";
import { PageHeader, Card } from "@/components/ui";
import { Field, inputClass, inputStyle } from "@/components/Field";
import { ItensEditor } from "@/components/ItensEditor";
import { SITUACOES_PEDIDO, FRETE_POR_CONTA } from "@/lib/domain";

export default function NovoPedido() {
  return (
    <>
      <PageHeader title="Novo pedido de venda" subtitle="Preencha os dados e os itens do pedido." />
      <Link href="/pedidos" className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar aos pedidos</Link>

      <form action={criarPedido} className="space-y-5">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cliente"><input name="cliente" required className={inputClass} style={inputStyle} placeholder="Exemplo: Maria Silva" /></Field>
            <Field label="CPF / CNPJ" hint="Opcional"><input name="cpfCnpj" className={inputClass} style={inputStyle} placeholder="Exemplo: 123.456.789-00" /></Field>
            <Field label="Situacao">
              <select name="situacao" className={inputClass} style={inputStyle} defaultValue="Em aberto">
                {SITUACOES_PEDIDO.map((s) => <option key={s.nome} value={s.nome}>{s.nome}</option>)}
              </select>
            </Field>
            <Field label="Previsao de entrega"><input type="date" name="dataPrevista" className={inputClass} style={inputStyle} /></Field>
            <Field label="Condicao de pagamento"><input name="condicaoPagamento" className={inputClass} style={inputStyle} placeholder="Exemplo: 30/60 dias" /></Field>
            <Field label="Vendedor"><input name="vendedor" className={inputClass} style={inputStyle} placeholder="Exemplo: Joao" /></Field>
            <Field label="Frete por conta">
              <select name="fretePorConta" className={inputClass} style={inputStyle} defaultValue="R">
                {Object.entries(FRETE_POR_CONTA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Forma de envio"><input name="formaEnvio" className={inputClass} style={inputStyle} placeholder="Exemplo: Correios PAC" /></Field>
            <Field label="Codigo de rastreio" hint="A transportadora e deduzida do codigo"><input name="codigoRastreamento" className={inputClass} style={inputStyle} placeholder="Exemplo: AA123456789BR" /></Field>
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
          <Field label="Observacoes"><textarea name="obs" rows={3} className={inputClass} style={inputStyle} placeholder="Exemplo: entregar no periodo da tarde" /></Field>
        </Card>

        <div className="flex gap-2">
          <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>Salvar pedido</button>
          <Link href="/pedidos" className="rounded-lg border px-5 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Cancelar</Link>
        </div>
      </form>
    </>
  );
}
