"use client";

/* ============================================================================
   Contexto de motion. Centraliza a decisão "anima ou pula pro estado final":
   - ?capture=1 (pipeline de reels): estados finais deterministas.
   - prefers-reduced-motion: estados finais (ou fade simples).
   Nenhum componente decide isso sozinho; todos leem daqui.

   O conteúdo SEMPRE renderiza completo no servidor. Animações só escondem
   e revelam por cima depois do mount (progressive enhancement: sem JS a
   página é estática e completa).
============================================================================ */
import { createContext, useContext, useState } from "react";

export type MotionMode = "full" | "static";

interface MotionContextValue {
  /** "static" = pular direto pros estados finais (capture ou reduced). */
  mode: MotionMode;
  /** ?capture=1 também desliga digitação, odômetro e cursor custom. */
  isCapture: boolean;
}

const MotionContext = createContext<MotionContextValue>({
  mode: "full",
  isCapture: false,
});

function compute(): MotionContextValue {
  if (typeof window === "undefined") return { mode: "full", isCapture: false };
  const isCapture =
    new URLSearchParams(window.location.search).get("capture") === "1";
  const isReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  return { mode: isCapture || isReduced ? "static" : "full", isCapture };
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  /* Computado uma vez, de forma síncrona no cliente, antes de qualquer
     efeito de animação rodar. No servidor o valor não importa (efeitos
     não rodam) e o HTML servido é sempre o estado final completo. */
  const [value] = useState(compute);
  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotion(): MotionContextValue {
  return useContext(MotionContext);
}
