import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { Tension } from "@/components/home/Tension";
import { Virada } from "@/components/home/Virada";
import { Prova } from "@/components/home/Prova";
import { Diagnostico } from "@/components/home/Diagnostico";
import { Fecho } from "@/components/home/Fecho";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* Home como ARGUMENTO de persuasão (E1): 6 seções, cada uma com uma função
   psicológica, preparando a próxima. Tensão -> virada -> prova -> diagnóstico
   -> fecho. A palavra-eixo é infraestrutura. */
export default function Home() {
  return (
    <>
      <Hero />
      <Tension />
      <Virada />
      <Prova />
      <Diagnostico />
      <Fecho />
    </>
  );
}
