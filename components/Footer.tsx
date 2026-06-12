import Link from "next/link";
import {
  EMAIL,
  EMAIL_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  waLink,
} from "@/lib/contact";

export function Footer() {
  return (
    <footer className="border-t border-line py-10 text-ink-soft">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 px-7 text-[0.88rem]">
        <Link
          href="/"
          className="font-display text-[1.2rem] font-semibold tracking-tight text-ink"
        >
          Zenaxis<span className="text-accent">.</span>
        </Link>

        <p>Sites, automação e IA: soluções digitais sob medida</p>

        <nav aria-label="Contato e redes" className="flex items-center gap-6">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-ink"
          >
            Instagram {INSTAGRAM_HANDLE}
          </a>
          <a href={waLink()} className="font-medium hover:text-ink">
            WhatsApp
          </a>
          <a href={EMAIL_URL} className="font-medium hover:text-ink">
            {EMAIL}
          </a>
        </nav>

        <p>© 2026 Zenaxis</p>
      </div>
    </footer>
  );
}
