"use client";

/* ============================================================================
   SEÇÃO 2 — TENSÃO ("O VAZAMENTO"). Função: nomear a dor. Coreografia E2b:
   a cena se revela parágrafo a parágrafo (conduz a leitura de cima pra
   baixo) e a frase martelo "Perdeu pela sua fachada" tem um BEAT próprio —
   entra depois, com a régua de tinta secando (scaleY) e o accent assentando
   por último, como sentença. Pausa dramática, não espetáculo.

   Vocabulário "impresso vivo" (reusa lib/motion: EASE/DUR/STAGGER). Roda uma
   vez, respeita mode static (capture/reduced vão direto ao final) e PE
   (texto completo no SSR; o gsap só esconde após o mount).
============================================================================ */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, SETTLE_Y, STAGGER, useMotion } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger);

export function Tension() {
  const root = useRef<HTMLElement>(null);
  const { mode } = useMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || mode === "static") return;

    const ctx = gsap.context(() => {
      /* A cena: título + parágrafos guiam a leitura, em sequência. */
      gsap.from(gsap.utils.toArray<HTMLElement>("[data-scene]", el), {
        opacity: 0,
        y: SETTLE_Y,
        duration: DUR.base,
        ease: EASE.settle,
        stagger: STAGGER.base,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });

      /* O golpe: beat próprio quando a frase martelo entra. A régua de tinta
         seca (scaleY de cima), a primeira oração assenta, e o accent cai por
         último. */
      const hammer = el.querySelector<HTMLElement>("[data-hammer]");
      if (hammer) {
        const rule = hammer.querySelector("[data-rule]");
        const lead = hammer.querySelector("[data-lead]");
        const accent = hammer.querySelector("[data-accent]");
        gsap.set(rule, { scaleY: 0, transformOrigin: "top center" });
        gsap.set([lead, accent], { opacity: 0, y: SETTLE_Y });

        const htl = gsap.timeline({
          scrollTrigger: { trigger: hammer, start: "top 82%", once: true },
        });
        htl.to(rule, { scaleY: 1, duration: DUR.base, ease: EASE.draw }, 0);
        htl.to(lead, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.settle }, 0.18);
        htl.to(accent, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.settle }, 0.46);
      }

      /* O agravante assenta sozinho quando alcançado. */
      gsap.from(el.querySelector("[data-agravante]"), {
        opacity: 0,
        y: SETTLE_Y,
        duration: DUR.base,
        ease: EASE.settle,
        scrollTrigger: {
          trigger: el.querySelector("[data-agravante]"),
          start: "top 88%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [mode]);

  return (
    <section ref={root} className="mx-auto max-w-[1180px] px-7 py-20 sm:py-28">
      <SectionLabel title="O vazamento" />

      <div className="mt-12">
        <h2 data-scene className="t-h2 max-w-[20ch] text-balance">
          A reunião foi perfeita. Aí você mandou o link.
        </h2>

        <div className="measure t-body mt-8 space-y-6 text-ink-soft">
          <p data-scene>
            O prospect estava aquecido. Gostou do serviço, entendeu o valor,
            pediu o site pra validar com os sócios antes de fechar. Você mandou
            o link confiante.
          </p>
          <p data-scene>
            Ele clicou. E nesse segundo, tudo que você construiu na conversa
            começou a desmanchar.
          </p>
          <p data-scene>
            O site demorou pra abrir. Quando abriu, parecia template de
            quinhentos reais. Sem clareza, sem peso, sem a cara de quem cobra o
            que você cobra. O prospect não disse nada. Só esfriou. Sumiu no
            WhatsApp, ou voltou pedindo desconto, porque a percepção de valor
            que você levou semanas pra construir foi destruída em quatro
            segundos de carregamento.
          </p>
        </div>

        {/* O golpe da seção: pull quote isolado, com beat próprio. A régua de
            tinta (data-rule) seca de cima; o accent (data-accent) cai por
            último. */}
        <blockquote
          data-hammer
          className="t-quote relative my-16 max-w-[26ch] pl-7 text-ink"
        >
          <span
            data-rule
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-[3px] bg-accent"
          />
          <span data-lead>Você não perdeu o contrato pelo seu trabalho. </span>
          <span data-accent className="text-accent">
            Perdeu pela sua fachada.
          </span>
        </blockquote>

        <p data-agravante className="measure t-body text-ink-soft">
          E não para no primeiro contato. Você lança uma campanha, o WhatsApp
          lota de gente perguntando a mesma coisa, e lá vai seu dia inteiro
          respondendo manualmente o que um site bem feito qualificaria sozinho.
          Seu negócio sangra duas vezes: na venda que não fecha e na hora que
          você queima fazendo trabalho de robô.
        </p>
      </div>
    </section>
  );
}
