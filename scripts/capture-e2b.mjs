/* ============================================================================
   Capturas da E2b (TIMING e sensação, não só estado final).
   - Hero: frames em 0/500/1000/1700/2300ms (traçado do sublinhado DEPOIS
     do título).
   - Hero mobile 390 final (sublinhado/traçado sem quebra).
   - Tensão: frames do desvelar progressivo (parágrafos + frase martelo).
   - ?capture=1 home inteira (tudo em estado final instantâneo).
   Uso: npm run build && node scripts/capture-e2b.mjs
============================================================================ */
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 3116;
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
    try { up = await fetch(ORIGIN + "/").then((r) => r.ok); } catch { await new Promise((r) => setTimeout(r, 500)); }
  }
  if (!up) throw new Error("server down");
  const browser = await chromium.launch();

  /* ---- Hero: 4+ frames da entrada ---- */
  const hero = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await hero.goto(ORIGIN + "/", { waitUntil: "load" });
  const t0 = Date.now();
  for (const ms of [0, 500, 1000, 1700, 2300]) {
    const wait = ms - (Date.now() - t0);
    if (wait > 0) await hero.waitForTimeout(wait);
    await hero.screenshot({ path: `${OUT}/e2b-hero-${ms}ms.png` });
  }
  await hero.close();

  /* ---- Tensão: desvelar progressivo ---- */
  const ten = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await ten.goto(ORIGIN + "/", { waitUntil: "load" });
  await ten.waitForTimeout(2300); // deixa o hero terminar
  // posiciona a Tensão pra disparar o reveal (top ~78% do viewport)
  await ten.evaluate(() => {
    const s = document.querySelectorAll("section")[1]; // Tensão é a 2ª section
    if (s) window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.5);
  });
  const t1 = Date.now();
  for (const ms of [120, 450, 850]) {
    const wait = ms - (Date.now() - t1);
    if (wait > 0) await ten.waitForTimeout(wait);
    await ten.screenshot({ path: `${OUT}/e2b-tension-${ms}ms.png` });
  }
  // e o golpe: rola pra trazer a frase martelo ao gatilho
  await ten.evaluate(() => {
    const bq = document.querySelector("[data-hammer]");
    if (bq) window.scrollTo(0, bq.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.8);
  });
  await ten.waitForTimeout(300);
  await ten.screenshot({ path: `${OUT}/e2b-tension-hammer.png` });
  await ten.close();

  /* ---- ?capture=1: home inteira em estado final ---- */
  const cap = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await cap.goto(ORIGIN + "/?capture=1", { waitUntil: "load" });
  await cap.waitForTimeout(600);
  await cap.screenshot({ path: `${OUT}/e2b-capture1-full.png`, fullPage: true });
  // e o hero em capture pra provar o sublinhado já traçado
  await cap.screenshot({ path: `${OUT}/e2b-capture1-hero.png` });
  await cap.close();

  /* ---- Hero mobile 390 final ---- */
  const m = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await m.goto(ORIGIN + "/", { waitUntil: "load" });
  await m.waitForTimeout(2600);
  await m.screenshot({ path: `${OUT}/e2b-hero-mobile.png` });
  await m.close();

  await browser.close();
  console.log("ok");
} finally {
  server.kill();
}
