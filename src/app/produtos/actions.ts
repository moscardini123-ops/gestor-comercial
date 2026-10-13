"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function dados(formData: FormData) {
  return {
    descricao: String(formData.get("descricao") ?? "").trim(),
    sku: String(formData.get("sku") ?? "") || null,
    gtin: String(formData.get("gtin") ?? "") || null,
    ncm: String(formData.get("ncm") ?? "") || null,
    tipo: String(formData.get("tipo") ?? "simples"),
    categoria: String(formData.get("categoria") ?? "") || null,
    preco: Number(formData.get("preco") ?? 0) || 0,
    custo: Number(formData.get("custo") ?? 0) || 0,
    estoque: Number(formData.get("estoque") ?? 0) || 0,
    situacao: String(formData.get("situacao") ?? "ativo"),
  };
}

export async function criarProduto(formData: FormData) {
  const d = dados(formData);
  if (!d.descricao) throw new Error("Informe a descrição.");
  const p = await prisma.produto.create({ data: d });
  redirect(`/produtos/${p.id}`);
}

export async function atualizarProduto(id: number, formData: FormData) {
  const d = dados(formData);
  if (!d.descricao) throw new Error("Informe a descrição.");
  await prisma.produto.update({ where: { id }, data: d });
  redirect(`/produtos/${id}`);
}
