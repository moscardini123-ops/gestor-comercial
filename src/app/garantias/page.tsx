import Link from "next/link";
import { prisma } from "@/lib/db";
import { dataBR } from "@/lib/format";
import { PageHeader, PrimaryLink, DataTable, Th, Td, Empty } from "@/components/ui";
import { StatusPill } from "@/components/StatusPill";
import type { Tone } from "@/lib/domain";

export const dynamic = "force-dynamic";

const TONE: Record<string, Tone> = { "Aberta": "slate", "Em analise": "indigo", "Aguardando peca": "amber", "Resolvida": "emerald", "Negada": "red" };

export default async function GarantiasPage() {
  const garantias = await prisma.garantia.findMany({ orderBy: { dataAbertura: "desc" } });
  return (
    <>
      <PageHeader title="Garantias (SAC)" subtitle="Acompanhamento de acionamentos de garantia."
        action={<PrimaryLink href="/garantias/novo">Abrir garantia</PrimaryLink>} />
      {garantias.length === 0 ? (
        <Empty>Nenhum acionamento registrado.</Empty>
      ) : (
        <DataTable head={<><Th>Protocolo</Th><Th>Cliente</Th><Th>Modelo / Serial</Th><Th>Abertura</Th><Th>Status</Th></>}>
          {garantias.map((g) => (
            <tr key={g.id} className="lin">
              <Td><Link href={`/garantias/${g.id}`} className="font-medium text-indigo-300">{g.protocolo}</Link></Td>
              <Td>{g.clienteNome}</Td>
              <Td>{[g.modelo, g.serial].filter(Boolean).join(" · ") || "—"}</Td>
              <Td>{dataBR(g.dataAbertura)}</Td>
              <Td><StatusPill label={g.status} tone={TONE[g.status] ?? "slate"} /></Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
