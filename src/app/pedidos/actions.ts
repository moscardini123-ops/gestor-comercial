"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { acharOuCriarCliente, proximoNumero, parseLinhas } from "@/lib/clientes";

export async function criarPedido(formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));

  const linhas = parseLinhas(formData.get("itens"));
  const totalProdutos = linhas.reduce((s, l) => s + (l.quantidade ?? 0) * (l.valorUnitario ?? 0), 0);
  const valorFrete = Number(formData.get("valorFrete") ?? 0) || 0;
  const valorDesconto = Number(formData.get("valorDesconto") ?? 0) || 0;
  const dataPrevista = String(formData.get("dataPrevista") ?? "");

  const pedido = await prisma.pedido.create({
    data: {
      numero: await proximoNumero("pedido"),
      situacao: String(formData.get("situacao") ?? "Em aberto"),
      clienteId,
      dataPrevista: dataPrevista ? new Date(dataPrevista) : null,
      condicaoPagamento: String(formData.get("condicaoPagamento") ?? "") || null,
      fretePorConta: String(formData.get("fretePorConta") ?? "R"),
      formaEnvio: String(formData.get("formaEnvio") ?? "") || null,
      codigoRastreamento: String(formData.get("codigoRastreamento") ?? "") || null,
      vendedor: String(formData.get("vendedor") ?? "") || null,
      obs: String(formData.get("obs") ?? "") || null,
      valorFrete,
      valorDesconto,
      totalProdutos,
      totalPedido: totalProdutos + valorFrete - valorDesconto,
      itens: {
        create: linhas.map((l) => ({
          descricao: String(l.descricao),
          unidade: String(l.unidade ?? "UN"),
          quantidade: Number(l.quantidade ?? 1),
          valorUnitario: Number(l.valorUnitario ?? 0),
        })),
      },
    },
  });
  redirect(`/pedidos/${pedido.id}`);
}
