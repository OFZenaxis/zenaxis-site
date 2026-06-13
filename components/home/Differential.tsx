"use client";

/* ============================================================================
   SEÇÃO DIFERENCIAL. Painel escuro com reveals padrão (fade + settle de
   12px, stagger por elemento) via useReveal.
============================================================================ */
import { useReveal } from "@/lib/motion";

const CHIPS = [
  "Design distintivo",
  "WhatsApp integrado",
  "Automação de atendimento",
  "CRM + IA",
  "SEO técnico",
  "Performance real",
];

export function Differential() {
  const root = useReveal<HTMLDivElement>({ selector: "[data-rise]" });

  return (
    <section className="mx-auto max-w-[1180px] px-7 py-16">
      <div
        ref={root}
        className="relative overflow-hidden rounded-[28px] bg-ink px-7 py-10 text-paper sm:px-12 sm:py-14"
      >
        {/* Respingo de tinta estático no canto (decorativo, sem loop). */}
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,64,15,0.35), transparent 70%)",
          }}
        />

        <p
          data-rise
          className="relative font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent"
        >
          O diferencial
        </p>
        <h2
          data-rise
          className="relative mt-4 max-w-[20ch] font-display text-[clamp(1.8rem,4vw,2.8rem)] font-[340] leading-[1.1] tracking-tight"
        >
          A maioria entrega um site e some.
          <br />
          Eu entrego o <em className="text-accent">sistema inteiro</em> e fico.
        </h2>
        <p data-rise className="relative mt-5 max-w-[58ch] text-[#cdc6b6]">
          Qualquer um hoje faz alguma coisa com Wix ou IA. O que ninguém faz
          por preço de commodity é amarrar site, automação e inteligência num
          produto que continua trabalhando pelo seu negócio depois que vai ao
          ar. É aí que eu moro.
        </p>

        <ul className="relative mt-8 flex flex-wrap gap-3.5">
          {CHIPS.map((chip) => (
            <li
              key={chip}
              data-rise
              className="rounded-full border border-[#3a352a] px-4.5 py-2 text-[0.85rem] text-[#e8e2d4]"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
