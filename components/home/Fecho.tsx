"use client";

/* ============================================================================
   SEÇÃO 6 — FECHO ("A CONVERSA"). Função: fechar sem pressão, no tom de
   "verdade pragmática". CTA único pro WhatsApp (href real no servidor).
   Reveal existente; sem motion novo.
============================================================================ */
import { waLink } from "@/lib/contact";
import { useReveal } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

const WA_MSG =
  "Olá! Quero conversar sobre a infraestrutura digital do meu negócio.";

export function Fecho() {
  const root = useReveal<HTMLDivElement>({ selector: "[data-rise]" });

  return (
    <section id="contato" className="mx-auto max-w-[1180px] px-7 py-16 sm:py-24">
      <SectionLabel title="A conversa" />

      <div ref={root} className="mt-10">
        <h2
          data-rise
          className="max-w-[24ch] text-balance font-display text-[clamp(2rem,4.8vw,3.4rem)] font-[340] leading-[1.06] tracking-tight"
        >
          Você chegou até aqui.{" "}
          <em className="text-accent">Acho que já sabe o próximo passo.</em>
        </h2>

        <div className="mt-7 max-w-[64ch] space-y-5 text-[1.05rem] leading-relaxed text-ink-soft sm:text-[1.12rem]">
          <p data-rise>
            Você viu o problema que te custa caro, viu como eu resolvo, e testou
            na prática o nível do que eu entrego. Não vou te pressionar com
            contagem regressiva nem desconto que vence à meia noite. Isso é
            coisa de quem precisa empurrar. Eu não preciso.
          </p>
          <p data-rise>
            Só uma conversa. Você me conta o seu negócio, eu te digo em poucos
            minutos o que dá pra construir e quanto custa. Sem reunião de uma
            hora, sem proposta de doze páginas que ninguém lê, sem compromisso.
          </p>
          <p data-rise>
            Se fizer sentido pra nós dois, a gente começa. Se não fizer, você
            sai com um diagnóstico que vale a conversa de qualquer forma.
          </p>
        </div>

        <div data-rise className="mt-9">
          <a href={waLink(WA_MSG)} className="btn btn-accent btn-lg">
            <span>Falar com a Zenaxis no WhatsApp</span>
          </a>
        </div>

        <p data-rise className="mt-5 text-[0.95rem] text-ink-soft">
          A infraestrutura que sustenta o seu preço começa com uma mensagem.
        </p>
      </div>
    </section>
  );
}
