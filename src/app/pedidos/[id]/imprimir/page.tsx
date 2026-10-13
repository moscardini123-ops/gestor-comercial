import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { brl, dataBR } from "@/lib/format";
import { getEmpresa } from "@/lib/empresa";
import { Folha, CabecalhoEmpresa, QuadroCliente } from "@/components/Folha";
import { ImprimirBtn } from "@/components/ImprimirBtn";
import { TextoFormatado } from "@/components/TextoFormatado";

export const dynamic = "force-dynamic";

export default async function ImprimirPedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [p, empresa] = await Promise.all([
    prisma.pedido.findUnique({ where: { id: Number(id) }, include: { cliente: true, itens: true, termo: true } }),
    getEmpresa(),
  ]);
  if (!p) notFound();
  const somaQtd = p.itens.reduce((s, it) => s + it.quantidade, 0);

  return (
    <div className="-m-5">
      <div className="no-print flex items-center justify-between gap-3 px-5 py-3" style={{ background: "var(--panel)", borderBottom: "1px solid var(--border)" }}>
        <Link href={`/pedidos/${p.id}`} className="text-sm text-indigo-300">&larr; Voltar ao pedido</Link>
        <ImprimirBtn />
      </div>
      <div className="px-4 py-6">
        <Folha>
          <CabecalhoEmpresa empresa={empresa} />
          <h1 className="mb-4 text-center text-lg font-bold">Pedido de Venda Nº {p.numero}</h1>
          <QuadroCliente
            titulo="Cliente"
            linhas={[p.cliente.nome, p.cliente.cpfCnpj, [p.cliente.endereco, p.cliente.numero, p.cliente.bairro].filter(Boolean).join(", ") || null, [p.cliente.cidade, p.cliente.uf].filter(Boolean).join(" - ") || null, p.cliente.fone, p.cliente.email]}
            lado={[{ rotulo: "Número do pedido", valor: String(p.numero) }, { rotulo: "Data", valor: dataBR(p.dataPedido) }, { rotulo: "Data prevista", valor: p.dataPrevista ? dataBR(p.dataPrevista) : "" }]}
          />
          <table className="mb-4 w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-y border-slate-300 bg-slate-50 text-left">
                <th className="p-2">Item</th><th className="p-2">Código (SKU) / GTIN / NCM</th>
                <th className="p-2 text-right">Qtd</th><th className="p-2">Un</th>
                <th className="p-2 text-right">Preço un</th><th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {p.itens.map((it) => (
                <tr key={it.id} className="border-b border-slate-200 align-top">
                  <td className="p-2">{it.descricao}</td><td className="p-2 text-slate-600">{it.codigo || "—"}</td>
                  <td className="p-2 text-right">{it.quantidade.toFixed(2)}</td><td className="p-2">{it.unidade}</td>
                  <td className="p-2 text-right">{brl(it.valorUnitario)}</td><td className="p-2 text-right">{brl(it.quantidade * it.valorUnitario)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mb-4 flex justify-between gap-6 text-[12px]">
            <div className="text-slate-700"><div><b>Número de itens:</b> {p.itens.length}</div><div><b>Soma das quantidades:</b> {somaQtd.toFixed(2)}</div></div>
            <div className="w-64">
              <div className="flex justify-between py-0.5"><span>Total de produtos</span><span>{brl(p.totalProdutos)}</span></div>
              <div className="flex justify-between py-0.5"><span>Frete</span><span>{brl(p.valorFrete)}</span></div>
              {p.valorDesconto > 0 && <div className="flex justify-between py-0.5"><span>Desconto</span><span>- {brl(p.valorDesconto)}</span></div>}
              <div className="flex justify-between border-t border-slate-300 py-1 font-bold"><span>Total do pedido</span><span>{brl(p.totalPedido)}</span></div>
            </div>
          </div>
          <div className="mb-4 flex gap-8 border-y border-slate-300 py-2 text-[12px]"><div><b>Peso Bruto</b> {p.pesoBruto.toFixed(3)}</div><div><b>Peso Líquido</b> {p.pesoLiquido.toFixed(3)}</div></div>
          {(p.obs || p.termo) && (
            <div className="text-[11px] leading-relaxed">
              <div className="mb-1 font-bold">Observações</div>
              {p.obs && <TextoFormatado texto={p.obs} className="mb-3" />}
              {p.termo && <TextoFormatado texto={p.termo.conteudo} />}
            </div>
          )}
        </Folha>
      </div>
    </div>
  );
}
