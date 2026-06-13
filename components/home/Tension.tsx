"use client";

/* ============================================================================
   SEÇÃO 2 — TENSÃO ("O VAZAMENTO"). Função psicológica: nomear a dor que o
   cliente sente mas não sabe nomear (perdeu venda pela fachada digital).
   Sem motion novo: usa o reveal existente (fade + settle). Texto completo
   no HTML servido (progressive enhancement).
============================================================================ */
import { useReveal } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

export function Tension() {
  const root = useReveal<HTMLDivElement>({ selector: "[data-rise]" });

  return (
    <section className="mx-auto max-w-[1180px] px-7 py-20 sm:py-28">
      <SectionLabel title="O vazamento" />

      <div ref={root} className="mt-12">
        <h2 data-rise className="t-h2 max-w-[20ch] text-balance">
          A reunião foi perfeita. Aí você mandou o link.
        </h2>

        <div className="measure t-body mt-8 space-y-6 text-ink-soft">
          <p data-rise>
            O prospect estava aquecido. Gostou do serviço, entendeu o valor,
            pediu o site pra validar com os sócios antes de fechar. Você mandou
            o link confiante.
          </p>
          <p data-rise>
            Ele clicou. E nesse segundo, tudo que você construiu na conversa
            começou a desmanchar.
          </p>
          <p data-rise>
            O site demorou pra abrir. Quando abriu, parecia template de
            quinhentos reais. Sem clareza, sem peso, sem a cara de quem cobra o
            que você cobra. O prospect não disse nada. Só esfriou. Sumiu no
            WhatsApp, ou voltou pedindo desconto, porque a percepção de valor
            que você levou semanas pra construir foi destruída em quatro
            segundos de carregamento.
          </p>
        </div>

        {/* O golpe da seção: pull quote isolado, com peso e respiro. */}
        <blockquote
          data-rise
          className="t-quote my-16 max-w-[26ch] border-l-[3px] border-accent pl-7 text-ink"
        >
          Você não perdeu o contrato pelo seu trabalho.{" "}
          <span className="text-accent">Perdeu pela sua fachada.</span>
        </blockquote>

        <p data-rise className="measure t-body text-ink-soft">
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
