"use client";

/* ============================================================================
   CONFIGURADOR DE COTAÇÃO (Fase C). Estado React em cima do MOTOR
   (lib/pricing) — nenhuma regra de preço é duplicada aqui: o componente só
   monta o QuoteState e chama calc/buildMessage.

   Acessibilidade (auditoria): grupos single-select são radiogroup de
   verdade (fieldset + role=radiogroup + inputs radio sr-only); extras é um
   grupo de checkboxes. Teclado e foco vêm dos inputs nativos.

   Progressive enhancement: o HTML servido já traz o estado default com os
   chips marcados e um href wa.me VÁLIDO. O JS só enriquece (pré-preenche
   pela URL, anima, atualiza o href a cada mudança).

   Motion (motion.md): press de carimbo no clique, tinta por wipe no chip
   ativo (CSS), preço em odômetro. Tudo cai pro estado final direto em
   ?capture=1 e prefers-reduced-motion (decidido no MotionProvider).
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

type CtxAnswer = "Sim" | "Não" | null;

interface UIState {
  tipo: TipoKey;
  porte: PorteKey;
  prazo: PrazoKey;
  extras: ExtraKey[];
  ctxIdentidade: CtxAnswer;
  ctxConteudo: CtxAnswer;
  nome: string;
}

const DEFAULT: UIState = {
  tipo: "landing",
  porte: "medio",
  prazo: "normal",
  extras: [],
  ctxIdentidade: null,
  ctxConteudo: null,
  nome: "",
};

/* Hints de UI (não vivem no motor; os labels sim, via DATA). */
const TIPO_HINT: Record<TipoKey, string> = {
  landing: "1 página que converte",
  institucional: "Várias páginas",
  sistema: "Sob medida",
};
const PORTE_HINT: Record<PorteKey, string> = {
  enxuto: "O essencial, no ar rápido",
  medio: "Mais seções e cuidado",
  robusto: "Completo, sob medida",
};
const PRAZO_HINT: Record<PrazoKey, string> = {
  normal: "Ritmo padrão",
  expresso: "+30% · prazo menor",
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
  hint,
}: {
  active: boolean;
  type: "radio" | "checkbox";
  name: string;
  onPick: () => void;
  mode: MotionMode;
  label: string;
  hint?: string;
}) {
  return (
    <label
      className="chip"
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
      {hint ? <span className="chip-hint">{hint}</span> : null}
    </label>
  );
}

/* ---------- Cabeçalho de grupo (rótulo mono numerado) ---------- */
function GroupHead({
  id,
  step,
  title,
  note,
}: {
  id: string;
  step: string;
  title: string;
  note?: string;
}) {
  return (
    <legend
      id={id}
      className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft"
    >
      {step} · {title}
      {note ? (
        <span className="ml-1 font-body text-[0.84rem] normal-case tracking-normal text-ink-soft">
          {note}
        </span>
      ) : null}
    </legend>
  );
}

export function Configurator() {
  const { mode } = useMotion();
  const [state, setState] = useState<UIState>(DEFAULT);
  const [ready, setReady] = useState(false);

  /* Pré-preenchimento via URL (uma vez), validado contra o motor. */
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

  /* Estado refletido na URL (compartilhável). Só depois do pré-preenchimento
     pra não apagar os params de entrada. nome fica de fora (pessoal).
     Semeia da URL atual e só sobrescreve as chaves canônicas, preservando
     params alheios (?capture=1, utm_*, etc.). */
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
    contexto: {
      identidade: state.ctxIdentidade,
      conteudo: state.ctxConteudo,
    },
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

  const progressSteps = [
    true, // tipo (sempre definido)
    true, // porte
    true, // prazo
    state.ctxIdentidade !== null,
    state.ctxConteudo !== null,
  ];
  const done = progressSteps.filter(Boolean).length;

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsSync onApply={applyParams} />
      </Suspense>

      {/* Progresso discreto */}
      <div className="mt-9 flex items-center gap-4" aria-hidden="true">
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-line">
          <div
            className="prog-fill h-full rounded-full bg-accent-deep"
            style={{ width: `${(done / progressSteps.length) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft">
          <b className="text-ink">{done}</b> / {progressSteps.length} definido
        </span>
      </div>

      <div className="mt-10 grid items-start gap-10 md:grid-cols-[1.18fr_0.82fr]">
        {/* ---------------- COLUNA: CONFIGURADOR ---------------- */}
        <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
          <fieldset role="radiogroup" aria-labelledby="g-tipo">
            <GroupHead id="g-tipo" step="01" title="Tipo de projeto" />
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(Object.keys(DATA.tipo) as TipoKey[]).map((key) => (
                <Chip
                  key={key}
                  type="radio"
                  name="tipo"
                  active={state.tipo === key}
                  onPick={() => setState((s) => ({ ...s, tipo: key }))}
                  mode={mode}
                  label={DATA.tipo[key].label}
                  hint={TIPO_HINT[key]}
                />
              ))}
            </div>
          </fieldset>

          <fieldset role="radiogroup" aria-labelledby="g-porte">
            <GroupHead
              id="g-porte"
              step="02"
              title="Porte"
              note="(afeta valor e prazo)"
            />
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(Object.keys(DATA.porte) as PorteKey[]).map((key) => (
                <Chip
                  key={key}
                  type="radio"
                  name="porte"
                  active={state.porte === key}
                  onPick={() => setState((s) => ({ ...s, porte: key }))}
                  mode={mode}
                  label={DATA.porte[key].label}
                  hint={PORTE_HINT[key]}
                />
              ))}
            </div>
          </fieldset>

          <fieldset role="group" aria-labelledby="g-extras">
            <GroupHead
              id="g-extras"
              step="03"
              title="Extras"
              note="(marque os que fizerem sentido)"
            />
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(Object.keys(DATA.extras) as ExtraKey[]).map((key) => (
                <Chip
                  key={key}
                  type="checkbox"
                  name="extras"
                  active={state.extras.includes(key)}
                  onPick={() => toggleExtra(key)}
                  mode={mode}
                  label={DATA.extras[key].label}
                />
              ))}
            </div>
          </fieldset>

          <fieldset role="radiogroup" aria-labelledby="g-prazo">
            <GroupHead id="g-prazo" step="04" title="Prazo desejado" />
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(Object.keys(DATA.prazo) as PrazoKey[]).map((key) => (
                <Chip
                  key={key}
                  type="radio"
                  name="prazo"
                  active={state.prazo === key}
                  onPick={() => setState((s) => ({ ...s, prazo: key }))}
                  mode={mode}
                  label={DATA.prazo[key].label}
                  hint={PRAZO_HINT[key]}
                />
              ))}
            </div>
          </fieldset>

          <fieldset role="radiogroup" aria-labelledby="g-ident">
            <GroupHead
              id="g-ident"
              step="05"
              title="Já tenho identidade visual?"
              note="(não muda o preço)"
            />
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(["Sim", "Não"] as const).map((val) => (
                <Chip
                  key={val}
                  type="radio"
                  name="ctx_identidade"
                  active={state.ctxIdentidade === val}
                  onPick={() => setState((s) => ({ ...s, ctxIdentidade: val }))}
                  mode={mode}
                  label={val}
                />
              ))}
            </div>
          </fieldset>

          <fieldset role="radiogroup" aria-labelledby="g-cont">
            <GroupHead
              id="g-cont"
              step="06"
              title="Já tenho o conteúdo (textos e fotos)?"
              note="(não muda o preço)"
            />
            <div className="mt-3 flex flex-wrap gap-2.5">
              {(["Sim", "Não"] as const).map((val) => (
                <Chip
                  key={val}
                  type="radio"
                  name="ctx_conteudo"
                  active={state.ctxConteudo === val}
                  onPick={() => setState((s) => ({ ...s, ctxConteudo: val }))}
                  mode={mode}
                  label={val}
                />
              ))}
            </div>
          </fieldset>
        </form>

        {/* ---------------- COLUNA: RESUMO AO VIVO ---------------- */}
        <aside
          className="rounded-[18px] bg-ink p-7 text-paper sm:p-8 md:sticky md:top-[88px]"
          aria-label="Resumo da cotação"
        >
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[#a89f8c]">
            Investimento estimado
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
          {/* Anúncio combinado pra leitores de tela: preço + prazo, ao vivo. */}
          <p role="status" aria-live="polite" className="sr-only">
            Investimento estimado {fmt(result.total)} a partir de. Prazo
            aproximado {result.days}{" "}
            {result.days === 1 ? "dia útil" : "dias úteis"}.
          </p>

          <ul className="mt-5 border-t border-[#322d23] pt-4 text-[0.86rem] text-[#cdc6b6]">
            {result.items.map((item) => (
              <li
                key={item.label}
                className="flex justify-between gap-3 py-1"
              >
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
            <span>Receber proposta no WhatsApp</span>
          </a>
          <p className="mt-3 text-[0.72rem] leading-snug text-[#a89f8c]">
            Estimativa pra você ter a faixa. O valor final sai depois de eu
            entender seu projeto, sem compromisso.
          </p>
        </aside>
      </div>

      {/* ---------------- BARRA FIXA MOBILE ---------------- */}
      {/* .mobile-quote-bar: o globals.css reserva 88px no fim do body via
          body:has(.mobile-quote-bar) — CSS puro, funciona sem JS. */}
      <div className="mobile-quote-bar fixed inset-x-0 bottom-0 z-[60] flex items-center gap-3 border-t border-[#322d23] bg-ink px-4 py-3 text-paper shadow-[0_-10px_30px_-18px_rgba(22,19,13,0.7)] md:hidden">
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
          <span>Receber proposta</span>
        </a>
      </div>
    </>
  );
}
