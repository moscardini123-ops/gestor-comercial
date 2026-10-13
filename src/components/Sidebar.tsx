"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";
import { IcInicio, IcCadastros, IcVendas, IcServicos, IcFinancas, IcTermo, IcGarantia } from "./icons";

type Item = { href: string; label: string };
type Secao = { titulo: string; Icone: (p: { size?: number; className?: string }) => React.ReactNode; itens: Item[] };

const secoes: Secao[] = [
  { titulo: "Início", Icone: IcInicio, itens: [{ href: "/", label: "Painel" }] },
  { titulo: "Cadastros", Icone: IcCadastros, itens: [
    { href: "/clientes", label: "Clientes e Fornecedores" },
    { href: "/produtos", label: "Produtos" },
    { href: "/vendedores", label: "Vendedores" },
  ] },
  { titulo: "Vendas", Icone: IcVendas, itens: [
    { href: "/pedidos", label: "Pedidos de Venda" },
    { href: "/notas-fiscais", label: "Notas Fiscais" },
    { href: "/termos", label: "Termos de Garantia" },
  ] },
  { titulo: "Serviços", Icone: IcServicos, itens: [
    { href: "/ordens-servico", label: "Ordens de serviço" },
    { href: "/garantias", label: "Garantias (SAC)" },
  ] },
  { titulo: "Finanças", Icone: IcFinancas, itens: [
    { href: "/financas", label: "Fechamento" },
  ] },
];

function ativo(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname() || "/";
  return (
    <aside className="no-print flex w-60 shrink-0 flex-col border-r" style={{ background: "var(--panel)", borderColor: "var(--border)" }}>
      <div className="flex h-14 items-center px-4"><Link href="/"><Brand /></Link></div>
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {secoes.map((s) => (
          <div key={s.titulo} className="mb-3">
            <div className="flex items-center gap-2 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              <s.Icone size={15} /> {s.titulo}
            </div>
            <div className="mt-0.5">
              {s.itens.map((it) => {
                const on = ativo(pathname, it.href);
                return (
                  <Link key={it.href} href={it.href}
                    className="block rounded-md px-3 py-1.5 text-sm"
                    style={on ? { background: "var(--brand)", color: "#fff", fontWeight: 600 } : { color: "var(--ink)" }}>
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 text-[11px]" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        Gerencial + documentos
      </div>
    </aside>
  );
}
