import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { Services } from "@/components/home/Services";
import { Differential } from "@/components/home/Differential";
import { Cases } from "@/components/home/Cases";
import { QuoteTeaser } from "@/components/home/QuoteTeaser";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Differential />
      <Cases />
      <QuoteTeaser />
      <FinalCta />
    </>
  );
}
