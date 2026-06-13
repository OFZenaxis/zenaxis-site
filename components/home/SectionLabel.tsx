"use client";

/* ============================================================================
   Rótulo mono de seção (motion.md, SCROLL). Dois modos:
   - com número: o contador chega rápido (00 até NN) e a régua se traça.
   - só palavra (ex: "O VAZAMENTO"): sem contador, só a régua se traça.
   Roda uma vez, sem replay. HTML servido já é o estado final (número certo
   ou palavra, régua cheia) — sem JS continua legível.
============================================================================ */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, useMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function SectionLabel({
  number,
  title,
}: {
  number?: string;
  title: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const { mode } = useMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || mode === "static") return;

    const ctx = gsap.context(() => {
      const num = el.querySelector<HTMLElement>("[data-count]");
      const rule = el.querySelector<HTMLElement>("[data-rule]");

      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });

      if (num && number) {
        const target = parseInt(number, 10) || 0;
        const counter = { v: 0 };
        num.textContent = "00";
        tl.to(
          counter,
          {
            v: target,
            duration: DUR.fast,
            ease: "none",
            onUpdate() {
              num.textContent = String(Math.round(counter.v)).padStart(2, "0");
            },
          },
          0,
        );
      }
      tl.to(rule, { scaleX: 1, duration: DUR.slow, ease: EASE.draw }, 0.05);
    }, el);

    return () => ctx.revert();
  }, [mode, number]);

  return (
    <div ref={root} className="flex items-baseline gap-4">
      {number ? (
        <>
          <span
            data-count
            className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep"
          >
            {number}
          </span>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft">
            {title}
          </span>
        </>
      ) : (
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep">
          {title}
        </span>
      )}
      <span data-rule aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}
