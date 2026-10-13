"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { acharOuCriarCliente, proximoNumero, parseLinhas } from "@/lib/clientes";
import { registrarSituacao } from "@/lib/historico";

function dadosDoForm(formData: FormData) {
  const linhas = parseLinhas(formData.get("itens"));
  const totalProdutos = linhas.reduce((s, l) => s + (l.quantidade ?? 0) * (l.valorUnitario ?? 0), 0);
  const valorFrete = Number(formData.get("valorFrete") ?? 0) || 0;
  const valorDesconto = Number(formData.get("valorDesconto") ?? 0) || 0;
  const dataPrevista = String(formData.get("dataPrevista") ?? "");
  return {
    linhas, totalProdutos, valorFrete, valorDesconto,
    base: {
      condicaoPagamento: String(formData.get("condicaoPagamento") ?? "") || null,
      fretePorConta: String(formData.get("fretePorConta") ?? "R"),
      formaEnvio: String(formData.get("formaEnvio") ?? "") || null,
      codigoRastreamento: String(formData.get("codigoRastreamento") ?? "") || null,
      vendedor: String(formData.get("vendedor") ?? "") || null,
      obs: String(formData.get("obs") ?? "") || null,
      dataPrevista: dataPrevista ? new Date(dataPrevista) : null,
      valorFrete, valorDesconto, totalProdutos,
      totalPedido: totalProdutos + valorFrete - valorDesconto,
    },
    itensCreate: linhas.map((l) => ({
      descricao: String(l.descricao), unidade: String(l.unidade ?? "UN"),
      quantidade: Number(l.quantidade ?? 1), valorUnitario: Number(l.valorUnitario ?? 0),
    })),
  };
}

export async function criarPedido(formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));
  const d = dadosDoForm(formData);
  const situacao = String(formData.get("situacao") ?? "Em aberto");

  const pedido = await prisma.pedido.create({
    data: {
      numero: await proximoNumero("pedido"), situacao, clienteId, ...d.base,
      itens: { create: d.itensCreate },
    },
  });
  await registrarSituacao("pedido", pedido.id, null, situacao, "Pedido criado");
  redirect(`/pedidos/${pedido.id}`);
}

export async function atualizarPedido(id: number, formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));
  const d = dadosDoForm(formData);

  await prisma.$transaction([
    prisma.pedidoItem.deleteMany({ where: { pedidoId: id } }),
    prisma.pedido.update({
      where: { id },
      data: { clienteId, ...d.base, itens: { create: d.itensCreate } },
    }),
  ]);
  redirect(`/pedidos/${id}`);
}

export async function trocarSituacaoPedido(formData: FormData) {
  const id = Number(formData.get("id"));
  const nova = String(formData.get("situacao") ?? "").trim();
  const obs = String(formData.get("observacao") ?? "").trim() || null;
  const atual = await prisma.pedido.findUnique({ where: { id }, select: { situacao: true } });
  if (!atual || !nova || nova === atual.situacao) {
    revalidatePath(`/pedidos/${id}`);
    return;
  }
  await prisma.pedido.update({ where: { id }, data: { situacao: nova } });
  await registrarSituacao("pedido", id, atual.situacao, nova, obs);
  revalidatePath(`/pedidos/${id}`);
}
