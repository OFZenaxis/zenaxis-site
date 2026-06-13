"use client";

/* ============================================================================
   HERO — vocabulário "impresso vivo" (motion.md). Copy E1: o argumento abre
   com a tensão entre o valor do trabalho e a fachada digital.
   1. Kicker mono digitado com caret que some ao terminar.
   2. Título linha a linha por wipe de clip-path + settle de 8px.
   3. Sublinhado de tinta (stroke SVG) traçado sob a frase de acento.
   4. Sub, CTAs e stats por fade + settle com stagger. Depois, REPOUSO.

   Progressive enhancement: o HTML servido é o estado final completo. Os
   estados escondidos só são aplicados via gsap DEPOIS do mount; sem JS (ou
   em capture/reduced motion) a página fica estática e completa.
   (E1 não adiciona motion novo: a timeline é a mesma da Fase B1.)
============================================================================ */
import { useEffect, useRef } from "react";
import { waLink } from "@/lib/contact";
import { DUR, EASE, HERO_SETTLE_Y, SETTLE_Y, STAGGER, useMotion } from "@/lib/motion";
import gsap from "gsap";

const KICKER = "Zenaxis · Infraestrutura digital de alta conversão";
const WA_MSG = "Olá! Quero conversar sobre a infraestrutura digital do meu negócio.";
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

      gsap.set(lines, { clipPath: "inset(0% 0% 100% 0%)", y: HERO_SETTLE_Y });
      gsap.set(risers, { opacity: 0, y: SETTLE_Y });
      for (const path of strokes) {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      }
      if (kickerText) kickerText.textContent = "";

      const tl = gsap.timeline();

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
        tl.to(caret, { opacity: 0, duration: 0.2, ease: "none" }, ">+0.15");
      }

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

      <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.15rem,6.4vw,5rem)] font-[340] leading-[1.04] tracking-[-0.025em]">
        <span data-line className="block">
          Seu trabalho vale caro.
        </span>
        <span data-line className="relative block">
          <em className="text-accent">
            Seu site faz o cliente duvidar disso.
          </em>
          <svg
            data-underline
            aria-hidden="true"
            viewBox="0 0 320 14"
            preserveAspectRatio="none"
            fill="none"
            className="absolute bottom-[-0.08em] left-0 h-[0.14em] w-full"
          >
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
        className="mt-7 max-w-[54ch] text-[clamp(1.05rem,2.2vw,1.28rem)] leading-normal text-ink-soft"
      >
        Você é referência no que faz. Mas quando alguém te encontra na
        internet, a primeira impressão não conta a sua história, e é nela que o
        cliente decide quanto você pode cobrar.
      </p>

      <div data-rise className="mt-9 flex flex-wrap items-center gap-6">
        <a href={waLink(WA_MSG)} className="btn btn-accent btn-lg">
          <span>Falar com a Zenaxis</span>
        </a>
        <a
          href="#como-funciona"
          className="link-ink inline-block text-[1.02rem] font-semibold text-ink"
        >
          Ver como funciona
        </a>
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
