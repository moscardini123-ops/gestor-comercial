import { prisma } from "@/lib/db";

// Acha um cliente pelo nome (ou cria um basico). Simplicacao de demo.
export async function acharOuCriarCliente(nome: string, cpfCnpj?: string): Promise<number> {
  const nomeTrim = nome.trim();
  const existente = await prisma.cliente.findFirst({ where: { nome: nomeTrim } });
  if (existente) return existente.id;
  const novo = await prisma.cliente.create({ data: { nome: nomeTrim, cpfCnpj: cpfCnpj?.trim() || null } });
  return novo.id;
}

export async function proximoNumero(tabela: "pedido" | "ordemServico" | "notaFiscal"): Promise<number> {
  if (tabela === "pedido") {
    const u = await prisma.pedido.findFirst({ orderBy: { numero: "desc" } });
    return (u?.numero ?? 1000) + 1;
  }
  if (tabela === "ordemServico") {
    const u = await prisma.ordemServico.findFirst({ orderBy: { numero: "desc" } });
    return (u?.numero ?? 500) + 1;
  }
  const u = await prisma.notaFiscal.findFirst({ orderBy: { numero: "desc" } });
  return (u?.numero ?? 100) + 1;
}

type LinhaRaw = { descricao?: string; unidade?: string; quantidade?: number; valorUnitario?: number; tipo?: string };
export function parseLinhas(json: FormDataEntryValue | null): LinhaRaw[] {
  if (typeof json !== "string") return [];
  try {
    const arr = JSON.parse(json) as LinhaRaw[];
    return Array.isArray(arr) ? arr.filter((l) => (l.descricao ?? "").trim().length > 0) : [];
  } catch {
    return [];
  }
}
