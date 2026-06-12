# MOTION.md - Linguagem de movimento do portfolio Zenaxis

## Conceito: Impresso vivo
O site se comporta como uma peca editorial sendo impressa diante do
visitante. Tinta, carimbo, traco de caneta, tipo movel assentando.
Movimento decisivo e curto que comunica precisao e artesanato.

## Regra mae
Nada flutua, nada pulsa, nada roda em loop infinito. Todo movimento tem
comeco, fim e proposito. Easings decisivos (expo.out, quart.out, power3),
duracoes curtas (300 a 700ms), staggers apertados (40 a 80ms). Proibido
elastic, bounce e spring exagerado.

## Vocabulario por contexto

HERO (primeiros 2 segundos):
- Kicker mono digitado caractere a caractere com caret, como maquina de
  escrever rapida, e o caret some ao terminar (nao pisca pra sempre).
- Titulo revelado linha a linha por wipe de clip-path vertical, como
  tinta sendo aplicada por rolo, com leve settle de 8px no eixo Y.
- A palavra em italico de acento ganha um sublinhado de tinta vermelha
  que se TRACA da esquerda pra direita (stroke SVG animado, textura de
  pincelada) logo apos o titulo assentar.
- CTAs e stats entram por fade + settle com stagger. Tudo termina e
  PARA. Pagina em repouso e estatica.

SCROLL (reveals de secao):
- Rotulos mono de secao (01 Servicos): o numero chega como contador
  rapido (00 ate 01) e a regua horizontal ao lado se traca na largura.
- Blocos de texto: fade + settle de 12px, stagger por elemento.
- Reguas e bordas de card se DESENHAM (border draw via stroke ou
  scaleX com transform-origin) antes do conteudo interno aparecer.

CASES:
- Imagem revelada por wipe de clip-path lateral como foto saindo da
  reveladora, com a moldura do browser se desenhando primeiro.
- Hover do card: a sombra cresce e o card sobe 4px como papel sendo
  levantado da mesa. Sem tilt 3D, sem glow.
- O card do Forja pode ter o video em autoplay mudo no hover, revelado
  pelo mesmo wipe.

MICROINTERACOES:
- Botao primario: preenchimento de tinta no hover (background desliza
  da esquerda com clip-path ou scaleX), nao mudanca seca de cor.
- Links: sublinhado que se traca no hover e se destraca na saida.
- Chips da cotacao: press de carimbo no clique (scale 0.96 por 90ms e
  volta), e o chip ativo ganha a cor como tinta aplicada por wipe.
- Preco da cotacao: rolagem de digitos estilo odometro mecanico.
- Cursor: ponto de tinta vermelho discreto que cresce sobre elementos
  interativos (so desktop com pointer fine). Sem trail, sem particula.

## Proibido (vocabulario do Forja, nao repetir)
Float/yoyo continuo, glow pulsante, particulas, tilt 3D de mockup,
pinned scroll storytelling longo, fundos com blobs animados em loop,
texto cinetico com highlight multi palavra, smooth scroll pesado estilo
Lenis. Scroll do portfolio e nativo e leve.

## Regras tecnicas
- GSAP + ScrollTrigger permitidos como FERRAMENTA (o vocabulario e que
  muda), CSS puro onde bastar.
- Somente transform, opacity e clip-path. Nada que cause layout/reflow.
- prefers-reduced-motion: tudo vira fade simples ou estado final direto.
- Modo captura ?capture=1 desde o dia um: desativa digitacao do kicker,
  odometro e cursor custom, e pula direto pros estados finais
  deterministas (mesmo padrao do Forja, pro pipeline de reels).
- Toda animacao de entrada roda UMA vez (sem replay ao rolar de volta).
- Orcamento: zero impacto perceptivel no LCP; hero anima apos o
  primeiro paint, nunca bloqueando o conteudo.