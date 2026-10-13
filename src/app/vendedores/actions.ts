"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function criarVendedor(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) throw new Error("Informe o nome.");
  await prisma.vendedor.create({
    data: {
      nome,
      email: String(formData.get("email") ?? "") || null,
      comissaoPct: Number(formData.get("comissaoPct") ?? 0) || 0,
    },
  });
  redirect("/vendedores");
}
