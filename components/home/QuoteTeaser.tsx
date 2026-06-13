"use client";

/* ============================================================================
   SEÇÃO 03 COTAÇÃO (teaser estático da Fase B2). Chamada elegante + card
   resumo com o preço base vindo do lib/pricing (computado na renderização
   do servidor; o componente é determinista). Os chips interativos são a
   Fase C. Reveals padrão via useReveal.
============================================================================ */
import Link from "next/link";
import { calc, fmt } from "@/lib/pricing";
import { useReveal } from "@/lib/motion";
import { SectionLabel } from "./SectionLabel";

export function QuoteTeaser() {
  const root = useReveal<HTMLDivElement>({ selector: "[data-rise]" });
  const base = calc({});

  return (
    <section id="cotacao" className="mx-auto max-w-[1180px] px-7 py-16">
      <SectionLabel number="03" title="Cotação viva" />
      <div ref={root} className="mt-10 grid items-start gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2
            data-rise
            className="max-w-[20ch] font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-[360] leading-[1.06] tracking-tight"
          >
            Não vou te dizer que faço cotação bonita.
            <br />
            <em className="text-accent">Mexe numa, aqui.</em>
          </h2>
          <p data-rise className="mt-5 max-w-[48ch] text-ink-soft">
            Tipo de projeto, porte, extras e prazo: você escolhe e o valor
            muda na hora, sem formulário e sem esperar proposta. O resultado
            já sai pronto pra mandar no WhatsApp.
          </p>
        </div>

        <aside
          data-rise
          className="rounded-[18px] bg-ink p-7 text-paper sm:p-8"
        >
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[#a89f8c]">
            Investimento estimado
          </p>
          <p className="mt-2 font-display text-[3rem] leading-none tracking-tight">
            {fmt(base.total)}{" "}
            <span className="font-body text-[1rem] text-[#a89f8c]">
              a partir de
            </span>
          </p>
          <p className="mt-4 text-[0.95rem] text-[#e8e2d4]">
            Prazo aproximado:{" "}
            <strong className="text-accent">
              {base.days} dias úteis
            </strong>
          </p>
          <ul className="mt-5 border-t border-[#322d23] pt-4 text-[0.86rem] text-[#cdc6b6]">
            {base.items.map((item) => (
              <li key={item.label} className="flex justify-between gap-3 py-1">
                <span>{item.label}</span>
                <span className="text-white">{fmt(item.price)}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/cotacao"
            className="btn btn-accent mt-6 w-full justify-center"
          >
            <span>Montar cotação completa</span>
          </Link>
          <p className="mt-3 text-[0.72rem] leading-snug text-[#a89f8c]">
            Esse é o ponto de partida de uma landing page. Na cotação completa
            você ajusta tudo; o valor segue sendo estimativa, sem compromisso.
          </p>
        </aside>
      </div>
    </section>
  );
}
