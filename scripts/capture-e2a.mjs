/* Screenshots da E2a (presença + profundidade). */
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 3114;
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
    try { up = (await fetch(ORIGIN + "/").then((r) => r.ok)); } catch { await new Promise((r) => setTimeout(r, 500)); }
  }
  if (!up) throw new Error("server down");
  const browser = await chromium.launch();

  /* 1. Hero desktop 1920 (viewport, conserto principal) */
  const d = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await d.goto(ORIGIN + "/", { waitUntil: "load" });
  await d.waitForTimeout(2200);
  await d.screenshot({ path: `${OUT}/e2a-hero-desktop.png` });

  /* 2. Diagnóstico desktop com painel sticky pinado (rola até as perguntas) */
  await d.evaluate(() => {
    const el = document.querySelector("#diagnostico");
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + 520);
  });
  await d.waitForTimeout(900);
  await d.screenshot({ path: `${OUT}/e2a-diagnostico-sticky.png` });

  /* 3. Detalhe de sombra: card do Forja com folga ao redor (mostra o ambiente) */
  await d.evaluate(() => {
    const el = document.querySelector('[data-case]');
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 160);
  });
  await d.waitForTimeout(700);
  const box = await d.locator("[data-case]").boundingBox();
  if (box) {
    const pad = 60;
    await d.screenshot({
      path: `${OUT}/e2a-forja-shadow.png`,
      clip: {
        x: Math.max(0, box.x - pad),
        y: Math.max(0, box.y - pad),
        width: Math.min(1920, box.width + pad * 2),
        height: box.height + pad * 2,
      },
    });
  }

  /* 4. Hero mobile 390 */
  const m = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await m.goto(ORIGIN + "/", { waitUntil: "load" });
  await m.waitForTimeout(2200);
  await m.screenshot({ path: `${OUT}/e2a-hero-mobile.png` });

  await browser.close();
  console.log("ok");
} finally {
  server.kill();
}
