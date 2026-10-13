import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { brl, dataBR } from "@/lib/format";
import { PageHeader, Card, DataTable, Th, Td } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import { toneNF, FRETE_POR_CONTA } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function NotaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = await prisma.notaFiscal.findUnique({ where: { id: Number(id) }, include: { cliente: true, itens: true } });
  if (!n) notFound();

  return (
    <>
      <PageHeader title={`Nota fiscal #${n.numero}`} subtitle={`Serie ${n.serie} · emissao ${dataBR(n.dataEmissao)}`}
        action={<StatusPill label={n.descricaoSituacao} tone={toneNF(n.situacao)} />} />
      <Link href="/notas-fiscais" className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar as notas</Link>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Destinatario</h2>
          <p className="mt-2 font-medium">{n.cliente.nome}</p>
          {n.cliente.cpfCnpj && <p className="text-sm" style={{ color: "var(--muted)" }}>{n.cliente.cpfCnpj}</p>}
        </Card>
        <Card className="md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Dados fiscais</h2>
          <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt style={{ color: "var(--muted)" }}>Tipo</dt><dd>{n.tipoNota === "E" ? "Entrada" : "Saida"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Natureza da operacao</dt><dd>{n.naturezaOperacao || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Frete por conta</dt><dd>{FRETE_POR_CONTA[n.fretePorConta] || n.fretePorConta}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Vendedor</dt><dd>{n.vendedor || "—"}</dd></div>
            <div className="col-span-2"><dt style={{ color: "var(--muted)" }}>Chave de acesso</dt><dd className="break-all">{n.chaveAcesso || "— (gerada na autorizacao)"}</dd></div>
          </dl>
        </Card>
      </div>

      <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Itens</h2>
      <DataTable head={<><Th>Descricao</Th><Th>Un.</Th><Th right>Qtd</Th><Th right>Valor unit.</Th><Th right>Total</Th></>}>
        {n.itens.map((it) => (
          <tr key={it.id}>
            <Td>{it.descricao}</Td><Td>{it.unidade}</Td><Td right>{it.quantidade}</Td>
            <Td right>{brl(it.valorUnitario)}</Td><Td right>{brl(it.valorTotal)}</Td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-4 flex justify-end">
        <Card className="w-full max-w-xs">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between"><dt style={{ color: "var(--muted)" }}>Produtos</dt><dd className="tabular-nums">{brl(n.valorProdutos)}</dd></div>
            <div className="flex justify-between"><dt style={{ color: "var(--muted)" }}>Frete</dt><dd className="tabular-nums">{brl(n.valorFrete)}</dd></div>
            <div className="flex justify-between"><dt style={{ color: "var(--muted)" }}>Desconto</dt><dd className="tabular-nums">- {brl(n.valorDesconto)}</dd></div>
            <div className="flex justify-between border-t pt-1.5 font-semibold" style={{ borderColor: "var(--border)" }}><dt>Valor da nota</dt><dd className="tabular-nums">{brl(n.valorNota)}</dd></div>
          </dl>
        </Card>
      </div>
      {n.obs && <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}><strong>Obs.:</strong> {n.obs}</p>}
    </>
  );
}
