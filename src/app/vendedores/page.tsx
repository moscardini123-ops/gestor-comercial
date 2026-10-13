import { prisma } from "@/lib/db";
import { PageHeader, PrimaryLink, DataTable, Th, Td, Empty } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function VendedoresPage() {
  const vendedores = await prisma.vendedor.findMany({ orderBy: { nome: "asc" } });
  return (
    <>
      <PageHeader title="Vendedores" subtitle="Equipe de vendas e comissão."
        action={<PrimaryLink href="/vendedores/novo">Incluir vendedor</PrimaryLink>} />
      {vendedores.length === 0 ? (
        <Empty>Nenhum vendedor cadastrado.</Empty>
      ) : (
        <DataTable head={<><Th>Nome</Th><Th>E-mail</Th><Th right>Comissão</Th><Th>Situação</Th></>}>
          {vendedores.map((v) => (
            <tr key={v.id} className="lin">
              <Td>{v.nome}</Td><Td>{v.email || "—"}</Td>
              <Td right>{v.comissaoPct}%</Td><Td>{v.situacao}</Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
