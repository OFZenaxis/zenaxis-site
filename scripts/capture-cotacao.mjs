/* ============================================================================
   Screenshots da cotação (Fase C):
   - desktop default, desktop pré-preenchido, mobile 390 (com barra fixa),
     e ?capture=1 (estados finais diretos).
   Uso: npm run build && node scripts/capture-cotacao.mjs
============================================================================ */
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 3112;
const ORIGIN = `http://localhost:${PORT}`;
const OUT = "qc-shots";

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
  { stdio: "ignore" },
);

try {
  await mkdir(OUT, { recursive: true });
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

  /* Desktop default */
  const d1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await d1.goto(ORIGIN + "/cotacao", { waitUntil: "networkidle" });
  await d1.waitForTimeout(900);
  await d1.screenshot({ path: `${OUT}/cotacao-desktop-default.png`, fullPage: true });

  /* Desktop pré-preenchido (estado rico: sistema robusto + 3 extras + expresso) */
  const d2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await d2.goto(
    ORIGIN + "/cotacao?tipo=sistema&porte=robusto&extras=ia,crm,seo&prazo=expresso",
    { waitUntil: "networkidle" },
  );
  await d2.waitForTimeout(1100);
  await d2.screenshot({ path: `${OUT}/cotacao-desktop-prefilled.png`, fullPage: true });

  /* Mobile 390 com a barra fixa visível (viewport, não fullpage) */
  const m = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await m.goto(ORIGIN + "/cotacao?tipo=institucional&extras=whatsapp,seo", {
    waitUntil: "networkidle",
  });
  await m.waitForTimeout(900);
  /* rola um pouco pra mostrar chips + barra fixa ancorada embaixo */
  await m.evaluate(() => window.scrollTo(0, 320));
  await m.waitForTimeout(500);
  await m.screenshot({ path: `${OUT}/cotacao-mobile-bar.png` });
  await m.screenshot({ path: `${OUT}/cotacao-mobile-full.png`, fullPage: true });

  /* ?capture=1: estados finais diretos */
  const cap = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await cap.goto(ORIGIN + "/cotacao?capture=1&tipo=sistema&porte=robusto&extras=ia,crm&prazo=expresso", {
    waitUntil: "networkidle",
  });
  await cap.waitForTimeout(500);
  await cap.screenshot({ path: `${OUT}/cotacao-capture1.png`, fullPage: true });

  await browser.close();
  console.log(`Capturas salvas em ${OUT}/`);
} finally {
  server.kill();
}
