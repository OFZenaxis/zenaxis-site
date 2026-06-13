/* ============================================================================
   Teste de fluxo da cotação interativa (Fase C) com Playwright.
   - Abre /cotacao?tipo=sistema&extras=ia,crm e confere chips pré-marcados.
   - Confere que o total exibido bate com o MOTOR (calc importado de lib).
   - Clica porte robusto + prazo expresso e reconfere total + href do CTA.
   Uso: npm run build && node scripts/flow-cotacao.mjs
============================================================================ */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

/* Compara o UI contra o MOTOR. Carrega o cotacao.js v1 (fixture, JS puro)
   que os testes unitários provam idêntico ao lib/pricing.ts — evita resolver
   .ts no Node e mantém a comparação contra a fonte da verdade. */
function loadEngine() {
  const src = readFileSync(
    join(import.meta.dirname, "../tests/fixtures/cotacao.v1.js"),
    "utf8",
  );
  const w = {};
  new Function("window", src)(w);
  return w.COTACAO;
}
const engine = loadEngine();
const calc = (s) => engine.calc(s);
const fmt = (n) => engine.fmt(n);
const buildMessage = (s, t, d) => engine.buildMessage(s, t, d);

const PORT = 3111;
const ORIGIN = `http://localhost:${PORT}`;
const failures = [];
const ok = (name, cond, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? `  (${extra})` : ""}`);
  if (!cond) failures.push(name);
};

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
  { stdio: "ignore" },
);

try {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try {
      up = (await fetch(ORIGIN + "/cotacao")).ok;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!up) throw new Error("Servidor não subiu");

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(ORIGIN + "/cotacao?tipo=sistema&extras=ia,crm", {
    waitUntil: "networkidle",
  });
  /* Espera DETERMINISTA do pré-preenchimento pós-hidratação (em vez de um
     sleep fixo): o total deixa de ser o default 1500. Mede o tempo. */
  const t0 = Date.now();
  await page.waitForFunction(
    () => document.querySelector("[data-total]")?.getAttribute("data-total") !== "1500",
    undefined,
    { timeout: 8000 },
  );
  console.log(`(pré-preenchimento aplicado em ~${Date.now() - t0}ms)`);

  /* 1. Chips pré-marcados pela URL. */
  const activeChip = async (name, label) =>
    page
      .locator(`label.chip[data-active="true"]:has(input[name="${name}"])`)
      .filter({ hasText: label })
      .count();

  ok("chip tipo=Sistema / Web app pré-marcado", (await activeChip("tipo", "Sistema")) === 1);
  ok("chip extra=Automação + IA pré-marcado", (await activeChip("extras", "Automação + IA")) === 1);
  ok("chip extra=CRM pré-marcado", (await activeChip("extras", "CRM")) === 1);
  ok("porte default Médio pré-marcado", (await activeChip("porte", "Médio")) === 1);

  /* 2. Total exibido bate com o motor pra {sistema, extras:[ia,crm]}. */
  const expected1 = calc({ tipo: "sistema", extras: ["ia", "crm"] });
  const total1 = await page.locator("[data-total]").first().getAttribute("data-total");
  const days1 = await page.locator("[data-total]").first().getAttribute("data-days");
  ok(
    "total exibido = motor (sistema + ia + crm)",
    Number(total1) === expected1.total,
    `exibido ${total1} vs motor ${expected1.total}`,
  );
  ok("dias exibido = motor", Number(days1) === expected1.days, `${days1} vs ${expected1.days}`);

  /* 3. Clica porte robusto + prazo expresso. */
  await page.locator(`label.chip:has(input[name="porte"])`).filter({ hasText: "Robusto" }).click();
  await page.locator(`label.chip:has(input[name="prazo"])`).filter({ hasText: "Expresso" }).click();
  await page.waitForTimeout(400);

  const expected2 = calc({
    tipo: "sistema",
    porte: "robusto",
    extras: ["ia", "crm"],
    prazo: "expresso",
  });
  const total2 = await page.locator("[data-total]").first().getAttribute("data-total");
  ok(
    "total após robusto+expresso = motor",
    Number(total2) === expected2.total,
    `exibido ${total2} vs motor ${expected2.total}`,
  );

  /* 4. href do CTA traz a mensagem atualizada (valor novo). */
  const href = await page.locator("#waCta").getAttribute("href");
  const decoded = decodeURIComponent(href.split("?text=")[1] ?? "");
  ok(
    "href do CTA contém o investimento atualizado",
    decoded.includes("Investimento estimado: " + fmt(expected2.total)),
    fmt(expected2.total),
  );
  ok(
    "href do CTA contém porte robusto e prazo expresso",
    decoded.includes("porte robusto") && decoded.includes("Prazo: Expresso"),
  );

  /* 5. URL reflete o estado (compartilhável). */
  const url = page.url();
  ok(
    "URL reflete porte=robusto e prazo=expresso",
    url.includes("porte=robusto") && url.includes("prazo=expresso"),
    url.replace(ORIGIN, ""),
  );

  /* 6. Sanidade: a mensagem do CTA é idêntica à do motor. */
  const engineHref = buildMessage(
    {
      tipo: "sistema",
      porte: "robusto",
      extras: ["ia", "crm"],
      prazo: "expresso",
      contexto: { identidade: null, conteudo: null },
    },
    expected2.total,
    expected2.days,
  );
  ok("href do CTA idêntico ao buildMessage do motor", href === engineHref);

  await browser.close();
} finally {
  server.kill();
}

if (failures.length) {
  console.error(`\nFluxo reprovou: ${failures.length} checagem(ns).`);
  process.exit(1);
}
console.log("\nFluxo da cotação aprovado.");
