"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { acharOuCriarCliente, proximoNumero, parseLinhas } from "@/lib/clientes";

export async function criarOrdem(formData: FormData) {
  const clienteNome = String(formData.get("cliente") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const clienteId = await acharOuCriarCliente(clienteNome, String(formData.get("cpfCnpj") ?? ""));

  const linhas = parseLinhas(formData.get("itens"));
  const valorServicos = linhas.filter((l) => l.tipo !== "peca").reduce((s, l) => s + (l.quantidade ?? 0) * (l.valorUnitario ?? 0), 0);
  const valorPecas = linhas.filter((l) => l.tipo === "peca").reduce((s, l) => s + (l.quantidade ?? 0) * (l.valorUnitario ?? 0), 0);
  const dataPrevista = String(formData.get("dataPrevista") ?? "");

  const os = await prisma.ordemServico.create({
    data: {
      numero: await proximoNumero("ordemServico"),
      situacao: String(formData.get("situacao") ?? "Aberta"),
      clienteId,
      dataPrevista: dataPrevista ? new Date(dataPrevista) : null,
      equipamento: String(formData.get("equipamento") ?? "") || null,
      numeroSerie: String(formData.get("numeroSerie") ?? "") || null,
      defeitoRelatado: String(formData.get("defeitoRelatado") ?? "") || null,
      diagnostico: String(formData.get("diagnostico") ?? "") || null,
      solucao: String(formData.get("solucao") ?? "") || null,
      tecnico: String(formData.get("tecnico") ?? "") || null,
      obs: String(formData.get("obs") ?? "") || null,
      valorServicos,
      valorPecas,
      valorTotal: valorServicos + valorPecas,
      itens: {
        create: linhas.map((l) => ({
          tipo: l.tipo === "peca" ? "peca" : "servico",
          descricao: String(l.descricao),
          quantidade: Number(l.quantidade ?? 1),
          valorUnitario: Number(l.valorUnitario ?? 0),
        })),
      },
    },
  });
  redirect(`/ordens-servico/${os.id}`);
}
