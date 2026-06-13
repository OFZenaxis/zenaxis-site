"use client";

/* ============================================================================
   Rótulo mono de seção (motion.md, SCROLL): o número chega como contador
   rápido (00 até NN) e a régua horizontal se traça na largura. Uma vez,
   sem replay. HTML servido já é o estado final (número certo, régua cheia).
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
  number: string;
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
      const target = parseInt(number, 10) || 0;
      const counter = { v: 0 };

      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      if (num) num.textContent = "00";

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      tl.to(
        counter,
        {
          v: target,
          duration: DUR.fast,
          ease: "none",
          onUpdate() {
            if (num)
              num.textContent = String(Math.round(counter.v)).padStart(2, "0");
          },
        },
        0,
      );
      tl.to(
        rule,
        { scaleX: 1, duration: DUR.slow, ease: EASE.draw },
        0.05,
      );
    }, el);

    return () => ctx.revert();
     
  }, [mode, number]);

  return (
    <div ref={root} className="flex items-baseline gap-4">
      <span
        data-count
        className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent-deep"
      >
        {number}
      </span>
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft">
        {title}
      </span>
      <span data-rule aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}
