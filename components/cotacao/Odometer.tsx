"use client";

/* ============================================================================
   ODÔMETRO MECÂNICO (motion.md, microinterações): o preço rola dígito a
   dígito como um contador mecânico. Cada algarismo é uma coluna 0-9 que
   desliza por translateY; separadores ("R$", ".", espaço) ficam fixos.

   - SSR: cada coluna já sai com o transform inline do dígito certo, então
     o valor é legível mesmo sem JS (e sem flash ao hidratar).
   - static (capture / prefers-reduced-motion): sem transição, vai direto.
   - Acessibilidade: o número real fica no aria-label; as colunas que
     rolam são aria-hidden. (O anúncio ao vivo pra leitores de tela é feito
     por um status à parte no Configurator.)
============================================================================ */
import { fmt } from "@/lib/pricing";
import { useMotion } from "@/lib/motion";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const NBSP = " ";

function DigitColumn({ digit, animate }: { digit: number; animate: boolean }) {
  return (
    <span className="odo-col" aria-hidden="true">
      <span
        className="odo-strip"
        data-animate={animate ? "true" : "false"}
        style={{ transform: `translateY(${-digit * 10}%)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="odo-digit">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Odometer({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const { mode } = useMotion();
  const text = fmt(value); // "R$ 1.500" — mesma formatação do motor
  const animate = mode !== "static";
  const chars = text.split("");

  /* Chave pela posição A PARTIR DA DIREITA: quando o preço ganha um dígito
     (9.999 -> 10.000), as casas existentes mantêm a identidade e rolam de
     verdade; só o novo dígito à esquerda entra. Chavear pela esquerda
     remontava as colunas e quebrava o rolo mecânico. */
  return (
    <span className={`odo ${className ?? ""}`} aria-label={text}>
      {chars.map((ch, i) => {
        const key = chars.length - 1 - i;
        return /\d/.test(ch) ? (
          <DigitColumn key={key} digit={Number(ch)} animate={animate} />
        ) : (
          <span key={key} aria-hidden="true">
            {ch === " " ? NBSP : ch}
          </span>
        );
      })}
    </span>
  );
}
