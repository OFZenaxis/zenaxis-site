"use client";

/* ============================================================================
   CTA FINAL. Reveal padrão + botão de tinta. Depois disso, repouso.
============================================================================ */
import { waLink } from "@/lib/contact";
import { useReveal } from "@/lib/motion";

export function FinalCta() {
  const root = useReveal<HTMLElement>({ selector: "[data-rise]" });

  return (
    <section
      ref={root}
      id="contato"
      className="mx-auto max-w-[1180px] px-7 py-24 text-center"
    >
      <h2
        data-rise
        className="mx-auto max-w-[18ch] text-balance font-display text-[clamp(2rem,5.5vw,3.6rem)] font-[340] leading-[1.05] tracking-tight"
      >
        Seu concorrente já está online.
        <br />
        <em className="text-accent">E você?</em>
      </h2>
      <p data-rise className="mx-auto mt-4 max-w-[44ch] text-ink-soft">
        Me chama no WhatsApp, me conta o que você faz, e eu te digo em minutos
        o que dá pra construir. Sem reunião chata, sem proposta de 12 páginas.
      </p>
      <div data-rise className="mt-8">
        <a href={waLink()} className="btn btn-accent btn-lg">
          <span>Começar agora</span>
        </a>
      </div>
    </section>
  );
}
