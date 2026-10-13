import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { brl, dataBR } from "@/lib/format";
import { getEmpresa } from "@/lib/empresa";
import { Folha, CabecalhoEmpresa, QuadroCliente } from "@/components/Folha";
import { ImprimirBtn } from "@/components/ImprimirBtn";
import { TextoFormatado } from "@/components/TextoFormatado";

export const dynamic = "force-dynamic";

export default async function ImprimirOrdem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [o, empresa] = await Promise.all([
    prisma.ordemServico.findUnique({ where: { id: Number(id) }, include: { cliente: true, itens: true, termo: true } }),
    getEmpresa(),
  ]);
  if (!o) notFound();
  const upgrade = o.tipo === "upgrade";
  const diferenca = (o.valorNovo || 0) - (o.avaliacaoUsado || 0);

  return (
    <div className="-m-5">
      <div className="no-print flex items-center justify-between gap-3 px-5 py-3" style={{ background: "var(--panel)", borderBottom: "1px solid var(--border)" }}>
        <Link href={`/ordens-servico/${o.id}`} className="text-sm text-indigo-300">&larr; Voltar à ordem</Link>
        <ImprimirBtn />
      </div>
      <div className="px-4 py-6">
        <Folha>
          <CabecalhoEmpresa empresa={empresa} />
          <h1 className="mb-4 text-center text-lg font-bold">Ordem de serviço Nº {o.numero}{upgrade ? " — Upgrade" : ""}</h1>
          <QuadroCliente
            titulo="Cliente"
            linhas={[o.cliente.nome, o.cliente.cpfCnpj, [o.cliente.endereco, o.cliente.numero, o.cliente.bairro].filter(Boolean).join(", ") || null, [o.cliente.cidade, o.cliente.uf].filter(Boolean).join(" - ") || null, o.cliente.fone, o.cliente.email]}
            lado={[{ rotulo: "Número da OS", valor: String(o.numero) }, { rotulo: "Data", valor: dataBR(o.dataAbertura) }, { rotulo: "Data de finalização", valor: o.dataConclusao ? dataBR(o.dataConclusao) : "" }]}
          />

          {upgrade && (
            <div className="mb-4 rounded border border-slate-300 p-3 text-[12px]">
              <div className="mb-1 font-bold">Serviços executados (o equipamento que o cliente leva)</div>
              <div>{o.equipamento || "—"}{o.serialNovo ? ` — SERIAL ${o.serialNovo}` : ""} · {brl(o.valorNovo)}</div>
              <div className="mt-2 font-bold">Considerações finais (entra como parte do pagamento)</div>
              <div>{o.usadoRecebido || "(usado recebido)"} — COMO PARTE DE PAGAMENTO — {brl(o.avaliacaoUsado)}</div>
              <div className="mt-2 font-bold">Diferença paga pelo cliente: {brl(diferenca)}</div>
            </div>
          )}

          {(o.equipamento || o.defeitoRelatado) && !upgrade && (
            <div className="mb-4 grid grid-cols-2 gap-3 text-[12px]">
              <div className="rounded border border-slate-300 p-3"><b>Equipamento:</b> {o.equipamento || "—"}{o.numeroSerie ? ` · SERIAL ${o.numeroSerie}` : ""}<br /><b>Técnico:</b> {o.tecnico || "—"}</div>
              <div className="rounded border border-slate-300 p-3"><b>Defeito:</b> {o.defeitoRelatado || "—"}<br /><b>Solução:</b> {o.solucao || "—"}</div>
            </div>
          )}

          {o.itens.length > 0 && (
            <table className="mb-4 w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-y border-slate-300 bg-slate-50 text-left">
                  <th className="p-2">Item</th><th className="p-2 text-right">Qtd</th>
                  <th className="p-2 text-right">Preço un</th><th className="p-2 text-right">Valor total</th>
                </tr>
              </thead>
              <tbody>
                {o.itens.map((it) => (
                  <tr key={it.id} className="border-b border-slate-200">
                    <td className="p-2">{it.tipo === "peca" ? "Peça" : "Serviço"} — {it.descricao}</td>
                    <td className="p-2 text-right">{it.quantidade.toFixed(2)}</td>
                    <td className="p-2 text-right">{brl(it.valorUnitario)}</td>
                    <td className="p-2 text-right">{brl(it.quantidade * it.valorUnitario)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mb-4 flex justify-end text-[12px]">
            <div className="w-64">
              <div className="flex justify-between py-0.5"><span>Total serviços/peças</span><span>{brl(o.valorServicos + o.valorPecas)}</span></div>
              <div className="flex justify-between border-t border-slate-300 py-1 font-bold"><span>Total da ordem</span><span>{brl(o.valorTotal)}</span></div>
            </div>
          </div>

          {(o.obs || o.termo) && (
            <div className="text-[11px] leading-relaxed">
              <div className="mb-1 font-bold">Descrição do serviço / Termo de garantia</div>
              {o.obs && <TextoFormatado texto={o.obs} className="mb-3" />}
              {o.termo && <TextoFormatado texto={o.termo.conteudo} />}
            </div>
          )}
        </Folha>
      </div>
    </div>
  );
}
