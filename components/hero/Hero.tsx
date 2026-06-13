"use client";

/* ============================================================================
   HERO — vocabulário "impresso vivo" (motion.md):
   1. Kicker mono digitado com caret que some ao terminar.
   2. Título linha a linha por wipe de clip-path vertical + settle de 8px.
   3. Sublinhado de tinta (stroke SVG, pincelada) traçado após o settle.
   4. Sub, CTAs e stats por fade + settle com stagger. Depois, REPOUSO.

   Progressive enhancement: o HTML servido é o estado final completo.
   Os estados escondidos só são aplicados via gsap DEPOIS do mount; sem JS
   (ou em capture/reduced motion) a página fica estática e completa.
============================================================================ */
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { waLink } from "@/lib/contact";
import { DUR, EASE, HERO_SETTLE_Y, SETTLE_Y, STAGGER, useMotion } from "@/lib/motion";

const KICKER = "Zenaxis · Sites, automação e IA";
const SECONDS_PER_CHAR = 0.018;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { mode } = useMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || mode === "static") return;

    const ctx = gsap.context(() => {
      const kickerText = el.querySelector<HTMLElement>("[data-kicker-text]");
      const caret = el.querySelector<HTMLElement>("[data-caret]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
      const strokes = gsap.utils.toArray<SVGPathElement>(
        "[data-underline] path",
        el,
      );
      const risers = gsap.utils.toArray<HTMLElement>("[data-rise]", el);

      /* Estados iniciais, aplicados só agora (pós mount, pós primeiro paint). */
      gsap.set(lines, { clipPath: "inset(0% 0% 100% 0%)", y: HERO_SETTLE_Y });
      gsap.set(risers, { opacity: 0, y: SETTLE_Y });
      for (const path of strokes) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      }
      if (kickerText) kickerText.textContent = "";

      const tl = gsap.timeline();

      /* 1. Kicker: máquina de escrever rápida. */
      if (kickerText) {
        const typing = { count: 0 };
        gsap.set(caret, { opacity: 1 });
        tl.to(
          typing,
          {
            count: KICKER.length,
            duration: KICKER.length * SECONDS_PER_CHAR,
            ease: "none",
            onUpdate() {
              kickerText.textContent = KICKER.slice(0, Math.round(typing.count));
            },
          },
          0,
        );
        /* O caret some ao terminar (não pisca pra sempre). */
        tl.to(caret, { opacity: 0, duration: 0.2, ease: "none" }, ">+0.15");
      }

      /* 2. Título: tinta aplicada por rolo, linha a linha, settle de 8px. */
      tl.to(
        lines,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: STAGGER.loose,
          onComplete: () => gsap.set(lines, { clearProps: "clipPath" }),
        },
        0.25,
      );

      /* 3. Sublinhado de tinta: se traça da esquerda pra direita após o
         título assentar. */
      tl.to(
        strokes,
        {
          strokeDashoffset: 0,
          duration: DUR.base,
          ease: EASE.draw,
          stagger: STAGGER.tight,
        },
        1.15,
      );

      /* 4. Sub, CTAs e stats: fade + settle com stagger. Fim = repouso. */
      tl.to(
        risers,
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.settle,
          stagger: STAGGER.base,
        },
        0.6,
      );
    }, el);

    return () => ctx.revert();
  }, [mode]);

  return (
    <section ref={root} className="mx-auto max-w-[1180px] px-7 py-20">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft">
        <span data-kicker-text>{KICKER}</span>
        <span data-caret aria-hidden="true" className="type-caret" />
      </p>

      <h1 className="mt-6 max-w-[15ch] font-display text-[clamp(2.15rem,7vw,5.4rem)] font-[340] leading-[1.04] tracking-[-0.025em]">
        <span data-line className="block">
          Eu não entrego site.
        </span>
        <span data-line className="block">
          Entrego o que ele
        </span>
        <span data-line className="relative inline-block">
          <em className="text-accent">faz pelo seu negócio.</em>
          <svg
            data-underline
            aria-hidden="true"
            viewBox="0 0 320 14"
            preserveAspectRatio="none"
            fill="none"
            className="absolute bottom-[-0.08em] left-0 h-[0.14em] w-full"
          >
            {/* Pincelada: traço principal + fiapo fino deslocado. */}
            <path
              d="M4 8 C 64 3.5, 148 11.5, 316 6.5"
              stroke="var(--color-accent)"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              d="M6 11.5 C 90 7.5, 170 12.5, 312 9.5"
              stroke="var(--color-accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </span>
      </h1>

      <p
        data-rise
        className="mt-7 max-w-[52ch] text-[clamp(1.05rem,2.2vw,1.28rem)] leading-normal text-ink-soft"
      >
        Presença digital que parece feita por gente, não por template: design
        distintivo, automação e IA sob medida. Do pequeno comércio à empresa
        que já fatura. A régua é a mesma: resultado.
      </p>

      <div data-rise className="mt-9 flex flex-wrap items-center gap-6">
        <a href={waLink()} className="btn btn-accent btn-lg">
          <span>Quero um orçamento</span>
        </a>
        <Link
          href="/cotacao"
          className="link-ink inline-block text-[1.02rem] font-semibold text-ink"
        >
          Simular investimento
        </Link>
      </div>

      <dl className="mt-12 flex flex-wrap gap-9 border-t border-line pt-7">
        <div data-rise>
          <dt className="font-display text-[2rem] leading-none tracking-tight">
            24h a 7d
          </dt>
          <dd className="mt-1.5 text-[0.88rem] text-ink-soft">
            Da conversa ao site no ar
          </dd>
        </div>
        <div data-rise>
          <dt className="font-display text-[2rem] leading-none tracking-tight">
            95+
          </dt>
          <dd className="mt-1.5 text-[0.88rem] text-ink-soft">
            Lighthouse como padrão de entrega
          </dd>
        </div>
        <div data-rise>
          <dt className="font-display text-[2rem] leading-none tracking-tight">
            Você aprova
          </dt>
          <dd className="mt-1.5 text-[0.88rem] text-ink-soft">
            Antes de publicar
          </dd>
        </div>
      </dl>
    </section>
  );
}
