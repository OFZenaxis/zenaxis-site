/* ============================================================================
   Captura de validação do hero (Fase B1).
   Desktop 1440x900: frames em 0/400/900/1600ms após o load (timeline de
   entrada) + estado final + ?capture=1 (deve ser igual ao final).
   Mobile 390x844: estado final.
   Uso: npm run build && node scripts/capture-hero.mjs
============================================================================ */
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 3108;
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
      up = (await fetch(ORIGIN + "/")).ok;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!up) throw new Error("Servidor não subiu");

  const browser = await chromium.launch();

  /* Desktop: frames da entrada. */
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(ORIGIN + "/", { waitUntil: "load" });
  const t0 = Date.now();
  for (const ms of [0, 400, 900, 1600]) {
    const wait = ms - (Date.now() - t0);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    await desktop.screenshot({ path: `${OUT}/hero-desktop-${ms}ms.png` });
    console.log(`frame ${ms}ms capturado (real: ${Date.now() - t0}ms)`);
  }
  await new Promise((r) => setTimeout(r, 1200));
  await desktop.screenshot({ path: `${OUT}/hero-desktop-final.png` });

  /* Desktop ?capture=1: deve renderizar direto no estado final. */
  const cap = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await cap.goto(ORIGIN + "/?capture=1", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 400));
  await cap.screenshot({ path: `${OUT}/hero-desktop-capture1.png` });

  /* Mobile 390: estado final. */
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto(ORIGIN + "/", { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 2500));
  await mobile.screenshot({ path: `${OUT}/hero-mobile-final.png` });

  await browser.close();
  console.log(`Capturas salvas em ${OUT}/`);
} finally {
  server.kill();
}
