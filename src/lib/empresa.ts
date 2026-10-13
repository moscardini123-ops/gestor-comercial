import { prisma } from "@/lib/db";

export type DadosEmpresa = {
  nome: string; cnpj: string; ie: string; endereco: string;
  cidade: string; uf: string; cep: string; telefone: string; site: string;
};

const PADRAO: DadosEmpresa = {
  nome: "Minha Empresa", cnpj: "", ie: "", endereco: "", cidade: "", uf: "", cep: "", telefone: "", site: "",
};

export async function getEmpresa(): Promise<DadosEmpresa> {
  const e = await prisma.empresa.findFirst();
  if (!e) return PADRAO;
  return {
    nome: e.nome, cnpj: e.cnpj ?? "", ie: e.ie ?? "", endereco: e.endereco ?? "",
    cidade: e.cidade ?? "", uf: e.uf ?? "", cep: e.cep ?? "", telefone: e.telefone ?? "", site: e.site ?? "",
  };
}
