"use client";

/* ============================================================================
   SEÇÃO 3 — VIRADA ("A VIRADA"). Função: reposicionar o problema. Não é
   "site bonito", é INFRAESTRUTURA. Painel escuro (quebra de ritmo), com as
   frases de posicionamento em destaque. Reveal existente (fade + settle);
   sem motion novo. Texto completo no HTML servido.
   id=como-funciona: alvo do "Ver como funciona" do hero.
============================================================================ */
import { useReveal } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

const CHIPS = [
  "Carregamento instantâneo",
  "Estética com peso",
  "Estrutura que conduz",
  "Atendimento que qualifica",
  "Automação sob medida",
  "SEO técnico",
];

export function Virada() {
  const root = useReveal<HTMLDivElement>({ selector: "[data-rise]" });

  return (
    <section
      id="como-funciona"
      className="mx-auto max-w-[1180px] px-7 py-16 sm:py-20"
    >
      <SectionLabel title="A virada" />

      <div
        ref={root}
        className="relative mt-8 overflow-hidden rounded-[28px] bg-ink px-7 py-12 text-paper sm:px-12 sm:py-16"
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

        <h2
          data-rise
          className="relative max-w-[22ch] text-balance font-display text-[clamp(1.9rem,4.4vw,3rem)] font-[340] leading-[1.1] tracking-tight"
        >
          A maioria te venderia um site novo.{" "}
          <span className="text-accent">Esse é o erro.</span>
        </h2>

        <p
          data-rise
          className="relative mt-6 max-w-[60ch] text-[1.05rem] leading-relaxed text-[#cdc6b6]"
        >
          Trocar um site template por um site bonito não resolve nada. Você só
          troca uma fachada por outra um pouco melhor, e em seis meses está no
          mesmo lugar, porque o problema nunca foi a aparência. Foi a falta de
          uma estrutura pensada pra trabalhar.
        </p>

        {/* Frase de posicionamento (destaque). */}
        <p
          data-rise
          className="relative mt-9 max-w-[28ch] font-display text-[clamp(1.5rem,3.2vw,2.2rem)] font-[360] leading-[1.16] tracking-tight"
        >
          A Zenaxis não desenha telas. Constrói a{" "}
          <span className="text-accent">infraestrutura</span> que fica entre o
          seu cliente e o seu faturamento.
        </p>

        <div className="relative mt-9 max-w-[60ch] space-y-5 text-[1.05rem] leading-relaxed text-[#cdc6b6]">
          <p data-rise>
            Quando o prospect abre o seu link, três coisas acontecem ao mesmo
            tempo: ele carrega em menos de um segundo, sente na estética que
            ali tem peso e seriedade, e é conduzido por uma estrutura que
            responde as dúvidas dele e o empurra pra te chamar. O site para de
            ser um cartão de visita parado e vira a primeira coisa que trabalha
            a seu favor, não contra.
          </p>
          <p data-rise>
            E o WhatsApp que lotava de pergunta repetida? A infraestrutura
            qualifica antes de chegar em você. Você atende quem está pronto pra
            fechar, não quem está só perguntando preço.
          </p>
        </div>

        {/* Frase de fecho (destaque, ecoa o hero). */}
        <p
          data-rise
          className="relative mt-9 max-w-[30ch] font-display text-[clamp(1.5rem,3.2vw,2.2rem)] font-[360] leading-[1.16] tracking-tight"
        >
          Você não precisa de um site melhor. Precisa de uma{" "}
          <span className="text-accent">
            infraestrutura que sustente o preço que você cobra.
          </span>
        </p>

        {/* Chips de capacidade: apoio visual discreto, não o foco. */}
        <ul
          data-rise
          className="relative mt-10 flex flex-wrap gap-2.5 border-t border-[#322d23] pt-7"
        >
          {CHIPS.map((chip) => (
            <li
              key={chip}
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
