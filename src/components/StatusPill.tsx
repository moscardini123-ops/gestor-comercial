import { toneClass, type Tone } from "@/lib/domain";

export function StatusPill({ label, tone }: { label: string; tone: Tone }) {
  return <span className={`pill ${toneClass[tone]}`}>{label}</span>;
}
