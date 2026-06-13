"use client";

/* ============================================================================
   useReveal: reveal de scroll padrão da casa (motion.md, "SCROLL").
   Fade + settle vertical, stagger por elemento, roda UMA vez (sem replay
   ao rolar de volta). O conteúdo é visível no HTML servido; o gsap.from
   só esconde depois do mount, então sem JS nada fica invisível.
============================================================================ */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, SETTLE_Y, STAGGER } from "./constants";
import { useMotion } from "./MotionProvider";

gsap.registerPlugin(ScrollTrigger);

export interface RevealOptions {
  /** Seletor dos filhos a escalonar; sem ele, anima o próprio container. */
  selector?: string;
  /** Settle vertical em px (padrão 12, motion.md). */
  y?: number;
  /** Stagger em segundos (padrão 60ms; janela 40 a 80ms). */
  stagger?: number;
  /** Ponto de disparo do ScrollTrigger (padrão "top 85%"). */
  start?: string;
}

export function useReveal<T extends HTMLElement = HTMLElement>(
  options: RevealOptions = {},
) {
  const ref = useRef<T>(null);
  const { mode } = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || mode === "static") return;

    const targets = options.selector
      ? Array.from(el.querySelectorAll(options.selector))
      : [el];
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: options.y ?? SETTLE_Y,
        duration: DUR.base,
        ease: EASE.settle,
        stagger: options.stagger ?? STAGGER.base,
        scrollTrigger: {
          trigger: el,
          start: options.start ?? "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return ref;
}
