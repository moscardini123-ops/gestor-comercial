import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Gestor LBS",
  description: "Gerencial estilo Olist com documentos e termo de garantia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="min-w-0 flex-1 px-5 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
