import Link from "next/link";
import { waLink } from "@/lib/contact";

type HeaderVariant = "full" | "back";

/* Header com duas variantes (auditoria, seção 8):
   full = nav completa do home; back = "voltar" minimalista da cotação.
   O CTA de WhatsApp é link real renderizado no servidor. */
export function Header({ variant = "full" }: { variant?: HeaderVariant }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex h-[66px] max-w-[1180px] items-center justify-between px-7">
        <Link
          href="/"
          className="font-display text-[1.4rem] font-semibold tracking-tight"
        >
          Zenaxis<span className="text-accent">.</span>
        </Link>

        {variant === "full" ? (
          <nav aria-label="Principal" className="flex items-center gap-7">
            <Link
              href="/#servicos"
              className="hidden text-[0.92rem] font-medium text-ink-soft hover:text-ink sm:block"
            >
              Serviços
            </Link>
            <Link
              href="/#cases"
              className="hidden text-[0.92rem] font-medium text-ink-soft hover:text-ink sm:block"
            >
              Projetos
            </Link>
            <Link
              href="/cotacao"
              className="hidden text-[0.92rem] font-medium text-ink-soft hover:text-ink sm:block"
            >
              Cotação
            </Link>
            <a href={waLink()} className="btn btn-dark">
              Falar no WhatsApp
            </a>
          </nav>
        ) : (
          <nav aria-label="Principal">
            <Link href="/" className="btn btn-ghost">
              Voltar ao início
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
