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
      <div className="mx-auto flex max-w-[1180px] flex-col gap-7 px-7 text-[0.88rem] md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-5">
        <Link
          href="/"
          className="font-display text-[1.2rem] font-semibold tracking-tight text-ink"
        >
          Zenaxis<span className="text-accent">.</span>
        </Link>

        <p className="max-w-[40ch]">
          Sites, automação e IA: soluções digitais sob medida
        </p>

        <nav
          aria-label="Contato e redes"
          className="flex flex-col gap-3.5 md:flex-row md:items-center md:gap-6"
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="link-ink self-start font-medium hover:text-ink"
          >
            Instagram {INSTAGRAM_HANDLE}
          </a>
          <a
            href={waLink()}
            className="link-ink self-start font-medium hover:text-ink"
          >
            WhatsApp
          </a>
          <a
            href={EMAIL_URL}
            className="link-ink self-start break-all font-medium hover:text-ink"
          >
            {EMAIL}
          </a>
        </nav>

        <p>© 2026 Zenaxis</p>
      </div>
    </footer>
  );
}
