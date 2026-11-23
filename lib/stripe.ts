import "server-only";
import Stripe from "stripe";
import { FORMULES, type FormuleId } from "./offre";

let client: Stripe | null = null;

export function stripeConfigure(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripe(): Stripe {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) throw new Error("STRIPE_SECRET_KEY manquante");
  if (!client) client = new Stripe(cle);
  return client;
}

const prixEnCache = new Map<FormuleId, string>();

/**
 * Retrouve le prix Stripe d’une formule grâce à sa lookup_key.
 * S’il n’existe pas encore (premier paiement en mode test, puis en mode réel),
 * le produit et le prix sont créés automatiquement : rien à configurer à la main.
 */
export async function prixStripe(id: FormuleId): Promise<string> {
  const enCache = prixEnCache.get(id);
  if (enCache) return enCache;
  const f = FORMULES.find((x) => x.id === id);
  if (!f) throw new Error(`Formule inconnue : ${id}`);

  const s = stripe();
  const existants = await s.prices.list({ lookup_keys: [f.lookupKey], active: true, limit: 1 });
  let prixId = existants.data[0]?.id;
  if (!prixId) {
    const prix = await s.prices.create({
      currency: "eur",
      unit_amount: f.prixMois * 100,
      recurring: { interval: "month" },
      lookup_key: f.lookupKey,
      transfer_lookup_key: true,
      product_data: { name: `Licences — ${f.nom} (${f.pourQui.toLowerCase()})` },
    });
    prixId = prix.id;
  }
  prixEnCache.set(id, prixId);
  return prixId;
}

/** Vrai si le client a un abonnement en cours (y compris un paiement en cours de nouvelle tentative). */
export async function abonnementActif(customerId: string): Promise<boolean> {
  const abonnements = await stripe().subscriptions.list({ customer: customerId, status: "all", limit: 10 });
  return abonnements.data.some((a) => ["active", "trialing", "past_due"].includes(a.status));
}
