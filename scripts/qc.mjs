/* ============================================================================
   QC: valida o HTML renderizado de / e /cotacao.
   Checa: <main> landmark, links wa.me reais no href, canonical zenaxis.com.br,
   og:image resolvível, radiogroup na cotação, lazy do vídeo, etc.

   Uso local:    npm run build && npm run qc
   Uso staging:  QC_URL=https://xxxx.hstgr.cloud npm run qc
                 (ou: node scripts/qc.mjs https://xxxx.hstgr.cloud)
   Com URL externa, NÃO sobe servidor local — testa a URL passada.
============================================================================ */
import { spawn } from "node:child_process";

const EXTERNAL = (process.env.QC_URL || process.argv[2] || "").replace(/\/$/, "");
const PORT = 3105;
const ORIGIN = EXTERNAL || `http://localhost:${PORT}`;
const failures = [];

console.log(`QC alvo: ${ORIGIN}${EXTERNAL ? "  (staging/externo)" : "  (build local)"}\n`);

function check(name, ok, extra = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? `  (${extra})` : ""}`);
  if (!ok) failures.push(name);
}

const server = EXTERNAL
  ? null
  : spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
      { stdio: "ignore" },
    );

try {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try {
      const r = await fetch(ORIGIN + "/", { redirect: "manual" });
      up = r.status < 500;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!up) throw new Error("Servidor não subiu em 30s");

  const html = await (await fetch(ORIGIN + "/")).text();

  check("HTML contém <main>", /<main[\s>]/.test(html));
  check(
    "CTA com link wa.me real no href (sem depender de JS)",
    /href="https:\/\/wa\.me\/5561995783461\?text=/.test(html),
  );
  check(
    "canonical aponta para https://zenaxis.com.br",
    /<link[^>]+rel="canonical"[^>]+href="https:\/\/zenaxis\.com\.br\/?"/.test(html),
  );

  const ogMatch = html.match(/property="og:image"[^>]*content="([^"]+)"/);
  check("meta og:image presente", Boolean(ogMatch), ogMatch?.[1] ?? "");

  if (ogMatch) {
    const ogPath = new URL(ogMatch[1]).pathname + new URL(ogMatch[1]).search;
    const og = await fetch(ORIGIN + ogPath);
    check(
      "og:image resolvível (200, image/png, 1200x630 declarada)",
      og.status === 200 && og.headers.get("content-type")?.includes("image/png"),
      `${og.status} ${og.headers.get("content-type")}`,
    );
    check(
      "og:image com dimensões 1200x630 no HTML",
      /property="og:image:width"[^>]*content="1200"/.test(html) &&
        /property="og:image:height"[^>]*content="630"/.test(html),
    );
  }

  /* Progressive enhancement (Fase B1): todo o texto do hero presente e
     visível no HTML servido, sem nenhum estado escondido inline. */
  check(
    "hero: kicker completo no HTML servido",
    html.includes("Zenaxis · Sites, automação e IA"),
  );
  check(
    "hero: título completo no HTML servido",
    html.includes("Eu não entrego site.") &&
      html.includes("Entrego o que ele") &&
      html.includes("faz pelo seu negócio."),
  );
  check(
    "hero: stats concretos no HTML servido",
    html.includes("24h a 7d") &&
      html.includes("95+") &&
      html.includes("Você aprova"),
  );
  check(
    "sem opacity:0 inline no HTML servido (estado escondido só via JS)",
    !/style="[^"]*opacity:\s*0/.test(html) && !/opacity:0/.test(html),
  );
  check(
    "sem clip-path inline no HTML servido",
    !/style="[^"]*clip-path/.test(html),
  );

  /* Fase B2: prova navegável e imagens de case corretas. */
  check(
    "link do Forja (treinolandpage) no HTML servido",
    html.includes('href="https://treinolandpage.zenaxis.com.br"'),
  );
  const caseImgs = [
    ...html.matchAll(/<img[^>]+(?:\/cases\/|%2Fcases%2F)[^>]*>/g),
  ].map((m) => m[0]);
  check(
    "2 imagens de case com width/height no HTML servido",
    caseImgs.length === 2 &&
      caseImgs.every((tag) => /width="\d+"/.test(tag) && /height="\d+"/.test(tag)),
    `${caseImgs.length} imagens`,
  );
  check(
    "vídeo do Forja com preload none e poster (lazy)",
    /<video[^>]+preload="none"[^>]+poster="\/video\/forja-poster\.webp"/.test(
      html,
    ) || /<video[^>]+poster="\/video\/forja-poster\.webp"[^>]+preload="none"/.test(html),
  );
  check(
    "fontes self-hosted (sem request pro Google Fonts)",
    !/fonts\.googleapis\.com/.test(html) && !/fonts\.gstatic\.com/.test(html),
  );
  check(
    "fontes servidas pelo próprio app (/_next/static/media)",
    /\/_next\/static\/media\/[^"]+\.(woff2?|ttf)/.test(html),
  );

  const cotacao = await fetch(ORIGIN + "/cotacao");
  const cotacaoHtml = await cotacao.text();
  check("/cotacao responde 200", cotacao.status === 200);
  check(
    "/cotacao tem CTA wa.me válido no HTML servido (sem JS)",
    /href="https:\/\/wa\.me\/5561995783461\?text=/.test(cotacaoHtml),
  );
  check(
    "/cotacao usa radiogroup no HTML servido (semântica da auditoria)",
    /role="radiogroup"/.test(cotacaoHtml),
  );
  check(
    "/cotacao tem chip default marcado no HTML servido (estado SSR)",
    /data-active="true"/.test(cotacaoHtml),
  );
  const waMatch = cotacaoHtml.match(
    /href="https:\/\/wa\.me\/5561995783461\?text=([^"]+)"/,
  );
  let waMsg = "";
  try {
    waMsg = waMatch ? decodeURIComponent(waMatch[1]) : "";
  } catch {
    waMsg = "";
  }
  check(
    "/cotacao: mensagem do CTA já traz a estimativa default (R$ 1.500)",
    waMsg.includes("Investimento estimado: R$ 1.500"),
  );

  const robots = await fetch(ORIGIN + "/robots.txt");
  const sitemap = await fetch(ORIGIN + "/sitemap.xml");
  check("robots.txt responde 200", robots.status === 200);
  check("sitemap.xml responde 200", sitemap.status === 200);
} finally {
  if (server) server.kill();
}

if (failures.length) {
  console.error(`\nQC reprovou: ${failures.length} checagem(ns) falharam.`);
  process.exit(1);
}
console.log("\nQC aprovado: todas as checagens passaram.");
