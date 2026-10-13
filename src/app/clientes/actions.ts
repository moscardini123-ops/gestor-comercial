"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function dados(formData: FormData) {
  return {
    nome: String(formData.get("nome") ?? "").trim(),
    nomeFantasia: String(formData.get("nomeFantasia") ?? "") || null,
    tipoPessoa: String(formData.get("tipoPessoa") ?? "F"),
    papel: String(formData.get("papel") ?? "cliente"),
    cpfCnpj: String(formData.get("cpfCnpj") ?? "") || null,
    ie: String(formData.get("ie") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    fone: String(formData.get("fone") ?? "") || null,
    endereco: String(formData.get("endereco") ?? "") || null,
    numero: String(formData.get("numero") ?? "") || null,
    bairro: String(formData.get("bairro") ?? "") || null,
    cep: String(formData.get("cep") ?? "") || null,
    cidade: String(formData.get("cidade") ?? "") || null,
    uf: String(formData.get("uf") ?? "") || null,
  };
}

export async function criarCliente(formData: FormData) {
  const d = dados(formData);
  if (!d.nome) throw new Error("Informe o nome.");
  const c = await prisma.cliente.create({ data: d });
  redirect(`/clientes/${c.id}`);
}

export async function atualizarCliente(id: number, formData: FormData) {
  const d = dados(formData);
  if (!d.nome) throw new Error("Informe o nome.");
  await prisma.cliente.update({ where: { id }, data: d });
  redirect(`/clientes/${id}`);
}
