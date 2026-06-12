import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/* OG image 1200x630 gerada na identidade da marca (auditoria, item CRÍTICO:
   sem og:image todo link compartilhado no WhatsApp sai sem capa). */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Zenaxis: sites, automação e IA sob medida";

const TOKENS = {
  paper: "#f4efe4",
  ink: "#16130d",
  inkSoft: "#46402f",
  accent: "#e8400f",
  line: "#d8d0bf",
};

export default async function Image() {
  const [fraunces, hanken] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/fraunces-600.ttf")),
    readFile(join(process.cwd(), "assets/fonts/hanken-500.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: TOKENS.paper,
          color: TOKENS.ink,
          padding: "72px 80px",
          fontFamily: "Hanken",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `2px solid ${TOKENS.line}`,
            paddingBottom: 28,
            fontSize: 26,
            color: TOKENS.inkSoft,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span>Sites · Automação · IA</span>
          <span>zenaxis.com.br</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 148,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            <span>Zenaxis</span>
            <span style={{ color: TOKENS.accent }}>.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 38,
              color: TOKENS.inkSoft,
              maxWidth: 820,
              lineHeight: 1.3,
            }}
          >
            Sites e soluções digitais que dão resultado
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 120,
              height: 10,
              background: TOKENS.accent,
              borderRadius: 5,
            }}
          />
          <span style={{ fontSize: 24, color: TOKENS.inkSoft }}>
            Presença online que gera cliente
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Hanken", data: hanken, weight: 500, style: "normal" },
      ],
    },
  );
}
