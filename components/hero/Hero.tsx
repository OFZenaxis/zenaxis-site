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
      const underline = el.querySelector<HTMLElement>("[data-underline]");
      const risers = gsap.utils.toArray<HTMLElement>("[data-rise]", el);

      gsap.set(lines, { clipPath: "inset(0% 0% 100% 0%)", y: HERO_SETTLE_Y });
      gsap.set(risers, { opacity: 0, y: SETTLE_Y });
      /* Sublinhado começa invisível (camada de cima recortada à direita) e
         só se traça DEPOIS do título assentar. */
      gsap.set(underline, { clipPath: "inset(0 100% 0 0)" });
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

      /* A assinatura: o sublinhado se traça da esquerda pra direita, em
         power3.out, DEPOIS do título assentar (não junto). Como a camada de
         baixo é o brush por linha (box-decoration-break), revelar por
         clip-path nunca estoura — em 2+ linhas a tinta espalha da esquerda. */
      tl.to(
        underline,
        { clipPath: "inset(0 0% 0 0)", duration: DUR.slow, ease: EASE.draw },
        1.05,
      );
    }, el);

    return () => ctx.revert();
  }, [mode]);

  return (
    <section
      ref={root}
      className="mx-auto max-w-[1180px] px-7 pt-16 pb-24 sm:pt-24 sm:pb-32"
    >
      <p className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-ink-soft">
        <span aria-hidden="true" className="h-px w-7 bg-accent" />
        <span>
          <span data-kicker-text>{KICKER}</span>
          <span data-caret aria-hidden="true" className="type-caret" />
        </span>
      </p>

      <h1 className="t-hero mt-8 max-w-[24ch] text-balance">
        <span data-line className="block">
          Seu trabalho vale caro.
        </span>
        <span data-line className="relative block">
          {/* Camada 1: o texto (sempre visível, PE). */}
          <em className="text-accent">Seu site faz o cliente duvidar disso.</em>
          {/* Camada 2: overlay com o MESMO texto (transparente) só pra
              carregar o sublinhado por linha (box-decoration-break, nunca
              estoura). Sem JS fica 100% revelado; o gsap recorta e traça. */}
          <span
            data-underline
            aria-hidden="true"
            className="hero-ink-underline pointer-events-none absolute inset-0 text-transparent"
          >
            Seu site faz o cliente duvidar disso.
          </span>
        </span>
      </h1>

      <p data-rise className="t-lead mt-8 max-w-[46ch] text-ink-soft">
        Você é referência no que faz. Mas quando alguém te encontra na
        internet, a primeira impressão não conta a sua história, e é nela que o
        cliente decide quanto você pode cobrar.
      </p>

      <div data-rise className="mt-10 flex flex-wrap items-center gap-6">
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

      {/* Stats como spec bar ancorada: 3 colunas com divisórias, não solta. */}
      <dl className="mt-16 grid grid-cols-1 border-t border-line sm:grid-cols-3">
        {[
          ["24h a 7d", "Da conversa ao site no ar"],
          ["95+", "Lighthouse como padrão de entrega"],
          ["Você aprova", "Antes de publicar"],
        ].map(([n, l], i) => (
          <div
            key={l}
            data-rise
            className={`py-6 sm:pl-7 ${
              i > 0
                ? "border-t border-line sm:border-l sm:border-t-0"
                : ""
            } ${i === 0 ? "sm:pl-0" : ""}`}
          >
            <dt className="t-h3 leading-none">{n}</dt>
            <dd className="mt-2.5 text-[0.9rem] text-ink-soft">{l}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
