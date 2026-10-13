"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

async function proximoProtocolo(): Promise<string> {
  const n = await prisma.garantia.count();
  const ano = new Date().getFullYear();
  return `G${ano}-${String(n + 1).padStart(4, "0")}`;
}

export async function criarGarantia(formData: FormData) {
  const clienteNome = String(formData.get("clienteNome") ?? "").trim();
  if (!clienteNome) throw new Error("Informe o cliente.");
  const g = await prisma.garantia.create({
    data: {
      protocolo: await proximoProtocolo(),
      clienteNome,
      cpf: String(formData.get("cpf") ?? "") || null,
      serial: String(formData.get("serial") ?? "") || null,
      modelo: String(formData.get("modelo") ?? "") || null,
      problema: String(formData.get("problema") ?? "") || null,
      obs: String(formData.get("obs") ?? "") || null,
    },
  });
  redirect(`/garantias/${g.id}`);
}

export async function trocarStatusGarantia(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "").trim();
  if (id && status) await prisma.garantia.update({ where: { id }, data: { status } });
  revalidatePath(`/garantias/${id}`);
}
