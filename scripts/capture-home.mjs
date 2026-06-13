/* ============================================================================
   Captura e auditoria de peso do home (Fase B2).
   - Peso transferido do / (desktop), por tipo, SEM hover no vídeo.
   - Confirma que o vídeo do Forja NÃO é requisitado no load nem no scroll.
   - Screenshots: full 1920, full 390, card do Forja com vídeo no hover,
     e ?capture=1 (estados finais diretos).
   Uso: npm run build && node scripts/capture-home.mjs
============================================================================ */
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const PORT = 3109;
const ORIGIN = `http://localhost:${PORT}`;
const OUT = "qc-shots";

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
  { stdio: "ignore" },
);

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 900));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

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

  /* ---- Desktop 1920: peso + reveals + fullpage ---- */
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  /* Bytes reais no fio (pós gzip) via CDP: encodedDataLength. */
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  const requests = new Map();
  const transfers = [];
  cdp.on("Network.responseReceived", (e) => {
    requests.set(e.requestId, e.response.url);
  });
  cdp.on("Network.loadingFinished", (e) => {
    const url = requests.get(e.requestId);
    if (url) transfers.push({ url, bytes: e.encodedDataLength });
  });

  await page.goto(ORIGIN + "/", { waitUntil: "load" });
  await page.waitForTimeout(2000); /* hero termina */
  await scrollThrough(page); /* dispara todos os reveals */
  await page.waitForTimeout(800);

  const videoHit = transfers.find((t) => t.url.includes("forja-wide.mp4"));
  const total = transfers.reduce((s, t) => s + t.bytes, 0);
  const byType = {};
  for (const t of transfers) {
    const path = new URL(t.url).pathname;
    const kind = path.endsWith(".css")
      ? "css"
      : /\.(js|mjs)$/.test(path)
        ? "js"
        : /\.(woff2?|ttf)$/.test(path)
          ? "fonte"
          : /\.(png|jpg|webp|avif|svg|ico)$/.test(path) || path.includes("/_next/image")
            ? "imagem"
            : path.includes(".mp4")
              ? "video"
              : "html/outros";
    byType[kind] = (byType[kind] ?? 0) + t.bytes;
  }
  console.log("\n=== PESO DO HOME (desktop, load + scroll completo) ===");
  for (const [kind, bytes] of Object.entries(byType).sort((a, b) => b[1] - a[1]))
    console.log(`${kind.padEnd(12)} ${(bytes / 1024).toFixed(1)} KB`);
  console.log(`TOTAL        ${(total / 1024).toFixed(1)} KB`);
  console.log(
    videoHit
      ? `FALHA: vídeo foi baixado sem hover (${(videoHit.bytes / 1024).toFixed(0)} KB)`
      : "OK: vídeo do Forja NÃO foi requisitado (lazy de verdade)",
  );

  await page.screenshot({ path: `${OUT}/home-desktop-1920-full.png`, fullPage: true });

  /* ---- Card do Forja com vídeo rodando no hover ---- */
  const forja = page.locator('[data-case][href*="treinolandpage"]');
  await forja.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200); /* reveal do card */
  await forja.hover();
  await page.waitForTimeout(1800); /* vídeo carrega e roda */
  await forja.screenshot({ path: `${OUT}/forja-card-hover.png` });
  const playing = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v && !v.paused && v.currentTime > 0;
  });
  console.log(playing ? "OK: vídeo rodando no hover" : "FALHA: vídeo não deu play no hover");

  /* ---- Mobile 390 ---- */
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await mobile.goto(ORIGIN + "/", { waitUntil: "load" });
  await mobile.waitForTimeout(2000);
  await scrollThrough(mobile);
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: `${OUT}/home-mobile-390-full.png`, fullPage: true });

  /* ---- ?capture=1: estados finais diretos, sem rolar ---- */
  const cap = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await cap.goto(ORIGIN + "/?capture=1", { waitUntil: "load" });
  await cap.waitForTimeout(500);
  await cap.screenshot({ path: `${OUT}/home-capture1-full.png`, fullPage: true });

  await browser.close();
  console.log(`\nCapturas salvas em ${OUT}/`);
} finally {
  server.kill();
}
