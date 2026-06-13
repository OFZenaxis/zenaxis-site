"use client";

/* ============================================================================
   SEÇÃO 3 — VIRADA ("A VIRADA"). Função: a resolução. Coreografia E2b: o
   painel escuro ASSENTA como bloco (decisão tomada), as frases de destaque
   assentam com leve atraso sobre o corpo, e os 6 chips de capacidade entram
   por último em stagger, carimbando (scale settle). Profundidade da E2a
   intacta. Vocabulário "impresso vivo" (reusa lib/motion).
   id=como-funciona: alvo do "Ver como funciona" do hero.
============================================================================ */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DUR, EASE, STAGGER, useMotion } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const CHIPS = [
  "Carregamento instantâneo",
  "Estética com peso",
  "Estrutura que conduz",
  "Atendimento que qualifica",
  "Automação sob medida",
  "SEO técnico",
];

export function Virada() {
  const root = useRef<HTMLElement>(null);
  const { mode } = useMotion();

  useEffect(() => {
    const el = root.current;
    if (!el || mode === "static") return;

    const ctx = gsap.context(() => {
      const panel = el.querySelector<HTMLElement>("[data-panel]");
      const destaques = gsap.utils.toArray<HTMLElement>("[data-destaque]", el);
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", el);

      gsap.set(destaques, { opacity: 0, y: 12 });
      gsap.set(chips, { opacity: 0, scale: 0.92 });

      /* Painel assenta como bloco; destaques assentam por cima, com atraso. */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
      tl.from(panel, { opacity: 0, y: 18, duration: DUR.slow, ease: EASE.out }, 0);
      tl.to(
        destaques,
        {
          opacity: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.settle,
          stagger: STAGGER.loose,
        },
        0.45,
      );

      /* Chips carimbam por último, quando alcançados. */
      gsap.to(chips, {
        opacity: 1,
        scale: 1,
        duration: DUR.fast,
        ease: EASE.out,
        stagger: STAGGER.base,
        scrollTrigger: {
          trigger: el.querySelector("[data-chips]"),
          start: "top 90%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [mode]);

  return (
    <section
      ref={root}
      id="como-funciona"
      className="mx-auto max-w-[1180px] px-7 py-20 sm:py-28"
    >
      <SectionLabel title="A virada" />

      <div
        data-panel
        className="elev-high relative mt-10 overflow-hidden rounded-panel bg-ink px-7 py-14 text-paper sm:px-14 sm:py-20"
      >
        {/* Respingo de tinta estático no canto (decorativo, sem loop). */}
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,64,15,0.32), transparent 70%)",
          }}
        />

        <h2 className="t-h2 relative max-w-[22ch] text-balance">
          A maioria te venderia um site novo.{" "}
          <span className="text-accent">Esse é o erro.</span>
        </h2>

        <p className="t-body relative mt-7 max-w-[58ch] text-[#cdc6b6]">
          Trocar um site template por um site bonito não resolve nada. Você só
          troca uma fachada por outra um pouco melhor, e em seis meses está no
          mesmo lugar, porque o problema nunca foi a aparência. Foi a falta de
          uma estrutura pensada pra trabalhar.
        </p>

        {/* Frase de posicionamento (destaque, assenta com atraso). */}
        <p data-destaque className="t-quote relative mt-12 max-w-[26ch]">
          A Zenaxis não desenha telas. Constrói a{" "}
          <span className="text-accent">infraestrutura</span> que fica entre o
          seu cliente e o seu faturamento.
        </p>

        <div className="t-body relative mt-12 max-w-[58ch] space-y-6 text-[#cdc6b6]">
          <p>
            Quando o prospect abre o seu link, três coisas acontecem ao mesmo
            tempo: ele carrega em menos de um segundo, sente na estética que
            ali tem peso e seriedade, e é conduzido por uma estrutura que
            responde as dúvidas dele e o empurra pra te chamar. O site para de
            ser um cartão de visita parado e vira a primeira coisa que trabalha
            a seu favor, não contra.
          </p>
          <p>
            E o WhatsApp que lotava de pergunta repetida? A infraestrutura
            qualifica antes de chegar em você. Você atende quem está pronto pra
            fechar, não quem está só perguntando preço.
          </p>
        </div>

        {/* Frase de fecho (destaque, ecoa o hero). */}
        <p data-destaque className="t-quote relative mt-12 max-w-[28ch]">
          Você não precisa de um site melhor. Precisa de uma{" "}
          <span className="text-accent">
            infraestrutura que sustente o preço que você cobra.
          </span>
        </p>

        {/* Chips de capacidade: apoio visual discreto, carimbam por último. */}
        <ul
          data-chips
          className="relative mt-12 flex flex-wrap gap-2.5 border-t border-[#322d23] pt-8"
        >
          {CHIPS.map((chip) => (
            <li
              key={chip}
              data-chip
              className="rounded-full border border-[#3a352a] px-3.5 py-1.5 text-[0.78rem] text-[#a89f8c]"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
