/* ============================================================================
   Constantes da linguagem de movimento (motion.md, "Regra mãe").
   Easings decisivos, durações curtas, staggers apertados.
   Proibido: elastic, bounce, spring exagerado, loop infinito.
============================================================================ */

/** Easings permitidos. Nada de elastic/bounce. */
export const EASE = {
  /** Wipes e entradas principais: decisivo, assenta rápido. */
  out: "expo.out",
  /** Settles de texto e fades: um pouco mais macio, ainda curto. */
  settle: "quart.out",
  /** Traços (sublinhado, réguas). */
  draw: "power3.out",
} as const;

/** Durações em segundos. Janela permitida: 300 a 700ms. */
export const DUR = {
  fast: 0.3,
  base: 0.5,
  slow: 0.7,
} as const;

/** Staggers em segundos. Janela permitida: 40 a 80ms. */
export const STAGGER = {
  tight: 0.04,
  base: 0.06,
  loose: 0.08,
} as const;

/** Settle vertical padrão dos reveals de scroll (px). */
export const SETTLE_Y = 12;

/** Settle vertical das linhas do hero (px). */
export const HERO_SETTLE_Y = 8;

/** Equivalentes CSS dos easings (para microinterações em CSS puro). */
export const CSS_EASE = {
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  settle: "cubic-bezier(0.25, 1, 0.5, 1)",
} as const;
