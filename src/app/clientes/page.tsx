import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeader, PrimaryLink, DataTable, Th, Td, Empty } from "@/components/ui";

export const dynamic = "force-dynamic";

const ABAS = [
  { key: "", label: "todos" }, { key: "cliente", label: "cliente" }, { key: "fornecedor", label: "fornecedor" },
  { key: "transportador", label: "transportador" }, { key: "outro", label: "outro" },
];

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string; papel?: string }> }) {
  const { q, papel } = await searchParams;
  const where = {
    ...(papel ? { papel } : {}),
    ...(q ? { OR: [{ nome: { contains: q } }, { cpfCnpj: { contains: q } }, { email: { contains: q } }] } : {}),
  };
  const [clientes, total] = await Promise.all([
    prisma.cliente.findMany({ where, orderBy: { nome: "asc" }, take: 200 }),
    prisma.cliente.count(),
  ]);

  return (
    <>
      <PageHeader title="Clientes e Fornecedores" subtitle="Cadastro de clientes, fornecedores e transportadores."
        action={<PrimaryLink href="/clientes/novo">Incluir cadastro</PrimaryLink>} />

      <form className="mb-3 flex flex-wrap gap-2" action="/clientes">
        <input name="q" defaultValue={q} placeholder="Exemplo: Maria ou 123.456.789-00"
          className="min-w-[16rem] flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--ink)" }} />
        <button className="rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>Pesquisar</button>
      </form>

      <div className="mb-4 flex flex-wrap gap-1 border-b pb-2 text-sm" style={{ borderColor: "var(--border)" }}>
        {ABAS.map((a) => {
          const on = (papel ?? "") === a.key;
          const href = a.key ? `/clientes?papel=${a.key}` : "/clientes";
          return <Link key={a.label} href={href} className="rounded-md px-3 py-1" style={on ? { background: "var(--brand)", color: "#fff", fontWeight: 600 } : { color: "var(--muted)" }}>{a.label}</Link>;
        })}
        <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>{total} no total</span>
      </div>

      {clientes.length === 0 ? (
        <Empty>Nenhum cadastro. Comece em &quot;Incluir cadastro&quot;.</Empty>
      ) : (
        <DataTable head={<><Th>Nome</Th><Th>CPF/CNPJ</Th><Th>Cidade</Th><Th>Contato</Th></>}>
          {clientes.map((c) => (
            <tr key={c.id} className="lin">
              <Td><Link href={`/clientes/${c.id}`} className="font-medium text-indigo-300">{c.nome}</Link></Td>
              <Td>{c.cpfCnpj || "—"}</Td>
              <Td>{c.cidade ? `${c.cidade}${c.uf ? " - " + c.uf : ""}` : "—"}</Td>
              <Td>{c.email || c.fone || "—"}</Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
