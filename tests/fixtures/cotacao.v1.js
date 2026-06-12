/* ============================================================================
   COTAÇÃO — MOTOR COMPARTILHADO (fonte única de verdade)
   ----------------------------------------------------------------------------
   Uma cotação, duas telas, um motor. Preços, prazos, número de WhatsApp e a
   montagem da mensagem vivem SÓ aqui. Mudou aqui, mudou nas duas telas.

   Script CLÁSSICO de propósito (NÃO é ES module): funciona abrindo o .html
   direto no navegador (file://) e na Hostinger. Não use import/export.
   Carregue com <script src="cotacao.js"></script> ANTES do script inline.
============================================================================ */
(function (w) {
  "use strict";

  var COTACAO = {

    /* ----------------------------------------------------------------------
       WhatsApp — ÚNICO lugar do número agora.
       >>> TROQUE pelo seu número real (formato 55 + DDD + número). <<<
    ---------------------------------------------------------------------- */
    WA: "5561995783461",

    /* ----------------------------------------------------------------------
       Tabela de preços/prazos. Ajuste os números conforme sua precificação.
       porte = MULTIPLICADOR (médio = 1.0 baseline). prazo expresso = +30%.
    ---------------------------------------------------------------------- */
    data: {
      tipo: {
        landing:       { label: "Landing page",       price: 1500, days: 2  },
        institucional: { label: "Site institucional", price: 2800, days: 5  },
        sistema:       { label: "Sistema / Web app",  price: 6500, days: 14 }
      },
      porte: {
        enxuto:  { label: "Enxuto",  mult: 0.75, daymult: 0.7 },
        medio:   { label: "Médio",   mult: 1.0,  daymult: 1.0 }, // baseline
        robusto: { label: "Robusto", mult: 1.6,  daymult: 1.7 }
      },
      extras: {
        whatsapp:   { label: "WhatsApp integrado", price: 500,  days: 1 },
        ia:         { label: "Automação + IA",     price: 1800, days: 4 },
        crm:        { label: "CRM",                price: 2200, days: 5 },
        seo:        { label: "SEO técnico",        price: 700,  days: 2 },
        identidade: { label: "Identidade visual",  price: 900,  days: 3 }
      },
      prazo: {
        normal:   { label: "Normal",   pace: 1.0, daymult: 1.0 },
        expresso: { label: "Expresso", pace: 1.3, daymult: 0.6 }
      }
    },

    /* Formatação de moeda BRL — exposta para as duas telas reutilizarem. */
    fmt: function (n) {
      return "R$ " + Math.round(n).toLocaleString("pt-BR");
    },

    /* ----------------------------------------------------------------------
       calc(state) -> { total, days, items:[{label, price, express?}] }
       state = { tipo, porte, extras:[], prazo, contexto:{...}, nome }
       Defaults: porte ausente -> médio (1.0); prazo ausente -> normal.
       Por isso o preço do teaser (porte médio) bate com a página completa.
    ---------------------------------------------------------------------- */
    calc: function (state) {
      state = state || {};
      var d = this.data;
      var items = [];

      var tipo  = d.tipo[state.tipo]   || d.tipo.landing;
      var porte = d.porte[state.porte] || d.porte.medio;
      var prazo = d.prazo[state.prazo] || d.prazo.normal;

      // Base = tipo × porte
      var base = tipo.price * porte.mult;
      var days = tipo.days * porte.daymult;

      // Só rotula "· porte X" quando o porte foi escolhido de fato (página completa).
      var baseLabel = tipo.label;
      if (state.porte && d.porte[state.porte]) {
        baseLabel += " · porte " + porte.label.toLowerCase();
      }
      items.push({ label: baseLabel, price: base });

      // Extras (valor fixo + prazo somado)
      var extras = state.extras || [];
      for (var i = 0; i < extras.length; i++) {
        var e = d.extras[extras[i]];
        if (!e) continue;
        base += e.price;
        days += e.days;
        items.push({ label: e.label, price: e.price });
      }

      // Prazo: expresso aplica +30% no total e reduz o prazo
      var total = base;
      if (prazo.pace > 1) {
        var acrescimo = base * (prazo.pace - 1);
        total = base + acrescimo;
        items.push({ label: "Entrega expressa (+30%)", price: acrescimo, express: true });
      }
      days = days * prazo.daymult;
      days = Math.max(2, Math.ceil(days));

      return { total: total, days: days, items: items };
    },

    /* ----------------------------------------------------------------------
       buildMessage(state, total, days) -> URL https://wa.me/... completa
       Inclui nome, tipo+porte, extras, prazo, respostas de contexto, valor
       e prazo. Robusto a estados parciais (teaser não tem porte/prazo/contexto).
    ---------------------------------------------------------------------- */
    buildMessage: function (state, total, days) {
      state = state || {};
      var d = this.data;
      var L = [];

      L.push("Olá! Montei meu orçamento no site da Zenaxis:");
      L.push("");

      if (state.nome) L.push("Nome: " + state.nome);

      var tipo = d.tipo[state.tipo];
      var proj = tipo ? tipo.label : "—";
      if (state.porte && d.porte[state.porte]) {
        proj += " (porte " + d.porte[state.porte].label.toLowerCase() + ")";
      }
      L.push("Projeto: " + proj);

      var ex = [];
      var extras = state.extras || [];
      for (var i = 0; i < extras.length; i++) {
        if (d.extras[extras[i]]) ex.push(d.extras[extras[i]].label);
      }
      L.push("Extras: " + (ex.length ? ex.join(", ") : "nenhum"));

      if (state.prazo && d.prazo[state.prazo]) {
        L.push("Prazo: " + d.prazo[state.prazo].label);
      }

      var ctx = state.contexto || {};
      if (ctx.identidade) L.push("Já tenho identidade visual: " + ctx.identidade);
      if (ctx.conteudo)   L.push("Já tenho o conteúdo (textos/fotos): " + ctx.conteudo);

      L.push("");
      L.push("Investimento estimado: " + this.fmt(total) + " (a partir de)");
      L.push("Prazo aproximado: " + days + (days === 1 ? " dia útil" : " dias úteis"));
      L.push("");
      L.push("Gostaria de receber a proposta.");

      return "https://wa.me/" + this.WA + "?text=" + encodeURIComponent(L.join("\n"));
    },

    /* Link de WhatsApp genérico (CTAs sem cotação, ex.: "Começar agora"). */
    waLink: function (text) {
      return "https://wa.me/" + this.WA + "?text=" + encodeURIComponent(text || "");
    }
  };

  w.COTACAO = COTACAO;
})(window);
