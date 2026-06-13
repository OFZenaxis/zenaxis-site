/* ============================================================================
   Lighthouse das duas páginas (/ e /cotacao), desktop + mobile, 4 categorias.

   Uso local (build de produção):  npm run build && node scripts/lighthouse.mjs
   Uso staging (URL real):         node scripts/lighthouse.mjs https://xxxx.hstgr.cloud

   Requer Chrome/Chromium. Usa o Chromium do Playwright via CHROME_PATH se o
   Chrome do sistema não for encontrado. Roda lighthouse via npx (sem novo
   devDependency).
============================================================================ */
import { spawn, spawnSync } from "node:child_process";
import { chromium } from "playwright";

const BASE = (process.argv[2] || "").replace(/\/$/, "");
const PORT = 3107;
const ORIGIN = BASE || `http://localhost:${PORT}`;
const PATHS = ["/", "/cotacao"];
const FORMS = ["desktop", "mobile"];

if (!process.env.CHROME_PATH) {
  try {
    process.env.CHROME_PATH = chromium.executablePath();
  } catch {
    /* usa o Chrome do sistema */
  }
}

const server = BASE
  ? null
  : spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
      { stdio: "ignore" },
    );

function runLH(url, form) {
  const args = [
    "--yes",
    "lighthouse",
    url,
    "--quiet",
    "--output=json",
    "--output-path=stdout",
    "--chrome-flags=--headless=new --no-sandbox",
    "--only-categories=performance,accessibility,best-practices,seo",
  ];
  if (form === "desktop") args.push("--preset=desktop");
  const r = spawnSync("npx", args, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    shell: process.platform === "win32",
  });
  if (r.status !== 0 && !r.stdout) {
    throw new Error((r.stderr || "lighthouse falhou").slice(0, 400));
  }
  const json = JSON.parse(r.stdout);
  const c = json.categories;
  const a = json.audits;
  const pct = (x) => (x == null ? "-" : Math.round(x.score * 100));
  return {
    perf: pct(c.performance),
    a11y: pct(c.accessibility),
    bp: pct(c["best-practices"]),
    seo: pct(c.seo),
    fcp: a["first-contentful-paint"]?.displayValue ?? "-",
    lcp: a["largest-contentful-paint"]?.displayValue ?? "-",
    tbt: a["total-blocking-time"]?.displayValue ?? "-",
    cls: a["cumulative-layout-shift"]?.displayValue ?? "-",
  };
}

try {
  if (!BASE) {
    let up = false;
    for (let i = 0; i < 60 && !up; i++) {
      try {
        up = (await fetch(ORIGIN + "/")).ok;
      } catch {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    if (!up) throw new Error("Servidor local não subiu");
  }

  console.log(`Lighthouse alvo: ${ORIGIN}\n`);
  console.log(
    "página".padEnd(10) +
      "form".padEnd(9) +
      "Perf  A11y  BP   SEO   | FCP / LCP / TBT / CLS",
  );
  console.log("-".repeat(74));
  for (const p of PATHS) {
    for (const f of FORMS) {
      try {
        const s = runLH(ORIGIN + p, f);
        console.log(
          (p === "/" ? "home" : "cotação").padEnd(10) +
            f.padEnd(9) +
            `${String(s.perf).padEnd(6)}${String(s.a11y).padEnd(6)}${String(s.bp).padEnd(5)}${String(s.seo).padEnd(6)}| ${s.fcp} / ${s.lcp} / ${s.tbt} / ${s.cls}`,
        );
      } catch (e) {
        console.log(`${p} ${f}: ERRO — ${e.message}`);
      }
    }
  }
} finally {
  if (server) server.kill();
}
