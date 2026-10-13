import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, PrimaryLink, DataTable, Th, Td, Empty } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function TermosPage() {
  const termos = await prisma.termoGarantia.findMany({
    orderBy: { criadoEm: "desc" },
    include: { _count: { select: { pedidos: true, ordens: true } } },
  });
  return (
    <>
      <PageHeader title="Termos de Garantia" subtitle="Modelos de termo reutilizáveis, anexáveis a pedidos e ordens."
        action={<PrimaryLink href="/termos/novo">Novo termo</PrimaryLink>} />
      {termos.length === 0 ? (
        <Empty>Nenhum termo cadastrado.</Empty>
      ) : (
        <DataTable head={<><Th>Nome</Th><Th right>Em pedidos</Th><Th right>Em ordens</Th></>}>
          {termos.map((t) => (
            <tr key={t.id} className="lin">
              <Td><Link href={`/termos/${t.id}`} className="font-medium text-indigo-300">{t.nome}</Link></Td>
              <Td right>{t._count.pedidos}</Td><Td right>{t._count.ordens}</Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
