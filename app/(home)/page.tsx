import type { Metadata } from "next";
import Link from "next/link";
import { waLink } from "@/lib/contact";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* Placeholder da Fase A: estrutura semântica e conteúdo mínimo.
   As seções visuais (hero animado, cases, cotação viva) chegam na Fase B. */
export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-[1180px] px-7 py-20">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-soft">
          Zenaxis · Sites, automação e IA
        </p>
        <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(2.6rem,7vw,5.4rem)] font-[340] leading-[1.02] tracking-[-0.025em]">
          Eu não entrego site.
          <br />
          Entrego o que ele <em className="text-accent">faz pelo seu negócio.</em>
        </h1>
        <p className="mt-7 max-w-[52ch] text-[clamp(1.05rem,2.2vw,1.28rem)] leading-normal text-ink-soft">
          Presença digital que parece feita por gente, não por template: design
          distintivo, automação e IA sob medida. Do pequeno comércio à empresa
          que já fatura. A régua é a mesma: resultado.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3.5">
          <a href={waLink()} className="btn btn-accent btn-lg">
            Quero um orçamento
          </a>
          <Link href="/cotacao" className="btn btn-ghost btn-lg">
            Simular investimento
          </Link>
        </div>
      </section>

      <section id="servicos" className="mx-auto max-w-[1180px] px-7 py-16">
        <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-[360] leading-tight tracking-tight">
          Você não compra páginas.
          <br />
          <em className="text-accent">Compra o que elas resolvem.</em>
        </h2>
        <ul className="mt-8 grid gap-4 text-ink-soft">
          <li>
            <strong className="text-ink">Site que vende sozinho.</strong>{" "}
            Estrutura pensada para transformar visitante em conversa de
            WhatsApp.
          </li>
          <li>
            <strong className="text-ink">Automação do trabalho chato.</strong>{" "}
            Atendimento, acompanhamento, cotação e agendamento rodando sem
            você.
          </li>
          <li>
            <strong className="text-ink">IA aplicada ao seu negócio.</strong>{" "}
            Atendimento inteligente, busca, recomendação e CRM com IA
            integrada.
          </li>
        </ul>
      </section>

      <section id="cases" className="mx-auto max-w-[1180px] px-7 py-16">
        <h2 className="font-display text-[clamp(1.9rem,4.4vw,3.1rem)] font-[360] leading-tight tracking-tight">
          Trabalho real.
          <br />
          <em className="text-accent">Não mockup de banco de imagem.</em>
        </h2>
        <ul className="mt-8 grid gap-4 text-ink-soft">
          <li>
            <strong className="text-ink">SaiuDelivery.</strong> Plataforma SaaS
            para restaurantes terem delivery próprio e fugir da comissão dos
            apps.
          </li>
          <li>
            <strong className="text-ink">PrimeTur.</strong> CRM de turismo com
            IA: cotação por linguagem natural, agente de atendimento autônomo e
            busca semântica.
          </li>
        </ul>
      </section>

      <section id="contato" className="mx-auto max-w-[1180px] px-7 py-20 text-center">
        <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(2rem,5.5vw,3.6rem)] font-[340] leading-[1.05] tracking-tight">
          Seu concorrente já está online.
          <br />
          <em className="text-accent">E você?</em>
        </h2>
        <p className="mx-auto mt-4 max-w-[44ch] text-ink-soft">
          Me chama no WhatsApp, me conta o que você faz, e eu te digo em
          minutos o que dá pra construir.
        </p>
        <a href={waLink()} className="btn btn-accent btn-lg mt-8">
          Começar agora
        </a>
      </section>
    </>
  );
}
