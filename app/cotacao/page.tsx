import type { Metadata } from "next";
import { buildMessage, calc, fmt } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Monte sua cotação",
  description:
    "Escolha o tipo de projeto, porte, extras e prazo e veja o investimento estimado na hora. Sem formulário, sem espera.",
  alternates: { canonical: "/cotacao" },
};

/* Placeholder da Fase A: o motor já roda no servidor e o CTA leva a
   estimativa real pro WhatsApp. A interface interativa chega na Fase B. */
export default function CotacaoPage() {
  const base = calc({});
  const waHref = buildMessage({}, base.total, base.days);

  return (
    <section className="mx-auto max-w-[1180px] px-7 py-20">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft">
        Cotação viva
      </p>
      <h1 className="mt-6 max-w-[16ch] font-display text-[clamp(2.2rem,5.5vw,4rem)] font-[340] leading-[1.05] tracking-tight">
        Monte sua cotação <em className="text-accent">em minutos.</em>
      </h1>
      <p className="mt-6 max-w-[52ch] text-ink-soft">
        Em breve você ajusta tipo, porte, extras e prazo aqui mesmo e vê o
        valor mudar na hora. Por enquanto, uma landing page parte de{" "}
        <strong className="text-ink">{fmt(base.total)}</strong> com prazo
        aproximado de <strong className="text-ink">{base.days} dias úteis</strong>.
      </p>
      <a href={waHref} className="btn btn-accent btn-lg mt-8">
        <span>Receber proposta no WhatsApp</span>
      </a>
    </section>
  );
}
