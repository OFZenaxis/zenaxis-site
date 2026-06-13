"use client";

/* ============================================================================
   SEÇÃO 02 PROJETOS. Vocabulário (motion.md, CASES):
   - Moldura do browser se desenha primeiro, depois a mídia é revelada por
     wipe lateral de clip-path (foto saindo da reveladora), depois o texto.
   - Hover: papel levantado (sombra cresce, sobe 4px). Sem tilt, sem glow.
   - Forja: vídeo mudo dá play no hover (só pointer fine, nunca em capture)
     e volta ao poster no mouseleave. Mobile fica só com o poster.
   Sem JS: molduras, imagens e textos completos (estado final servido).
============================================================================ */
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, SETTLE_Y, useMotion } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const FORJA_URL = "https://treinolandpage.zenaxis.com.br";

function BrowserChrome({ domain }: { domain?: string }) {
  return (
    <div
      data-chrome
      className="flex h-9 items-center gap-3 border-b border-line bg-paper-2 px-3.5"
    >
      <span aria-hidden="true" className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
      </span>
      {domain ? (
        <span className="truncate font-mono text-[0.66rem] tracking-[0.08em] text-ink-soft">
          {domain}
        </span>
      ) : null}
    </div>
  );
}

export function Cases() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mode, isCapture } = useMotion();

  /* Reveals de entrada. */
  useEffect(() => {
    const el = root.current;
    if (!el || mode === "static") return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector("[data-sec-title]"), {
        opacity: 0,
        y: SETTLE_Y,
        duration: DUR.base,
        ease: EASE.settle,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });

      for (const card of gsap.utils.toArray<HTMLElement>("[data-case]", el)) {
        const chrome = card.querySelector("[data-chrome]");
        const media = card.querySelector("[data-media]");
        const body = card.querySelector("[data-case-body]");

        /* Moldura primeiro, mídia por wipe lateral, texto por último. */
        gsap.set(chrome, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(media, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(body, { opacity: 0, y: SETTLE_Y });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
        tl.to(chrome, { scaleX: 1, duration: DUR.fast, ease: EASE.draw }, 0);
        tl.to(
          media,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: DUR.slow,
            ease: EASE.out,
            onComplete: () => gsap.set(media, { clearProps: "clipPath" }),
          },
          0.2,
        );
        tl.to(
          body,
          { opacity: 1, y: 0, duration: DUR.base, ease: EASE.settle },
          0.45,
        );
      }
    }, el);

    return () => ctx.revert();
     
  }, [mode]);

  /* Vídeo do Forja: hover dá play mudo, mouseleave pausa e volta ao poster.
     Só desktop com pointer fine; nunca no modo captura. */
  useEffect(() => {
    const video = videoRef.current;
    const card = video?.closest("[data-case]");
    if (!video || !card || isCapture) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const play = () => {
      video.play().catch(() => {});
    };
    const reset = () => {
      video.pause();
      video.load(); /* volta ao poster sem rebaixar (preload none) */
    };
    card.addEventListener("mouseenter", play);
    card.addEventListener("mouseleave", reset);
    return () => {
      card.removeEventListener("mouseenter", play);
      card.removeEventListener("mouseleave", reset);
    };
  }, [isCapture]);

  return (
    <section ref={root} id="cases" className="mx-auto max-w-[1180px] px-7 py-16">
      <SectionLabel number="02" title="Projetos" />
      <h2
        data-sec-title
        className="mt-10 max-w-[20ch] text-balance font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-[360] leading-[1.06] tracking-tight"
      >
        Trabalho real, <em className="text-accent">não mockup de banco de imagem.</em>
      </h2>

      <div className="mt-10 grid gap-6">
        {/* FORJA flagship: card full width, vídeo grande, a única prova
            navegável com link real. Media à esquerda, conteúdo à direita. */}
        <a
          data-case
          href={FORJA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="paper-lift group grid overflow-hidden rounded-[18px] border border-line bg-card md:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="border-line md:border-r">
            <BrowserChrome domain="treinolandpage.zenaxis.com.br" />
            <div
              data-media
              className="relative aspect-video border-b border-line md:border-b-0"
            >
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                poster="/video/forja-poster.webp"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src="/video/forja-wide.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div
            data-case-body
            className="flex flex-col justify-center p-7 sm:p-9"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep">
                Landing · Demo interativa
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-soft">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                />
                No ar
              </span>
            </div>
            <h3 className="mt-3 font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-medium tracking-tight">
              Forja
            </h3>
            <p className="mt-2.5 max-w-[42ch] text-[1rem] text-ink-soft">
              Landing de demonstração publicada pra você testar agora: animação,
              copy e estrutura de conversão funcionando ao vivo, no ar de
              verdade. Passe o mouse pra ver, clique pra abrir e navegar.
            </p>
            <span className="mt-5 inline-block self-start text-[0.95rem] font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 group-hover:text-accent-deep">
              Abrir o projeto no ar
            </span>
          </div>
        </a>

        {/* SaiuDelivery e PrimeTur lado a lado abaixo do flagship. */}
        <div className="grid gap-6 md:grid-cols-2">
          <article
            data-case
            className="paper-lift overflow-hidden rounded-[18px] border border-line bg-card"
          >
            <BrowserChrome />
            <div data-media className="relative aspect-video border-b border-line">
              <Image
                src="/cases/saiudelivery.webp"
                alt="Telas da plataforma SaiuDelivery"
                width={1280}
                height={720}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div data-case-body className="p-6 pb-7">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep">
                SaaS · Delivery
              </span>
              <h3 className="mt-2 font-display text-[1.5rem] font-medium tracking-tight">
                SaiuDelivery
              </h3>
              <p className="mt-1.5 text-[0.96rem] text-ink-soft">
                Plataforma SaaS para restaurantes terem delivery próprio e fugir
                da comissão dos apps. Cardápio digital, KDS de cozinha e painel
                para várias lojas. Projeto autoral.
              </p>
            </div>
          </article>

          <article
            data-case
            className="paper-lift overflow-hidden rounded-[18px] border border-line bg-card"
          >
            <BrowserChrome />
            <div data-media className="relative aspect-video border-b border-line">
              <Image
                src="/cases/primetur.webp"
                alt="Painel do PrimeTur, CRM de turismo com IA"
                width={1280}
                height={720}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div data-case-body className="p-6 pb-7">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep">
                CRM · Turismo + IA
              </span>
              <h3 className="mt-2 font-display text-[1.5rem] font-medium tracking-tight">
                PrimeTur
              </h3>
              <p className="mt-1.5 text-[0.96rem] text-ink-soft">
                CRM de turismo com IA: dashboard de contratos, cotação por
                linguagem natural, agente de atendimento autônomo e busca
                semântica. Produto autoral em evolução.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
