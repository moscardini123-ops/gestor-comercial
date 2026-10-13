// Renderiza texto simples com **negrito** e listas "- ", preservando quebras.
export function TextoFormatado({ texto, className = "" }: { texto: string; className?: string }) {
  const linhas = texto.split("\n");
  function inline(s: string, key: number) {
    const partes = s.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return (
      <span key={key}>
        {partes.map((p, i) =>
          p.startsWith("**") && p.endsWith("**")
            ? <strong key={i}>{p.slice(2, -2)}</strong>
            : <span key={i}>{p}</span>
        )}
      </span>
    );
  }
  return (
    <div className={className} style={{ lineHeight: 1.5 }}>
      {linhas.map((l, i) => {
        const t = l.trim();
        if (t === "") return <div key={i} style={{ height: ".5em" }} />;
        if (t.startsWith("- ")) return <div key={i} style={{ paddingLeft: "1em", textIndent: "-1em" }}>• {inline(t.slice(2), i)}</div>;
        return <div key={i}>{inline(l, i)}</div>;
      })}
    </div>
  );
}
