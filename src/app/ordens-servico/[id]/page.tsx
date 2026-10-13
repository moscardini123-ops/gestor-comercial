import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { brl, dataBR } from "@/lib/format";
import { PageHeader, Card, DataTable, Th, Td } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import { toneOS } from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function OrdemDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await prisma.ordemServico.findUnique({ where: { id: Number(id) }, include: { cliente: true, itens: true } });
  if (!o) notFound();

  return (
    <>
      <PageHeader title={`Ordem de servico #${o.numero}`} subtitle={`Aberta em ${dataBR(o.dataAbertura)}`}
        action={<StatusPill label={o.situacao} tone={toneOS(o.situacao)} />} />
      <Link href="/ordens-servico" className="mb-4 inline-block text-sm text-indigo-600 dark:text-indigo-300">&larr; Voltar as ordens</Link>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Cliente</h2>
          <p className="mt-2 font-medium">{o.cliente.nome}</p>
          {o.cliente.cpfCnpj && <p className="text-sm" style={{ color: "var(--muted)" }}>{o.cliente.cpfCnpj}</p>}
        </Card>
        <Card className="md:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Equipamento</h2>
          <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt style={{ color: "var(--muted)" }}>Equipamento</dt><dd>{o.equipamento || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Numero de serie</dt><dd>{o.numeroSerie || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Tecnico</dt><dd>{o.tecnico || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Previsao</dt><dd>{dataBR(o.dataPrevista)}</dd></div>
          </dl>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card><h3 className="text-sm font-semibold">Defeito relatado</h3><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{o.defeitoRelatado || "—"}</p></Card>
        <Card><h3 className="text-sm font-semibold">Diagnostico</h3><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{o.diagnostico || "—"}</p></Card>
        <Card><h3 className="text-sm font-semibold">Solucao</h3><p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{o.solucao || "—"}</p></Card>
      </div>

      <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Servicos e pecas</h2>
      <DataTable head={<><Th>Tipo</Th><Th>Descricao</Th><Th right>Qtd</Th><Th right>Valor unit.</Th><Th right>Total</Th></>}>
        {o.itens.map((it) => (
          <tr key={it.id}>
            <Td>{it.tipo === "peca" ? "Peca" : "Servico"}</Td><Td>{it.descricao}</Td>
            <Td right>{it.quantidade}</Td><Td right>{brl(it.valorUnitario)}</Td><Td right>{brl(it.quantidade * it.valorUnitario)}</Td>
          </tr>
        ))}
      </DataTable>

      <div className="mt-4 flex justify-end">
        <Card className="w-full max-w-xs">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between"><dt style={{ color: "var(--muted)" }}>Servicos</dt><dd className="tabular-nums">{brl(o.valorServicos)}</dd></div>
            <div className="flex justify-between"><dt style={{ color: "var(--muted)" }}>Pecas</dt><dd className="tabular-nums">{brl(o.valorPecas)}</dd></div>
            <div className="flex justify-between border-t pt-1.5 font-semibold" style={{ borderColor: "var(--border)" }}><dt>Total</dt><dd className="tabular-nums">{brl(o.valorTotal)}</dd></div>
          </dl>
        </Card>
      </div>
      {o.obs && <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}><strong>Obs.:</strong> {o.obs}</p>}
    </>
  );
}
