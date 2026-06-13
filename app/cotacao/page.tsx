import type { Metadata } from "next";
import { Configurator } from "@/components/cotacao/Configurator";

export const metadata: Metadata = {
  title: "Monte sua cotação",
  description:
    "Escolha o tipo de projeto, porte, extras e prazo e veja o investimento estimado na hora. Sem formulário, sem espera.",
  alternates: { canonical: "/cotacao" },
};

/* O Configurator (client) já renderiza o estado default no servidor, com os
   chips marcados e um href wa.me válido — funciona sem JS. O JS pré-preenche
   pela URL, anima e atualiza o href a cada mudança. */
export default function CotacaoPage() {
  return (
    <section className="mx-auto max-w-[1180px] px-7 py-14 sm:py-16">
      <h1 className="max-w-[16ch] text-balance font-display text-[clamp(2.2rem,5.5vw,4rem)] font-[340] leading-[1.05] tracking-tight">
        Monte seu orçamento <em className="text-accent">em 1 minuto.</em>
      </h1>
      <p className="mt-5 max-w-[56ch] text-ink-soft">
        Clique no que faz sentido pro seu projeto e veja investimento e prazo se
        atualizarem na hora. É uma estimativa pra você ter a faixa. O valor
        final sai depois de uma conversa rápida, sem compromisso.
      </p>

      <Configurator />
    </section>
  );
}
