"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function criarTermo(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const conteudo = String(formData.get("conteudo") ?? "").trim();
  if (!nome || !conteudo) throw new Error("Informe nome e conteúdo.");
  const t = await prisma.termoGarantia.create({ data: { nome, conteudo } });
  redirect(`/termos/${t.id}`);
}

export async function atualizarTermo(id: number, formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const conteudo = String(formData.get("conteudo") ?? "").trim();
  if (!nome || !conteudo) throw new Error("Informe nome e conteúdo.");
  await prisma.termoGarantia.update({ where: { id }, data: { nome, conteudo } });
  redirect(`/termos/${id}`);
}
