"use client";

/* ============================================================================
   SEÇÃO 01 SERVIÇOS. Vocabulário (motion.md, SCROLL): a borda de cada card
   se DESENHA (scaleX/scaleY com transform-origin) antes do conteúdo interno
   aparecer. Hover de papel levantado. Uma vez, sem replay.
   As 4 linhas de borda são elementos reais: sem JS ficam no estado final.
============================================================================ */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, SETTLE_Y, STAGGER, useMotion } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: "01",
    title: "Site que vende sozinho",
    body: "Não é cartão de visita parado. É uma estrutura pensada para transformar visitante em conversa de WhatsApp: copy, hierarquia e CTA no lugar certo.",
  },
  {
    num: "02",
    title: "Automação do trabalho chato",
    body: "Atendimento, acompanhamento, cotação e agendamento rodando sem você. O cliente é respondido na hora; você foca no que dá dinheiro.",
  },
  {
    num: "03",
    title: "IA aplicada ao seu negócio",
    body: "Não é IA porque está na moda. Atendimento inteligente, busca, recomendação e CRM com IA integrada, o diferencial que a concorrência genérica não entrega.",
  },
];

/* Moldura desenhável: 4 linhas absolutas que o gsap traça. */
function DrawnBorder() {
  return (
    <span aria-hidden="true">
      <span data-border-x className="absolute inset-x-0 top-0 h-px bg-line" />
      <span data-border-x className="absolute inset-x-0 bottom-0 h-px bg-line" />
      <span data-border-y className="absolute inset-y-0 left-0 w-px bg-line" />
      <span data-border-y className="absolute inset-y-0 right-0 w-px bg-line" />
    </span>
  );
}

export function Services() {
  const root = useRef<HTMLElement>(null);
  const { mode } = useMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || mode === "static") return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);

      gsap.from(el.querySelector("[data-sec-title]"), {
        opacity: 0,
        y: SETTLE_Y,
        duration: DUR.base,
        ease: EASE.settle,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      for (const [i, card] of cards.entries()) {
        const xs = card.querySelectorAll("[data-border-x]");
        const ys = card.querySelectorAll("[data-border-y]");
        const content = card.querySelector("[data-card-content]");

        gsap.set(xs, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(ys, { scaleY: 0, transformOrigin: "center top" });
        gsap.set(content, { opacity: 0, y: SETTLE_Y });

        const tl = gsap.timeline({
          delay: i * STAGGER.loose,
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
        /* Borda primeiro... */
        tl.to(xs, { scaleX: 1, duration: DUR.base, ease: EASE.draw }, 0);
        tl.to(ys, { scaleY: 1, duration: DUR.base, ease: EASE.draw }, 0.08);
        /* ...conteúdo depois. */
        tl.to(
          content,
          { opacity: 1, y: 0, duration: DUR.base, ease: EASE.settle },
          0.3,
        );
      }
    }, el);

    return () => ctx.revert();
     
  }, [mode]);

  return (
    <section ref={root} id="servicos" className="mx-auto max-w-[1180px] px-7 py-16">
      <SectionLabel number="01" title="Serviços" />
      <h2
        data-sec-title
        className="mt-10 max-w-[18ch] font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-[360] leading-[1.06] tracking-tight"
      >
        Você não compra páginas.
        <br />
        <em className="text-accent">Compra o que elas resolvem.</em>
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {SERVICES.map((s) => (
          <article
            key={s.num}
            data-card
            className="paper-lift relative bg-card p-8"
          >
            <DrawnBorder />
            <div data-card-content>
              <span className="font-mono text-[0.78rem] tracking-[0.16em] text-accent">
                {s.num}
              </span>
              <h3 className="mt-4 font-display text-[1.4rem] font-medium tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[0.98rem] text-ink-soft">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
