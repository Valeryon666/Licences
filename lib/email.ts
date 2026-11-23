import "server-only";

// Envoi d'emails via Resend, sans dépendance. Tant que RESEND_API_KEY et EMAIL_FROM
// ne sont pas réglées, les emails sont seulement écrits dans les journaux Vercel.

type Email = { a: string; sujet: string; texte: string; repondreA?: string };

export async function envoyerEmail({ a, sujet, texte, repondreA }: Email): Promise<boolean> {
  const cle = process.env.RESEND_API_KEY;
  const de = process.env.EMAIL_FROM;
  if (!cle || !de) {
    console.info(`[email non envoyé — Resend non configuré] à ${a} : ${sujet}`);
    return false;
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: de, to: [a], subject: sujet, text: texte, reply_to: repondreA }),
    });
    if (!r.ok) console.error(`Resend a refusé l'email « ${sujet} »`, r.status, await r.text());
    return r.ok;
  } catch (e) {
    console.error(`Envoi impossible de l'email « ${sujet} »`, e);
    return false;
  }
}

export function emailProprietaire(): string | null {
  return process.env.OWNER_EMAIL || null;
}
