"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { acharOuCriarCliente, proximoNumero, parseLinhas } from "@/lib/clientes";
import { registrarSituacao } from "@/lib/historico";
import { nomeNF } from "@/lib/domain";

function dadosDoForm(formData: FormData) {
  const linhas = parseLinhas(formData.get("itens"));
  const valorProdutos = linhas.reduce((s, l) => s + (l.quantidade ?? 0) * (l.valorUnitario ?? 0), 0);
  const valorFrete = Number(formData.get("valorFrete") ?? 0) || 0;
  const valorDesconto = Number(formData.get("valorDesconto") ?? 0) || 0;
  return {
    base: {
      serie: Number(formData.get("serie") ?? 1) || 1,
      tipoNota: String(formData.get("tipoNota") ?? "S"),
      naturezaOperacao: String(formData.get("naturezaOperacao") ?? "") || null,
      fretePorConta: String(formData.get("fretePorConta") ?? "R"),
      vendedor: String(formData.get("vendedor") ?? "") || null,
      obs: String(formData.get("obs") ?? "") || null,
      valorProdutos, valorFrete, valorDesconto, valorNota: valorProdutos + valorFrete - valorDesconto,
    },
    itensCreate: linhas.map((l) => ({
      descricao: String(l.descricao), unidade: String(l.unidade ?? "UN"),
      quantidade: Number(l.quantidade ?? 1), valorUnitario: Number(l.valorUnitario ?? 0),
      valorTotal: Number(l.quantidade ?? 1) * Number(l.valorUnitario ?? 0),
    })),
  };
}

export async function criarNota(formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));
  const d = dadosDoForm(formData);
  const situacao = Number(formData.get("situacao") ?? 1) || 1;
  const nota = await prisma.notaFiscal.create({
    data: { numero: await proximoNumero("notaFiscal"), situacao, descricaoSituacao: nomeNF(situacao), clienteId, ...d.base, itens: { create: d.itensCreate } },
  });
  await registrarSituacao("nota", nota.id, null, nomeNF(situacao), "Nota criada");
  redirect(`/notas-fiscais/${nota.id}`);
}

export async function atualizarNota(id: number, formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));
  const d = dadosDoForm(formData);
  await prisma.$transaction([
    prisma.notaFiscalItem.deleteMany({ where: { notaId: id } }),
    prisma.notaFiscal.update({ where: { id }, data: { clienteId, ...d.base, itens: { create: d.itensCreate } } }),
  ]);
  redirect(`/notas-fiscais/${id}`);
}

export async function trocarSituacaoNota(formData: FormData) {
  const id = Number(formData.get("id"));
  const novoCodigo = Number(formData.get("situacao") ?? 0) || 0;
  const obs = String(formData.get("observacao") ?? "").trim() || null;
  const atual = await prisma.notaFiscal.findUnique({ where: { id }, select: { situacao: true } });
  if (!atual || !novoCodigo || novoCodigo === atual.situacao) { revalidatePath(`/notas-fiscais/${id}`); return; }
  await prisma.notaFiscal.update({ where: { id }, data: { situacao: novoCodigo, descricaoSituacao: nomeNF(novoCodigo) } });
  await registrarSituacao("nota", id, nomeNF(atual.situacao), nomeNF(novoCodigo), obs);
  revalidatePath(`/notas-fiscais/${id}`);
}
