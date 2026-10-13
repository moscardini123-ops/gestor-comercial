import { inputClass, inputStyle } from "@/components/Field";

type Opcao = { valor: string; nome: string };

// Formulario de troca de situacao. `action` e uma server action (formData) => void.
export function TrocarSituacao({
  action, id, atual, opcoes,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: number;
  atual: string;
  opcoes: Opcao[];
}) {
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <div>
        <label className="mb-1 block text-sm font-medium">Nova situacao</label>
        <select name="situacao" defaultValue={atual} className={inputClass} style={inputStyle}>
          {opcoes.map((o) => <option key={o.valor} value={o.valor}>{o.nome}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Observacao</label>
        <input name="observacao" className={inputClass} style={inputStyle} placeholder="Exemplo: cliente confirmou o pagamento" />
      </div>
      <button className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--brand)" }}>Registrar situacao</button>
    </form>
  );
}
