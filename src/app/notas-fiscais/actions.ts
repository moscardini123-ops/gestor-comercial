"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { acharOuCriarCliente, proximoNumero, parseLinhas } from "@/lib/clientes";
import { nomeNF } from "@/lib/domain";

export async function criarNota(formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));

  const linhas = parseLinhas(formData.get("itens"));
  const valorProdutos = linhas.reduce((s, l) => s + (l.quantidade ?? 0) * (l.valorUnitario ?? 0), 0);
  const valorFrete = Number(formData.get("valorFrete") ?? 0) || 0;
  const valorDesconto = Number(formData.get("valorDesconto") ?? 0) || 0;
  const situacao = Number(formData.get("situacao") ?? 1) || 1;

  const nota = await prisma.notaFiscal.create({
    data: {
      numero: await proximoNumero("notaFiscal"),
      serie: Number(formData.get("serie") ?? 1) || 1,
      tipoNota: String(formData.get("tipoNota") ?? "S"),
      naturezaOperacao: String(formData.get("naturezaOperacao") ?? "") || null,
      situacao,
      descricaoSituacao: nomeNF(situacao),
      clienteId,
      valorProdutos,
      valorFrete,
      valorDesconto,
      valorNota: valorProdutos + valorFrete - valorDesconto,
      fretePorConta: String(formData.get("fretePorConta") ?? "R"),
      vendedor: String(formData.get("vendedor") ?? "") || null,
      obs: String(formData.get("obs") ?? "") || null,
      itens: {
        create: linhas.map((l) => ({
          descricao: String(l.descricao),
          unidade: String(l.unidade ?? "UN"),
          quantidade: Number(l.quantidade ?? 1),
          valorUnitario: Number(l.valorUnitario ?? 0),
          valorTotal: Number(l.quantidade ?? 1) * Number(l.valorUnitario ?? 0),
        })),
      },
    },
  });
  redirect(`/notas-fiscais/${nota.id}`);
}
