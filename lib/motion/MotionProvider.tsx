"use client";

/* ============================================================================
   Contexto de motion. Centraliza a decisão "anima ou pula pro estado final":
   - ?capture=1 (pipeline de reels): estados finais deterministas.
   - prefers-reduced-motion: estados finais (ou fade simples).
   Nenhum componente decide isso sozinho; todos leem daqui.

   IMPORTANTE (hidratação): um useState(compute) NÃO recomputa no cliente
   durante a hidratação — React reaproveita o valor do servidor (onde window
   não existe), então o modo ficaria preso em "full". Por isso lemos o
   ambiente com useSyncExternalStore: o servidor entrega "full" (o HTML
   servido anima por padrão, progressive enhancement) e o cliente corrige
   pro valor real no hydrate, sem hydration mismatch.
============================================================================ */
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type MotionMode = "full" | "static";
type Snapshot = "full" | "reduced" | "capture";

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

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/* Valores estáveis por snapshot (identidade constante = sem re-render à toa). */
const VALUE_BY_SNAPSHOT: Record<Snapshot, MotionContextValue> = {
  full: { mode: "full", isCapture: false },
  reduced: { mode: "static", isCapture: false },
  capture: { mode: "static", isCapture: true },
};

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): Snapshot {
  if (new URLSearchParams(window.location.search).get("capture") === "1") {
    return "capture";
  }
  return window.matchMedia(REDUCED_QUERY).matches ? "reduced" : "full";
}

/* No servidor o HTML anima por padrão; o cliente ajusta no hydrate. */
function getServerSnapshot(): Snapshot {
  return "full";
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const value = VALUE_BY_SNAPSHOT[snapshot];

  /* Espelha o modo "static" numa classe no <html> pra desligar também as
     microinterações de CSS puro (chip ink wipe, régua, botão, sublinhado)
     em capture/reduced-motion — não só as animações dirigidas por JS. */
  useEffect(() => {
    document.documentElement.classList.toggle(
      "motion-static",
      value.mode === "static",
    );
  }, [value.mode]);

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotion(): MotionContextValue {
  return useContext(MotionContext);
}
