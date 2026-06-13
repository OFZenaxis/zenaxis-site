# CUTOVER — apontar zenaxis.com.br para o site novo (Next.js)

Documento de virada. **Não executa nada** — é o passo a passo para você
fazer no hPanel da Hostinger (plano Business) com rollback garantido.

Regra de ouro: **não delete o site antigo**. O rollback depende dele
intacto. A virada é só "para onde o domínio aponta", reversível em minutos.

---

## 0. Pré-requisitos (confirmar antes de virar)

- [ ] App Node.js novo já no ar e validado na URL temporária da Hostinger
      (`*.hstgr.cloud` ou subdomínio de staging). Rode os QCs abaixo
      apontando pra essa URL **antes** de tocar no domínio:
  ```bash
  QC_URL=https://SUA-URL-DE-STAGING node scripts/qc.mjs
  node scripts/lighthouse.mjs https://SUA-URL-DE-STAGING
  ```
- [ ] Node 20+ selecionado no app. Build: `npm install && npm run build`.
      Start: `npm start` (o Next respeita a env `PORT` da Hostinger; não
      fixe porta no código).
- [ ] `metadataBase` = `https://zenaxis.com.br` (já no código). O canonical
      e a og:image apontam pro domínio final de propósito — isso fica certo
      assim que o domínio passar a servir o app.

---

## 1. Preservar rollback (fazer ANTES da virada)

Objetivo: o site antigo continua existindo e acessível, pronto pra voltar.

1. **Snapshot/backup** em hPanel → *Arquivos* → *Backups* (ou *Snapshots*):
   gere um backup manual do site atual. Anote a data.
2. **Mantenha o site antigo servível num endereço alternativo** para poder
   comparar e reverter sem restaurar nada:
   - Crie um subdomínio de segurança, ex. `legado.zenaxis.com.br`, apontando
     pra pasta/website atual do site estático (`index.html`,
     `zenaxis-cotacao.html`, `cotacao.js`, imagens).
   - Confirme que `https://legado.zenaxis.com.br` abre o site antigo. Esse é
     o seu botão de pânico.
3. **Não** remova os arquivos do site antigo nem o website/entrada dele no
   hPanel. Rollback = repontar o domínio de volta pra ele.

---

## 2. A virada (apontar zenaxis.com.br pro app novo)

O caminho exato depende de como o app Node foi criado no painel. Os dois
cenários comuns na Hostinger Business:

### Cenário A — o app Node já está "dentro" do domínio zenaxis.com.br
(app criado sob o próprio domínio, servindo hoje em staging/subpasta)
1. hPanel → *Websites* → `zenaxis.com.br` → seção *Node.js*.
2. Aponte o **Application root** pra pasta do projeto novo e o
   **Application startup file**/comando pra `npm start` (Next standalone).
3. Garanta o build feito (`npm run build`) e reinicie o app (*Restart*).
4. O domínio raiz passa a ser servido pelo app. Pule pro passo 3 (SSL).

### Cenário B — o app novo está num website/URL separado
(ex.: foi criado como aplicação própria com URL `*.hstgr.cloud`)
1. hPanel → *Websites* → abra o **app novo** → *Domínios* / *Gerenciar
   domínio*.
2. **Adicione `zenaxis.com.br` como domínio primário do app novo.** A
   Hostinger vai pedir pra liberar o domínio do website antigo primeiro —
   é aqui que o subdomínio `legado.` do passo 1 garante que o antigo
   continua acessível.
3. Se o domínio e a hospedagem estão na própria Hostinger (mesmos
   nameservers `ns1/ns2.dns-parking.com`), a troca é interna: a Hostinger
   re-roteia o domínio pro app sem mudar DNS externo. Propaga em minutos.
4. Se o DNS é gerenciado fora (Cloudflare, Registro.br apontando pra IP),
   atualize o registro **A**/**CNAME** do app conforme a Hostinger indicar
   no painel do app (campo "apontar domínio").

> Antes de confirmar, tire um print da config atual (document root / app
> bindings) — é a referência pra reverter.

---

## 3. SSL (HTTPS) após a virada

- Assim que `zenaxis.com.br` passar a apontar pro app, emita/renove o
  certificado: hPanel → *Segurança* → *SSL* → instalar Let's Encrypt para
  `zenaxis.com.br` (e `www` se usar).
- Ative *Forçar HTTPS* (redirect 301 http→https).
- Emissão costuma levar de **poucos minutos até ~1 hora**. Enquanto não
  emite, o navegador pode mostrar aviso de certificado — normal na janela
  de transição.

---

## 4. Verificação imediata pós-switch (rodar logo após virar)

```bash
# 5 rotas + og:image + fontes self-hosted + radiogroup + CTA wa.me sem JS
QC_URL=https://zenaxis.com.br node scripts/qc.mjs
# Lighthouse real no domínio final
node scripts/lighthouse.mjs https://zenaxis.com.br
```

Checklist manual:
- [ ] `https://zenaxis.com.br/` → 200, hero aparece, sem aviso de SSL.
- [ ] `/cotacao` interativa (chips, preço rola, CTA WhatsApp abre).
- [ ] `/robots.txt` e `/sitemap.xml` → 200, com `zenaxis.com.br`.
- [ ] `/opengraph-image` → 200, PNG 1200x630.
- [ ] CTAs de WhatsApp abrem `wa.me/5561995783461` com a mensagem.
- [ ] Footer: Instagram, WhatsApp e e-mail clicáveis.
- [ ] **Preview de link no WhatsApp**: mande `https://zenaxis.com.br` num
      chat de teste. Se vier sem capa (cache antigo do 404), force o
      recache no Facebook Sharing Debugger
      (`developers.facebook.com/tools/debug/` → *Scrape Again*); o WhatsApp
      usa esse cache. Rescrape também após qualquer ajuste de og.
- [ ] Redirers de URLs antigas: o site antigo tinha `/zenaxis-cotacao.html`.
      Se houver links/indexação apontando pra lá, considere um redirect
      301 → `/cotacao` (posso adicionar no `next.config` se quiser).

---

## 5. Rollback (se algo der errado)

1. Repontar o domínio de volta pro site antigo: desfaça o passo 2
   (no Cenário B, remova `zenaxis.com.br` do app novo e re-associe ao
   website antigo; no Cenário A, volte o application root anterior).
2. Como o site antigo segue intacto (e acessível em `legado.`), a volta é
   imediata — minutos, mais o tempo de propagação se houve mudança de DNS.
3. Reemita o SSL pro domínio no destino antigo se necessário.

---

## 6. Janela de propagação (expectativa)

| Situação | Tempo típico |
|---|---|
| Domínio + hospedagem na Hostinger, troca interna (mesmos nameservers) | minutos a ~1 h |
| Mudança de registro A/CNAME no DNS | 5 min a algumas horas (TTL) |
| Mudança de nameservers | até 24–48 h |
| Emissão de SSL Let's Encrypt | minutos a ~1 h |

Dica: baixe o **TTL** do registro DNS pra 300 s **um dia antes** da virada
pra acelerar a propagação e o eventual rollback.

---

## 7. Pós-estabilização (primeiros dias)

- [ ] Reenviar o `sitemap.xml` no Google Search Console pro domínio.
- [ ] Conferir indexação do canonical correto (`zenaxis.com.br`, sem mais
      `SEU-DOMINIO`).
- [ ] Confirmar que o e-mail `contato@zenaxis.com.br` (no footer/JSON-LD)
      existe de fato — hoje é um endereço declarado, ainda a validar.
- [ ] Só depois de alguns dias estável, decidir se arquiva o site antigo.
      Não há pressa em deletar.
