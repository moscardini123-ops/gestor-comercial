import { prisma } from "@/lib/db";
import { brl } from "@/lib/format";
import { PageHeader, Card, DataTable, Th, Td, Empty } from "@/components/ui";

export const dynamic = "force-dynamic";

const CUSTO_VARIAVEL_VENDA = 128;
const CUSTO_FIXO_MES = 6199;
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export default async function FinancasPage() {
  const pedidos = await prisma.pedido.findMany({ select: { dataPedido: true, totalPedido: true } });

  const porMes = new Map<string, { receita: number; vendas: number }>();
  for (const p of pedidos) {
    const d = p.dataPedido;
    const chave = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const cur = porMes.get(chave) ?? { receita: 0, vendas: 0 };
    cur.receita += p.totalPedido; cur.vendas += 1;
    porMes.set(chave, cur);
  }
  const linhas = [...porMes.entries()]
    .map(([k, v]) => {
      const [ano, mes] = k.split("-").map(Number);
      const resultado = v.receita - v.vendas * CUSTO_VARIAVEL_VENDA - CUSTO_FIXO_MES;
      const contribMedia = v.vendas ? (v.receita - v.vendas * CUSTO_VARIAVEL_VENDA) / v.vendas : 0;
      return { k, label: `${MESES[mes]}/${ano}`, ...v, resultado, contribMedia };
    })
    .sort((a, b) => (a.k < b.k ? 1 : -1))
    .slice(0, 12);

  return (
    <>
      <PageHeader title="Fechamento" subtitle="Resultado por mês pelo modelo de contribuição." />
      <Card className="mb-5">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Modelo: <b>resultado = Σ(valor da venda − {brl(CUSTO_VARIAVEL_VENDA)}) − custo fixo {brl(CUSTO_FIXO_MES)}</b>.
          O custo variável por venda e o custo fixo são parâmetros do gerencial; ajuste conforme o custo real apurado.
          Não inclui estoque nem dívida, de propósito.
        </p>
      </Card>
      {linhas.length === 0 ? (
        <Empty>Sem pedidos para calcular. Registre vendas em Pedidos de Venda.</Empty>
      ) : (
        <DataTable head={<><Th>Mês</Th><Th right>Vendas</Th><Th right>Receita</Th><Th right>Contrib. média/venda</Th><Th right>Resultado</Th></>}>
          {linhas.map((l) => (
            <tr key={l.k} className="lin">
              <Td>{l.label}</Td>
              <Td right>{l.vendas}</Td>
              <Td right>{brl(l.receita)}</Td>
              <Td right>{brl(l.contribMedia)}</Td>
              <Td right><span style={{ color: l.resultado >= 0 ? "#34d399" : "#f87171" }}>{brl(l.resultado)}</span></Td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
