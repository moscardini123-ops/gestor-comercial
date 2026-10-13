import Link from "next/link";
import { Brand } from "./Brand";

const links = [
  { href: "/", label: "Painel" },
  { href: "/pedidos", label: "Pedidos de venda" },
  { href: "/ordens-servico", label: "Ordens de servico" },
  { href: "/notas-fiscais", label: "Notas fiscais" },
];

export function Nav() {
  return (
    <header className="border-b" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link href="/" className="shrink-0"><Brand /></Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {links.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
