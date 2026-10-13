type P = { size?: number; className?: string };
const base = (size = 20, className = "") => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className });

export const IcInicio = ({ size, className }: P) => (<svg {...base(size, className)}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>);
export const IcCadastros = ({ size, className }: P) => (<svg {...base(size, className)}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 13h5" /></svg>);
export const IcVendas = ({ size, className }: P) => (<svg {...base(size, className)}><path d="M3 4h2l2 12h11l2-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>);
export const IcServicos = ({ size, className }: P) => (<svg {...base(size, className)}><path d="M14 7l3 3M3 21l3-1 10-10a2 2 0 0 0-3-3L3 18z" /></svg>);
export const IcFinancas = ({ size, className }: P) => (<svg {...base(size, className)}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5a2.5 2 0 0 1 2.5-1.5c1.5 0 2.5.8 2.5 2M14.5 14.5a2.5 2 0 0 1-2.5 1.5c-1.5 0-2.5-.8-2.5-2" /></svg>);
export const IcTermo = ({ size, className }: P) => (<svg {...base(size, className)}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9 13h6M9 17h6" /></svg>);
export const IcGarantia = ({ size, className }: P) => (<svg {...base(size, className)}><path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" /></svg>);
export const IcImprimir = ({ size, className }: P) => (<svg {...base(size, className)}><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z" /></svg>);
export const IcEstoque = ({ size, className }: P) => (<svg {...base(size, className)}><path d="M3 7l9-4 9 4-9 4z" /><path d="M3 7v10l9 4 9-4V7M12 11v10" /></svg>);
