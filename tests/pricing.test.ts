/* ============================================================================
   Testes do porte do motor de cotação.
   Estratégia: executa o cotacao.js ORIGINAL (fixture copiada do projeto v1)
   num "window" falso e compara as saídas do módulo TS com as do motor v1
   numa matriz de estados. Se divergir em 1 centavo ou 1 caractere, falha.
============================================================================ */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WHATSAPP } from "../lib/contact";
import {
  DATA,
  type ExtraKey,
  type QuoteState,
  buildMessage,
  calc,
  fmt,
} from "../lib/pricing";

interface V1Engine {
  WA: string;
  data: typeof DATA;
  fmt(n: number): string;
  calc(state?: object): { total: number; days: number; items: object[] };
  buildMessage(state: object, total: number, days: number): string;
}

function loadV1(): V1Engine {
  const src = readFileSync(
    join(__dirname, "fixtures/cotacao.v1.js"),
    "utf8",
  );
  const fakeWindow: { COTACAO?: V1Engine } = {};
  new Function("window", src)(fakeWindow);
  if (!fakeWindow.COTACAO) throw new Error("Motor v1 não carregou");
  return fakeWindow.COTACAO;
}

const v1 = loadV1();

/* Matriz de estados: vazio, teaser (só tipo+extras), completos, inválidos. */
const ALL_EXTRAS = Object.keys(DATA.extras) as ExtraKey[];
const STATES: QuoteState[] = [
  {},
  { tipo: "landing" },
  { tipo: "institucional", extras: ["whatsapp"] },
  { tipo: "sistema", extras: ["ia", "crm"] },
  { tipo: "landing", porte: "enxuto", prazo: "normal" },
  { tipo: "landing", porte: "enxuto", prazo: "expresso" },
  { tipo: "institucional", porte: "medio", extras: ["seo"], prazo: "expresso" },
  { tipo: "sistema", porte: "robusto", extras: ALL_EXTRAS, prazo: "expresso" },
  {
    tipo: "institucional",
    porte: "robusto",
    extras: ["identidade", "whatsapp"],
    prazo: "normal",
    nome: "Fellipe",
    contexto: { identidade: "sim", conteudo: "parcial" },
  },
  { tipo: undefined, porte: undefined, extras: [], prazo: undefined },
];

describe("paridade com o motor v1 (cotacao.js)", () => {
  it("usa o mesmo número de WhatsApp", () => {
    expect(WHATSAPP).toBe(v1.WA);
  });

  it("usa a mesma tabela de preços e prazos", () => {
    expect(DATA).toEqual(v1.data);
  });

  it.each(STATES.map((s, i) => [i, s] as const))(
    "calc idêntico no estado %i",
    (_i, state) => {
      expect(calc(state)).toEqual(v1.calc(state));
    },
  );

  it.each(STATES.map((s, i) => [i, s] as const))(
    "buildMessage idêntico no estado %i",
    (_i, state) => {
      const ours = calc(state);
      const theirs = v1.calc(state);
      expect(buildMessage(state, ours.total, ours.days)).toBe(
        v1.buildMessage(state, theirs.total, theirs.days),
      );
    },
  );

  it("fmt idêntico em valores típicos", () => {
    for (const n of [0, 999.4, 1500, 2887.5, 16640, 123456.78]) {
      expect(fmt(n)).toBe(v1.fmt(n));
    }
  });
});

describe("regras de negócio", () => {
  it("estado vazio cai no default: landing, porte médio, prazo normal", () => {
    const r = calc({});
    expect(r.total).toBe(1500);
    expect(r.days).toBe(2);
    expect(r.items).toHaveLength(1);
    expect(r.items[0].label).toBe("Landing page");
  });

  it("expresso aplica +30% e reduz prazo (mínimo 2 dias)", () => {
    const normal = calc({ tipo: "landing", porte: "enxuto" });
    const expresso = calc({ tipo: "landing", porte: "enxuto", prazo: "expresso" });
    expect(expresso.total).toBeCloseTo(normal.total * 1.3, 10);
    expect(expresso.days).toBeGreaterThanOrEqual(2);
  });

  it("buildMessage gera URL wa.me real com a mensagem codificada", () => {
    const r = calc({ tipo: "landing" });
    const url = buildMessage({ tipo: "landing" }, r.total, r.days);
    expect(url.startsWith(`https://wa.me/${WHATSAPP}?text=`)).toBe(true);
    const msg = decodeURIComponent(url.split("?text=")[1]);
    expect(msg).toContain("Projeto: Landing page");
    expect(msg).toContain("Investimento estimado: R$ 1.500 (a partir de)");
  });
});
