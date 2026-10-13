import { prisma } from "@/lib/db";

export type Entidade = "pedido" | "ordem" | "nota";

export async function registrarSituacao(
  entidade: Entidade,
  entidadeId: number,
  de: string | null,
  para: string,
  observacao?: string | null,
  autor?: string | null,
) {
  await prisma.historicoSituacao.create({
    data: { entidade, entidadeId, de: de ?? null, para, observacao: observacao || null, autor: autor || null },
  });
}

export function listarHistorico(entidade: Entidade, entidadeId: number) {
  return prisma.historicoSituacao.findMany({
    where: { entidade, entidadeId },
    orderBy: { criadoEm: "desc" },
  });
}
