/* ============================================================================
   MOTOR DE COTAÇÃO — porte tipado do window.COTACAO (cotacao.js v1).
   Valores e lógica EXATOS do original. Fonte única de preços/prazos.
   buildMessage delega a montagem do link para lib/contact (waUrl).
============================================================================ */
import { waUrl } from "./contact";

export type TipoKey = "landing" | "institucional" | "sistema";
export type PorteKey = "enxuto" | "medio" | "robusto";
export type ExtraKey = "whatsapp" | "ia" | "crm" | "seo" | "identidade";
export type PrazoKey = "normal" | "expresso";

export interface QuoteContext {
  identidade?: string | null;
  conteudo?: string | null;
}

export interface QuoteState {
  tipo?: TipoKey | null;
  porte?: PorteKey | null;
  extras?: ExtraKey[];
  prazo?: PrazoKey | null;
  contexto?: QuoteContext;
  nome?: string;
}

export interface QuoteItem {
  label: string;
  price: number;
  express?: boolean;
}

export interface QuoteResult {
  total: number;
  days: number;
  items: QuoteItem[];
}

/* Tabela de preços/prazos. porte = MULTIPLICADOR (médio = 1.0). expresso = +30%. */
export const DATA = {
  tipo: {
    landing: { label: "Landing page", price: 1500, days: 2 },
    institucional: { label: "Site institucional", price: 2800, days: 5 },
    sistema: { label: "Sistema / Web app", price: 6500, days: 14 },
  },
  porte: {
    enxuto: { label: "Enxuto", mult: 0.75, daymult: 0.7 },
    medio: { label: "Médio", mult: 1.0, daymult: 1.0 },
    robusto: { label: "Robusto", mult: 1.6, daymult: 1.7 },
  },
  extras: {
    whatsapp: { label: "WhatsApp integrado", price: 500, days: 1 },
    ia: { label: "Automação + IA", price: 1800, days: 4 },
    crm: { label: "CRM", price: 2200, days: 5 },
    seo: { label: "SEO técnico", price: 700, days: 2 },
    identidade: { label: "Identidade visual", price: 900, days: 3 },
  },
  prazo: {
    normal: { label: "Normal", pace: 1.0, daymult: 1.0 },
    expresso: { label: "Expresso", pace: 1.3, daymult: 0.6 },
  },
} as const;

/** Formatação de moeda BRL — idêntica ao original. */
export function fmt(n: number): string {
  return "R$ " + Math.round(n).toLocaleString("pt-BR");
}

/**
 * calc(state) -> { total, days, items }
 * Defaults: porte ausente -> médio (1.0); prazo ausente -> normal.
 */
export function calc(state: QuoteState = {}): QuoteResult {
  const d = DATA;
  const items: QuoteItem[] = [];

  const tipo = (state.tipo && d.tipo[state.tipo]) || d.tipo.landing;
  const porte = (state.porte && d.porte[state.porte]) || d.porte.medio;
  const prazo = (state.prazo && d.prazo[state.prazo]) || d.prazo.normal;

  // Base = tipo × porte
  let base = tipo.price * porte.mult;
  let days = tipo.days * porte.daymult;

  // Só rotula "· porte X" quando o porte foi escolhido de fato.
  let baseLabel: string = tipo.label;
  if (state.porte && d.porte[state.porte]) {
    baseLabel += " · porte " + porte.label.toLowerCase();
  }
  items.push({ label: baseLabel, price: base });

  // Extras (valor fixo + prazo somado)
  const extras = state.extras ?? [];
  for (const key of extras) {
    const e = d.extras[key];
    if (!e) continue;
    base += e.price;
    days += e.days;
    items.push({ label: e.label, price: e.price });
  }

  // Prazo: expresso aplica +30% no total e reduz o prazo
  let total = base;
  if (prazo.pace > 1) {
    const acrescimo = base * (prazo.pace - 1);
    total = base + acrescimo;
    items.push({
      label: "Entrega expressa (+30%)",
      price: acrescimo,
      express: true,
    });
  }
  days = days * prazo.daymult;
  days = Math.max(2, Math.ceil(days));

  return { total, days, items };
}

/**
 * buildMessage(state, total, days) -> URL https://wa.me/... completa.
 * Saída idêntica ao motor v1 (mesma ordem de linhas e codificação).
 */
export function buildMessage(
  state: QuoteState,
  total: number,
  days: number,
): string {
  const d = DATA;
  const L: string[] = [];

  L.push("Olá! Montei meu orçamento no site da Zenaxis:");
  L.push("");

  if (state.nome) L.push("Nome: " + state.nome);

  const tipo = state.tipo ? d.tipo[state.tipo] : undefined;
  let proj = tipo ? tipo.label : "—";
  if (state.porte && d.porte[state.porte]) {
    proj += " (porte " + d.porte[state.porte].label.toLowerCase() + ")";
  }
  L.push("Projeto: " + proj);

  const ex: string[] = [];
  const extras = state.extras ?? [];
  for (const key of extras) {
    if (d.extras[key]) ex.push(d.extras[key].label);
  }
  L.push("Extras: " + (ex.length ? ex.join(", ") : "nenhum"));

  if (state.prazo && d.prazo[state.prazo]) {
    L.push("Prazo: " + d.prazo[state.prazo].label);
  }

  const ctx = state.contexto ?? {};
  if (ctx.identidade) L.push("Já tenho identidade visual: " + ctx.identidade);
  if (ctx.conteudo) L.push("Já tenho o conteúdo (textos/fotos): " + ctx.conteudo);

  L.push("");
  L.push("Investimento estimado: " + fmt(total) + " (a partir de)");
  L.push("Prazo aproximado: " + days + (days === 1 ? " dia útil" : " dias úteis"));
  L.push("");
  L.push("Gostaria de receber a proposta.");

  return waUrl(L.join("\n"));
}
