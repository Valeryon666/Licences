import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { abonnementActif, stripeConfigure } from "./stripe";

export const COOKIE_ACCES = "licences_acces";

function secret(): string {
  const s = process.env.ACCESS_SECRET;
  if (!s || s.length < 32) throw new Error("ACCESS_SECRET manquante ou trop courte (32 caractères minimum)");
  return s;
}

function signature(valeur: string): string {
  return createHmac("sha256", secret()).update(valeur).digest("base64url");
}

/** Jeton d'accès personnel : l'identifiant client Stripe, signé. */
export function creerJeton(customerId: string): string {
  return `${customerId}.${signature(customerId)}`;
}

export function lireJeton(jeton: string | undefined | null): string | null {
  if (!jeton) return null;
  const point = jeton.lastIndexOf(".");
  if (point <= 0) return null;
  const customerId = jeton.slice(0, point);
  if (!/^cus_[A-Za-z0-9]+$/.test(customerId)) return null;
  const attendue = Buffer.from(signature(customerId));
  const recue = Buffer.from(jeton.slice(point + 1));
  if (attendue.length !== recue.length || !timingSafeEqual(attendue, recue)) return null;
  return customerId;
}

export const OPTIONS_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 400,
};

export type Acces =
  | { statut: "ok"; customerId: string; jeton: string }
  | { statut: "absent" | "inactif" | "indisponible" };

/** Vérifie, côté serveur, le cookie d'accès puis l'abonnement auprès de Stripe. */
export async function verifierAcces(): Promise<Acces> {
  if (!stripeConfigure() || !process.env.ACCESS_SECRET) return { statut: "indisponible" };
  const jeton = (await cookies()).get(COOKIE_ACCES)?.value;
  const customerId = lireJeton(jeton);
  if (!customerId || !jeton) return { statut: "absent" };
  try {
    return (await abonnementActif(customerId)) ? { statut: "ok", customerId, jeton } : { statut: "inactif" };
  } catch (e) {
    console.error("Vérification de l'abonnement impossible", e);
    return { statut: "indisponible" };
  }
}
