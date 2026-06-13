/* Probe: does mode (capture / reduced-motion) actually take effect on the
   client? Reads .odo-strip[data-animate] under 3 conditions and collects
   any hydration warnings. */
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = 3113;
const ORIGIN = `http://localhost:${PORT}`;
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
  { stdio: "ignore" },
);

async function probe(browser, { url, reduce, label }) {
  const ctx = await browser.newContext(
    reduce ? { reducedMotion: "reduce" } : {},
  );
  const page = await ctx.newPage();
  const warnings = [];
  page.on("console", (m) => {
    const t = m.text();
    if (/hydrat|did not match|Warning/i.test(t)) warnings.push(t.slice(0, 120));
  });
  await page.goto(ORIGIN + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const animAttrs = await page.$$eval(".odo-strip", (els) =>
    els.slice(0, 3).map((e) => e.getAttribute("data-animate")),
  );
  await ctx.close();
  console.log(
    `${label.padEnd(28)} odo data-animate=${JSON.stringify(animAttrs)}  warnings=${warnings.length}`,
  );
  if (warnings.length) console.log("   ", warnings[0]);
  return animAttrs;
}

try {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try { up = (await fetch(ORIGIN + "/cotacao")).ok; } catch { await new Promise((r) => setTimeout(r, 500)); }
  }
  if (!up) throw new Error("server down");
  const browser = await chromium.launch();
  console.log("Expectativa: normal -> true ; capture/reduced -> false\n");
  await probe(browser, { url: "/cotacao", reduce: false, label: "normal" });
  await probe(browser, { url: "/cotacao?capture=1", reduce: false, label: "capture=1" });
  await probe(browser, { url: "/cotacao", reduce: true, label: "reduced-motion" });
  await browser.close();
} finally {
  server.kill();
}
