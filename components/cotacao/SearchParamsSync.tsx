"use client";

/* ============================================================================
   Lê os query params UMA vez no mount e entrega ao Configurator pra
   pré-preencher os chips. Fica dentro de um <Suspense> — assim o HTML
   estático do Configurator (estado default, href válido) NÃO depende deste
   subtree, preservando o progressive enhancement.

   Detalhe importante: numa página ESTÁTICA, useSearchParams() pode vir VAZIO
   no primeiro render do cliente (os params só populam depois). Por isso
   lemos via o hook (mantém o vínculo de rota / Suspense), mas APLICAMOS de
   window.location.search, que é autoritativo no cliente desde o mount.
============================================================================ */
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export function SearchParamsSync({
  onApply,
}: {
  onApply: (params: URLSearchParams) => void;
}) {
  const sp = useSearchParams();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    onApply(new URLSearchParams(window.location.search));
  }, [sp]);

  return null;
}
