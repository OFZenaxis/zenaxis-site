import type { Metadata } from "next";
import { Configurator } from "@/components/cotacao/Configurator";

export const metadata: Metadata = {
  title: "Me mostre seu negócio",
  description:
    "Me conta o problema do seu negócio em palavras suas e a faixa de investimento aparece na hora. Você não desenha nada, o projeto é meu.",
  alternates: { canonical: "/cotacao" },
};

/* O Configurator (client) já renderiza o estado default no servidor, com os
   chips marcados e um href wa.me válido — funciona sem JS. O JS pré-preenche
   pela URL, anima e atualiza o href a cada mudança. */
export default function CotacaoPage() {
  return (
    <section className="mx-auto max-w-[1180px] px-7 py-14 sm:py-16">
      <h1 className="max-w-[20ch] text-balance font-display text-[clamp(2.2rem,5.5vw,4rem)] font-[340] leading-[1.05] tracking-tight">
        Me mostre seu negócio <em className="text-accent">em 2 minutos.</em>
      </h1>
      <p className="mt-5 max-w-[58ch] text-ink-soft">
        Você não precisa saber o que pedir. Me conta o problema do seu negócio,
        em palavras suas, e a faixa de investimento aparece na hora. O projeto
        é meu trabalho, não o seu.
      </p>

      <div className="mt-10">
        <Configurator />
      </div>
    </section>
  );
}
