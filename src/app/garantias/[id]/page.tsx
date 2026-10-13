import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { dataBR } from "@/lib/format";
import { PageHeader, Card } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import { TrocarSituacao } from "@/components/TrocarSituacao";
import { trocarStatusGarantia } from "../actions";
import type { Tone } from "@/lib/domain";

export const dynamic = "force-dynamic";

const STATUS = ["Aberta", "Em analise", "Aguardando peca", "Resolvida", "Negada"];
const TONE: Record<string, Tone> = { "Aberta": "slate", "Em analise": "indigo", "Aguardando peca": "amber", "Resolvida": "emerald", "Negada": "red" };

export default async function GarantiaDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await prisma.garantia.findUnique({ where: { id: Number(id) } });
  if (!g) notFound();
  return (
    <>
      <PageHeader title={`Garantia ${g.protocolo}`} subtitle={`Aberta em ${dataBR(g.dataAbertura)}`}
        action={<StatusPill label={g.status} tone={TONE[g.status] ?? "slate"} />} />
      <Link href="/garantias" className="mb-4 inline-block text-sm text-indigo-300">&larr; Voltar às garantias</Link>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt style={{ color: "var(--muted)" }}>Cliente</dt><dd>{g.clienteNome}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>CPF</dt><dd>{g.cpf || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Modelo</dt><dd>{g.modelo || "—"}</dd></div>
            <div><dt style={{ color: "var(--muted)" }}>Serial</dt><dd>{g.serial || "—"}</dd></div>
            <div className="col-span-2"><dt style={{ color: "var(--muted)" }}>Problema relatado</dt><dd>{g.problema || "—"}</dd></div>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--muted)" }}>Atualizar status</h2>
          <TrocarSituacao action={trocarStatusGarantia} id={g.id} atual={g.status} opcoes={STATUS.map((s) => ({ valor: s, nome: s }))} />
        </Card>
      </div>
      {g.obs && <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}><strong>Obs.:</strong> {g.obs}</p>}
    </>
  );
}
