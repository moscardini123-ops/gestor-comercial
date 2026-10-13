"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { acharOuCriarCliente, proximoNumero, parseLinhas } from "@/lib/clientes";
import { registrarSituacao } from "@/lib/historico";

function dadosDoForm(formData: FormData) {
  const linhas = parseLinhas(formData.get("itens"));
  const valorServicos = linhas.filter((l) => l.tipo !== "peca").reduce((s, l) => s + (l.quantidade ?? 0) * (l.valorUnitario ?? 0), 0);
  const valorPecas = linhas.filter((l) => l.tipo === "peca").reduce((s, l) => s + (l.quantidade ?? 0) * (l.valorUnitario ?? 0), 0);
  const dataPrevista = String(formData.get("dataPrevista") ?? "");
  return {
    base: {
      equipamento: String(formData.get("equipamento") ?? "") || null,
      numeroSerie: String(formData.get("numeroSerie") ?? "") || null,
      defeitoRelatado: String(formData.get("defeitoRelatado") ?? "") || null,
      diagnostico: String(formData.get("diagnostico") ?? "") || null,
      solucao: String(formData.get("solucao") ?? "") || null,
      tecnico: String(formData.get("tecnico") ?? "") || null,
      obs: String(formData.get("obs") ?? "") || null,
      dataPrevista: dataPrevista ? new Date(dataPrevista) : null,
      valorServicos, valorPecas, valorTotal: valorServicos + valorPecas,
    },
    itensCreate: linhas.map((l) => ({
      tipo: l.tipo === "peca" ? "peca" : "servico", descricao: String(l.descricao),
      quantidade: Number(l.quantidade ?? 1), valorUnitario: Number(l.valorUnitario ?? 0),
    })),
  };
}

export async function criarOrdem(formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));
  const d = dadosDoForm(formData);
  const situacao = String(formData.get("situacao") ?? "Aberta");
  const os = await prisma.ordemServico.create({ data: { numero: await proximoNumero("ordemServico"), situacao, clienteId, ...d.base, itens: { create: d.itensCreate } } });
  await registrarSituacao("ordem", os.id, null, situacao, "Ordem criada");
  redirect(`/ordens-servico/${os.id}`);
}

export async function atualizarOrdem(id: number, formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));
  const d = dadosDoForm(formData);
  await prisma.$transaction([
    prisma.ordemServicoItem.deleteMany({ where: { ordemId: id } }),
    prisma.ordemServico.update({ where: { id }, data: { clienteId, ...d.base, itens: { create: d.itensCreate } } }),
  ]);
  redirect(`/ordens-servico/${id}`);
}

export async function trocarSituacaoOrdem(formData: FormData) {
  const id = Number(formData.get("id"));
  const nova = String(formData.get("situacao") ?? "").trim();
  const obs = String(formData.get("observacao") ?? "").trim() || null;
  const atual = await prisma.ordemServico.findUnique({ where: { id }, select: { situacao: true } });
  if (!atual || !nova || nova === atual.situacao) { revalidatePath(`/ordens-servico/${id}`); return; }
  await prisma.ordemServico.update({ where: { id }, data: { situacao: nova } });
  await registrarSituacao("ordem", id, atual.situacao, nova, obs);
  revalidatePath(`/ordens-servico/${id}`);
}
