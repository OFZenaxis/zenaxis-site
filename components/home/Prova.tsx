"use client";

/* ============================================================================
   SEÇÃO 4 — PROVA ("A PROVA"). Função: dissolver a desconfiança com
   evidência testável. Holofote único no Forja (a única prova navegável):
   card full width, vídeo de dissecação, URL real, badge "no ar", botão que
   abre o projeto pra testar. SaiuDelivery e PrimeTur NÃO aparecem aqui.

   Motion: reaproveita o que a Fase B2 já fez (moldura desenha, mídia por
   wipe lateral, hover dá play mudo no desktop). Sem efeitos novos.
   Texto e card completos no HTML servido (progressive enhancement).
============================================================================ */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, SETTLE_Y, useMotion } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const FORJA_URL = "https://treinolandpage.zenaxis.com.br";

export function Prova() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mode, isCapture } = useMotion();

  /* Reveals de entrada (texto + moldura/mídia/corpo do card). */
  useEffect(() => {
    const el = root.current;
    if (!el || mode === "static") return;

    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray<HTMLElement>("[data-rise]", el), {
        opacity: 0,
        y: SETTLE_Y,
        duration: DUR.base,
        ease: EASE.settle,
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });

      const card = el.querySelector<HTMLElement>("[data-case]");
      if (card) {
        const chrome = card.querySelector("[data-chrome]");
        const media = card.querySelector("[data-media]");
        const body = card.querySelector("[data-case-body]");
        gsap.set(chrome, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(media, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(body, { opacity: 0, y: SETTLE_Y });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 82%", once: true },
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

  /* Vídeo do Forja: hover dá play mudo, mouseleave volta ao poster.
     Só desktop com pointer fine; nunca no modo captura. */
  useEffect(() => {
    const video = videoRef.current;
    const card = video?.closest("[data-case]");
    if (!video || !card || isCapture) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const play = () => {
      video.play().catch(() => {});
    };
    const reset = () => {
      video.pause();
      video.load();
    };
    card.addEventListener("mouseenter", play);
    card.addEventListener("mouseleave", reset);
    return () => {
      card.removeEventListener("mouseenter", play);
      card.removeEventListener("mouseleave", reset);
    };
  }, [isCapture]);

  return (
    <section ref={root} id="prova" className="mx-auto max-w-[1180px] px-7 py-16 sm:py-20">
      <SectionLabel title="A prova" />

      <h2
        data-rise
        className="mt-10 max-w-[22ch] text-balance font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-[360] leading-[1.08] tracking-tight"
      >
        Não vou te pedir pra acreditar.{" "}
        <em className="text-accent">Vou te pedir pra testar.</em>
      </h2>
      <p
        data-rise
        className="mt-6 max-w-[64ch] text-[1.05rem] leading-relaxed text-ink-soft sm:text-[1.12rem]"
      >
        Tudo que eu disse até aqui, carregamento instantâneo, estética com
        peso, estrutura que conduz, você não precisa levar na minha palavra. Eu
        construí uma demonstração e deixei no ar pra você abrir agora, do seu
        celular, e sentir na pele o nível da infraestrutura que entra no seu
        negócio.
      </p>

      {/* FORJA: protagonista absoluto, full width. */}
      <a
        data-case
        href={FORJA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="paper-lift group mt-10 grid overflow-hidden rounded-[18px] border border-line bg-card md:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="border-line md:border-r">
          <div
            data-chrome
            className="flex h-9 items-center gap-3 border-b border-line bg-paper-2 px-3.5"
          >
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
            </span>
            <span className="truncate font-mono text-[0.66rem] tracking-[0.08em] text-ink-soft">
              treinolandpage.zenaxis.com.br
            </span>
          </div>
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
        <div data-case-body className="flex flex-col justify-center p-7 sm:p-9">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep">
              Demonstração ao vivo
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-soft">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              No ar
            </span>
          </div>
          <h3 className="mt-3 font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-medium tracking-tight">
            Forja
          </h3>
          <p className="mt-2.5 max-w-[42ch] text-[1rem] text-ink-soft">
            Uma landing de demonstração publicada de verdade. Abra do celular,
            role, repare no tempo de carga e na fluidez. É o nível de
            infraestrutura que entra no seu projeto.
          </p>
          <span className="mt-5 inline-block self-start text-[0.95rem] font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 group-hover:text-accent-deep">
            Abrir e testar agora
          </span>
        </div>
      </a>

      {/* Direção do olhar. */}
      <p
        data-rise
        className="mt-7 max-w-[64ch] text-[1.02rem] leading-relaxed text-ink-soft"
      >
        Repara no tempo que levou pra abrir. Na fluidez quando você rola. Em
        como cada detalhe parece pensado, porque foi. Isso é um projeto de
        demonstração. Imagina no seu.
      </p>

      {/* Frase de fecho (golpe no trauma). */}
      <p
        data-rise
        className="mt-10 max-w-[28ch] border-l-2 border-accent pl-6 font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-[340] leading-[1.14] tracking-tight"
      >
        A última agência te mostrou uma imagem e pediu confiança.{" "}
        <span className="text-accent">Eu te entrego a chave e peço dois minutos.</span>
      </p>
    </section>
  );
}
