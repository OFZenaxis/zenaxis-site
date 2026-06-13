"use client";

/* ============================================================================
   SEÇÃO 5 — DIAGNÓSTICO ("O PROJETO"). Função: derrubar a objeção "não sei
   o que pedir". Reenquadra a cotação como diagnóstico de negócio. É a parte
   mais importante da E1. SaiuDelivery e PrimeTur reaparecem aqui como
   ATESTADO técnico (texto/selos), não como cards grandes.
   Reveal existente; sem motion novo. O Configurator cuida da sua própria
   interatividade (chips, odômetro, barra fixa, CTA wa.me no servidor).
============================================================================ */
import { useReveal } from "@/lib/motion";
import { Configurator } from "@/components/cotacao/Configurator";
import { SectionLabel } from "./SectionLabel";

export function Diagnostico() {
  const root = useReveal<HTMLDivElement>({ selector: "[data-rise]" });

  return (
    <section id="diagnostico" className="mx-auto max-w-[1180px] px-7 py-20 sm:py-28">
      <SectionLabel title="O projeto" />

      <div ref={root} className="mt-12">
        <h2 data-rise className="t-h2 max-w-[24ch] text-balance">
          Você não precisa saber o que pedir.{" "}
          <em className="text-accent">Esse é o meu trabalho.</em>
        </h2>

        <div className="measure t-body mt-8 space-y-6 text-ink-soft">
          <p data-rise>
            A essa altura você provavelmente pensou eu preciso disso, mas nem
            sei por onde começar. Site? Automação? As duas coisas? Que tipo? É
            exatamente aqui que a maioria desiste, não por falta de dinheiro,
            mas por não querer transformar a contratação num segundo emprego.
          </p>
          <p data-rise>
            Então deixa eu tirar esse peso das suas costas: você não desenha
            nada. Você me conta o problema do seu negócio, em palavras suas, e
            eu projeto a infraestrutura. Como um arquiteto: você não chega com
            a planta pronta, chega com o terreno e o sonho. A planta é comigo.
          </p>
        </div>

        {/* Cabeçalho do bloco interativo (a instrução do diagnóstico). */}
        <h3 data-rise className="t-h3 mt-14">
          Me mostre seu negócio em 2 minutos.
        </h3>
        <p data-rise className="t-body mt-2.5 max-w-[52ch] text-ink-soft">
          Responda como se estivesse me contando, e a faixa de investimento
          aparece na hora. Sem formulário, sem espera.
        </p>

        <div className="mt-9">
          <Configurator />
        </div>

        {/* Atestado de capacidade: SaiuDelivery e PrimeTur como prova técnica
            textual, não cards grandes. */}
        <div className="measure mt-16">
          <p data-rise className="t-body text-ink-soft">
            E se o seu negócio é dos complicados, com várias frentes, equipe,
            sistemas que não conversam, melhor ainda. Já construí um SaaS de
            delivery multiloja com pagamento e cozinha integrados, e um CRM de
            turismo que cota por inteligência artificial e atende sozinho. Se
            eu organizei essas operações, a sua eu organizo de olhos fechados.
          </p>
          <ul data-rise className="mt-5 flex flex-wrap gap-2.5">
            <li className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
              SaiuDelivery · SaaS de delivery
            </li>
            <li className="rounded-full border border-line px-3.5 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-soft">
              PrimeTur · CRM com IA
            </li>
          </ul>
        </div>

        <p
          data-rise
          className="t-quote mt-16 max-w-[26ch] border-l-[3px] border-accent pl-7"
        >
          Me conta o problema. Você sai dessa página com clareza,{" "}
          <span className="text-accent">não com lição de casa.</span>
        </p>
      </div>
    </section>
  );
}
