// Situacoes e metadados dos tres modulos.
// Pedido e Nota Fiscal: nomenclatura da API publica do Tiny/Olist.
// Confirmados na doc: Pedido "Em aberto"/"Aprovado"/"Atendido"; NF situacao 1 = "Pendente".
// Os demais valores seguem o conjunto padrao do produto e sao marcados como referencia.

export type Tone = "slate" | "indigo" | "amber" | "sky" | "emerald" | "red" | "violet";

export const toneClass: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
  red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200",
};

export const SITUACOES_PEDIDO: { nome: string; tone: Tone }[] = [
  { nome: "Em aberto", tone: "slate" },
  { nome: "Aprovado", tone: "indigo" },
  { nome: "Preparando envio", tone: "amber" },
  { nome: "Faturado", tone: "violet" },
  { nome: "Pronto para envio", tone: "sky" },
  { nome: "Enviado", tone: "sky" },
  { nome: "Entregue", tone: "emerald" },
  { nome: "Atendido", tone: "emerald" },
  { nome: "Cancelado", tone: "red" },
];

export const SITUACOES_OS: { nome: string; tone: Tone }[] = [
  { nome: "Aberta", tone: "slate" },
  { nome: "Em andamento", tone: "indigo" },
  { nome: "Aguardando peca", tone: "amber" },
  { nome: "Aguardando aprovacao", tone: "amber" },
  { nome: "Concluida", tone: "emerald" },
  { nome: "Faturada", tone: "violet" },
  { nome: "Cancelada", tone: "red" },
];

export const SITUACOES_NF: { codigo: number; nome: string; tone: Tone }[] = [
  { codigo: 1, nome: "Pendente", tone: "slate" },
  { codigo: 2, nome: "Emitida", tone: "indigo" },
  { codigo: 3, nome: "Autorizada", tone: "emerald" },
  { codigo: 4, nome: "Cancelada", tone: "red" },
  { codigo: 5, nome: "Denegada", tone: "red" },
  { codigo: 6, nome: "Rejeitada", tone: "amber" },
];

export const FRETE_POR_CONTA: Record<string, string> = {
  R: "Remetente (CIF)",
  D: "Destinatario (FOB)",
  T: "Terceiros",
  "3": "Transporte proprio (remetente)",
  "4": "Transporte proprio (destinatario)",
  S: "Sem transporte",
};

export function tonePedido(nome: string): Tone {
  return SITUACOES_PEDIDO.find((s) => s.nome === nome)?.tone ?? "slate";
}
export function toneOS(nome: string): Tone {
  return SITUACOES_OS.find((s) => s.nome === nome)?.tone ?? "slate";
}
export function toneNF(codigo: number): Tone {
  return SITUACOES_NF.find((s) => s.codigo === codigo)?.tone ?? "slate";
}
export function nomeNF(codigo: number): string {
  return SITUACOES_NF.find((s) => s.codigo === codigo)?.nome ?? "Pendente";
}
