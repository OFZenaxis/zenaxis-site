/* ============================================================================
   CONTATO — fonte única do WhatsApp e helpers de link wa.me.
   Os CTAs renderizam href real no servidor (sem depender de JS). O JS pode
   ENRIQUECER a mensagem depois, mas nunca é responsável por criar o link.
============================================================================ */

/** Número no formato internacional 55 + DDD + número (sem símbolos). */
export const WHATSAPP = "5561995783461";

export const INSTAGRAM_HANDLE = "@agenciazenaxis";
export const INSTAGRAM_URL = "https://instagram.com/agenciazenaxis";

/** TODO: confirmar o endereço real antes de divulgar. */
export const EMAIL = "contato@zenaxis.com.br";
export const EMAIL_URL = `mailto:${EMAIL}`;

/** Monta a URL wa.me com a mensagem já codificada. */
export function waUrl(message: string): string {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);
}

/** Link de WhatsApp genérico (CTAs sem cotação, ex.: "Começar agora"). */
export function waLink(
  text = "Olá! Vi seu portfólio e quero conversar sobre um projeto.",
): string {
  return waUrl(text);
}
