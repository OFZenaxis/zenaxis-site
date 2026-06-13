"use client";

/* ============================================================================
   DIAGNÓSTICO DE NEGÓCIO (E1, reenquadramento da cotação da Fase C).
   A interface deixa de ser "menu de produtos" e vira diagnóstico: as
   perguntas falam a REALIDADE do cliente (objetivo, tamanho, gargalo,
   urgência), não a solução técnica.

   O MOTOR (lib/pricing) é intocado: cada rótulo humano só MAPEIA pra uma
   chave que o motor já entende (tipo/porte/prazo/extras). Os preços e a
   mensagem do WhatsApp seguem idênticos.

   Mantém tudo que a Fase C entregou: radiogroups semânticos, odômetro,
   barra fixa mobile, href wa.me real no servidor (progressive enhancement),
   press de carimbo e tinta por wipe (motion.md). Nenhum motion novo.
============================================================================ */
import { Suspense, useCallback, useEffect, useState } from "react";
import {
  DATA,
  type ExtraKey,
  type PorteKey,
  type PrazoKey,
  type QuoteState,
  type TipoKey,
  buildMessage,
  calc,
  fmt,
} from "@/lib/pricing";
import { stampPress, useMotion, type MotionMode } from "@/lib/motion";
import { Odometer } from "./Odometer";
import { SearchParamsSync } from "./SearchParamsSync";

interface UIState {
  tipo: TipoKey;
  porte: PorteKey;
  prazo: PrazoKey;
  extras: ExtraKey[];
  nome: string;
}

const DEFAULT: UIState = {
  tipo: "landing",
  porte: "medio",
  prazo: "normal",
  extras: [],
  nome: "",
};

/* ---- Rótulos humanos -> chaves do motor (apresentação, não preço) ---- */
/* O rótulo do meio descreve o que o tier institucional entrega de fato
   (site completo, várias páginas), não automação. Automação é gargalo
   (extras ia/crm/whatsapp) e aparece no tier sistema ("site mais
   automação"), pra não prometer o que o orçamento não mostra. */
const TIPO_OPT: Record<TipoKey, string> = {
  landing: "Preciso passar mais credibilidade e fechar mais caro",
  institucional: "Quero um site completo, com mais páginas e presença",
  sistema: "Quero uma operação completa, site mais automação",
};
const PORTE_OPT: Record<PorteKey, string> = {
  enxuto: "Só eu, comecei agora",
  medio: "Tenho uma equipe pequena",
  robusto: "Operação estabelecida, com várias frentes",
};
const PRAZO_OPT: Record<PrazoKey, string> = {
  normal: "Tenho um prazo confortável",
  expresso: "É urgente, preciso pra ontem",
};
const EXTRA_OPT: Record<ExtraKey, string> = {
  whatsapp: "Meu WhatsApp não dá conta do movimento",
  ia: "Respondo as mesmas perguntas o dia inteiro",
  crm: "Perco contatos e não faço acompanhamento",
  seo: "Ninguém me encontra no Google",
  identidade: "Minha marca não passa o meu nível",
};

const INCLUSO = [
  "Domínio configurado",
  "Hospedagem inicial",
  "Certificado SSL",
  "Responsivo (mobile)",
  "Rodadas de revisão",
  "Publicação no ar",
];

/* ---------- Chip (label envolvendo input nativo sr-only) ---------- */
function Chip({
  active,
  type,
  name,
  onPick,
  mode,
  label,
}: {
  active: boolean;
  type: "radio" | "checkbox";
  name: string;
  onPick: () => void;
  mode: MotionMode;
  label: string;
}) {
  return (
    <label
      className="chip w-full"
      data-active={active}
      onClick={(e) => stampPress(e.currentTarget, mode)}
    >
      <input
        type={type}
        name={name}
        checked={active}
        onChange={onPick}
        className="sr-only"
      />
      <span>{label}</span>
    </label>
  );
}

/* ---------- Pergunta do diagnóstico (legend acessível) ---------- */
function GroupHead({
  id,
  step,
  question,
}: {
  id: string;
  step: string;
  question: string;
}) {
  return (
    <legend id={id} className="flex items-baseline gap-3">
      <span className="font-mono text-[0.72rem] tracking-[0.16em] text-accent-deep">
        {step}
      </span>
      <span className="font-display text-[1.12rem] font-medium leading-snug tracking-tight text-ink">
        {question}
      </span>
    </legend>
  );
}

export function Configurator() {
  const { mode } = useMotion();
  const [state, setState] = useState<UIState>(DEFAULT);
  const [ready, setReady] = useState(false);

  /* Pré-preenchimento via URL (uma vez), validado contra o motor.
     As chaves da URL são as do MOTOR (tipo/porte/prazo/extras), não os
     rótulos humanos, então a continuidade vinda de outras telas funciona. */
  const applyParams = useCallback((sp: URLSearchParams) => {
    setState((prev) => {
      const next: UIState = { ...prev };
      const tipo = sp.get("tipo");
      if (tipo && tipo in DATA.tipo) next.tipo = tipo as TipoKey;
      const porte = sp.get("porte");
      if (porte && porte in DATA.porte) next.porte = porte as PorteKey;
      const prazo = sp.get("prazo");
      if (prazo && prazo in DATA.prazo) next.prazo = prazo as PrazoKey;
      const extras = sp.get("extras");
      if (extras) {
        const keys = extras
          .split(",")
          .map((x) => x.trim())
          .filter((k) => k in DATA.extras) as ExtraKey[];
        next.extras = [...new Set(keys)];
      }
      return next;
    });
    setReady(true);
  }, []);

  /* Estado refletido na URL (compartilhável). Só após o pré-preenchimento.
     Semeia da URL atual e só sobrescreve as chaves canônicas. */
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams(window.location.search);
    p.set("tipo", state.tipo);
    p.set("porte", state.porte);
    p.set("prazo", state.prazo);
    if (state.extras.length) p.set("extras", state.extras.join(","));
    else p.delete("extras");
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [state.tipo, state.porte, state.prazo, state.extras, ready]);

  /* ---- Ponte com o MOTOR (sem duplicar lógica de preço) ---- */
  const engineState: QuoteState = {
    tipo: state.tipo,
    porte: state.porte,
    prazo: state.prazo,
    extras: state.extras,
    contexto: { identidade: null, conteudo: null },
    nome: state.nome.trim() || undefined,
  };
  const result = calc(engineState);
  const waHref = buildMessage(engineState, result.total, result.days);

  const toggleExtra = (key: ExtraKey) =>
    setState((s) => ({
      ...s,
      extras: s.extras.includes(key)
        ? s.extras.filter((k) => k !== key)
        : [...s.extras, key],
    }));

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsSync onApply={applyParams} />
      </Suspense>

      <div className="grid items-start gap-10 md:grid-cols-[1.18fr_0.82fr]">
        {/* ---------------- COLUNA: DIAGNÓSTICO ---------------- */}
        {/* min-w-0: evita que a coluna estoure a largura em telas estreitas. */}
        <form className="flex min-w-0 flex-col gap-9" onSubmit={(e) => e.preventDefault()}>
          <fieldset role="radiogroup" aria-labelledby="g-tipo">
            <GroupHead
              id="g-tipo"
              step="01"
              question="Qual é o seu objetivo principal?"
            />
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {(Object.keys(DATA.tipo) as TipoKey[]).map((key) => (
                <Chip
                  key={key}
                  type="radio"
                  name="tipo"
                  active={state.tipo === key}
                  onPick={() => setState((s) => ({ ...s, tipo: key }))}
                  mode={mode}
                  label={TIPO_OPT[key]}
                />
              ))}
            </div>
          </fieldset>

          <fieldset role="radiogroup" aria-labelledby="g-porte">
            <GroupHead
              id="g-porte"
              step="02"
              question="Qual o tamanho da sua operação hoje?"
            />
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {(Object.keys(DATA.porte) as PorteKey[]).map((key) => (
                <Chip
                  key={key}
                  type="radio"
                  name="porte"
                  active={state.porte === key}
                  onPick={() => setState((s) => ({ ...s, porte: key }))}
                  mode={mode}
                  label={PORTE_OPT[key]}
                />
              ))}
            </div>
          </fieldset>

          <fieldset role="group" aria-labelledby="g-gargalo">
            <GroupHead
              id="g-gargalo"
              step="03"
              question="Onde está o seu maior gargalo hoje?"
            />
            <p className="mt-1 text-[0.86rem] text-ink-soft">
              Marque tudo que você reconhecer.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {(Object.keys(DATA.extras) as ExtraKey[]).map((key) => (
                <Chip
                  key={key}
                  type="checkbox"
                  name="extras"
                  active={state.extras.includes(key)}
                  onPick={() => toggleExtra(key)}
                  mode={mode}
                  label={EXTRA_OPT[key]}
                />
              ))}
            </div>
          </fieldset>

          <fieldset role="radiogroup" aria-labelledby="g-prazo">
            <GroupHead id="g-prazo" step="04" question="Qual a sua urgência?" />
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {(Object.keys(DATA.prazo) as PrazoKey[]).map((key) => (
                <Chip
                  key={key}
                  type="radio"
                  name="prazo"
                  active={state.prazo === key}
                  onPick={() => setState((s) => ({ ...s, prazo: key }))}
                  mode={mode}
                  label={PRAZO_OPT[key]}
                />
              ))}
            </div>
          </fieldset>
        </form>

        {/* ---------------- COLUNA: FAIXA DE PARTIDA ----------------
            Sticky no desktop: o painel acompanha a rolagem das perguntas
            (top-[88px] = header 66px + folga). Como vive dentro do grid, ele
            solta no fim das perguntas, sem nunca cobrir o rodapé. elev-high
            dá a mesma elevação de ambiente do painel da Virada. */}
        <aside
          className="elev-high min-w-0 rounded-card bg-ink p-7 text-paper sm:p-8 md:sticky md:top-[88px]"
          aria-label="Faixa de investimento"
        >
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[#a89f8c]">
            Faixa de investimento
          </p>
          {/* Visível: odômetro + prazo (aria-hidden; o anúncio ao vivo é o
              status sr-only abaixo, pra não ler os dígitos rolando). */}
          <p
            className="mt-2 flex items-baseline gap-2"
            data-total={result.total}
            data-days={result.days}
            aria-hidden="true"
          >
            <Odometer
              value={result.total}
              className="font-display text-[3rem] leading-none tracking-tight"
            />
            <span className="font-body text-[1rem] text-[#a89f8c]">
              a partir de
            </span>
          </p>
          <p className="mt-4 text-[0.95rem] text-[#e8e2d4]" aria-hidden="true">
            Prazo aproximado:{" "}
            <strong className="text-accent">
              {result.days} {result.days === 1 ? "dia útil" : "dias úteis"}
            </strong>
          </p>
          <p role="status" aria-live="polite" className="sr-only">
            Faixa de investimento {fmt(result.total)} a partir de. Prazo
            aproximado {result.days}{" "}
            {result.days === 1 ? "dia útil" : "dias úteis"}.
          </p>

          <ul className="mt-5 border-t border-[#322d23] pt-4 text-[0.86rem] text-[#cdc6b6]">
            {result.items.map((item) => (
              <li key={item.label} className="flex justify-between gap-3 py-1">
                <span>{item.label}</span>
                <span className={item.express ? "text-accent" : "text-white"}>
                  {item.express ? "+ " : ""}
                  {fmt(item.price)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-[#322d23] pt-4">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[#a89f8c]">
              Já incluso, sem custo extra
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.82rem] text-[#cdc6b6]">
              {INCLUSO.map((i) => (
                <li key={i} className="flex items-start gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ✓
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 border-t border-[#322d23] pt-4">
            <label
              htmlFor="nome"
              className="block font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[#a89f8c]"
            >
              Seu nome (opcional)
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Como devo te chamar?"
              value={state.nome}
              onChange={(e) => setState((s) => ({ ...s, nome: e.target.value }))}
              className="mt-2.5 w-full rounded-xl border-[1.5px] border-[#3a352a] bg-[#211c14] px-3.5 py-3 text-[0.95rem] text-white placeholder:text-[#948a76] focus:border-accent focus:outline-none"
            />
          </div>

          <a
            id="waCta"
            data-wa-cta
            href={waHref}
            className="btn btn-accent mt-6 w-full justify-center"
          >
            <span>Mandar pro WhatsApp e conversar</span>
          </a>
          <p className="mt-3 text-[0.72rem] leading-snug text-[#a89f8c]">
            Esse é o ponto de partida da nossa conversa, não a conta final.
          </p>
        </aside>
      </div>

      {/* ---------------- BARRA FIXA MOBILE ---------------- */}
      {/* .mobile-quote-bar: o globals.css reserva 88px no fim do body via
          body:has(.mobile-quote-bar) — CSS puro, funciona sem JS. */}
      <div className="mobile-quote-bar elev-high-up fixed inset-x-0 bottom-0 z-[60] flex items-center gap-3 border-t border-[#322d23] bg-ink px-4 py-3 text-paper md:hidden">
        <div className="flex flex-col leading-tight">
          <Odometer
            value={result.total}
            className="font-display text-[1.5rem] tracking-tight"
          />
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#a89f8c]">
            a partir de
          </span>
        </div>
        <a
          id="waCtaMobile"
          data-wa-cta
          href={waHref}
          className="btn btn-accent flex-1 justify-center whitespace-nowrap"
        >
          <span>Conversar</span>
        </a>
      </div>
    </>
  );
}
