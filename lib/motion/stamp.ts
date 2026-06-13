"use client";

/* ============================================================================
   Press de carimbo (motion.md, microinterações): o chip afunda pra scale
   0.96 e volta, em ~90ms. Um único toque (não é loop). Só roda em modo
   "full"; em static (capture/reduced-motion) não faz nada.
============================================================================ */
import gsap from "gsap";
import type { MotionMode } from "./MotionProvider";

export function stampPress(el: Element | null, mode: MotionMode) {
  if (!el || mode === "static") return;
  gsap.fromTo(
    el,
    { scale: 1 },
    {
      scale: 0.96,
      duration: 0.045,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => gsap.set(el, { clearProps: "transform" }),
    },
  );
}
