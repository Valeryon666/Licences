import { NextResponse } from "next/server";
import { verifierAcces } from "@/lib/acces";
import { stripe } from "@/lib/stripe";
import { SITE_URL } from "@/lib/entreprise";

let configurationId: string | null = null;

// Le portail client Stripe permet de résilier, changer de carte et télécharger ses factures.
// Sa configuration est créée automatiquement la première fois.
async function configurationPortail(): Promise<string> {
  if (configurationId) return configurationId;
  const s = stripe();
  const existantes = await s.billingPortal.configurations.list({ is_default: true, active: true, limit: 1 });
  if (existantes.data[0]) {
    configurationId = existantes.data[0].id;
    return configurationId;
  }
  const creee = await s.billingPortal.configurations.create({
    business_profile: {
      privacy_policy_url: `${SITE_URL}/confidentialite`,
      terms_of_service_url: `${SITE_URL}/cgv`,
    },
    features: {
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ["email", "address", "name", "tax_id"] },
      subscription_cancel: { enabled: true, mode: "at_period_end" },
    },
  });
  configurationId = creee.id;
  return configurationId;
}

export async function POST() {
  const acces = await verifierAcces();
  if (acces.statut !== "ok") {
    return NextResponse.redirect(new URL("/acces", SITE_URL), 303);
  }
  try {
    const session = await stripe().billingPortal.sessions.create({
      customer: acces.customerId,
      configuration: await configurationPortail(),
      return_url: `${SITE_URL}/acces`,
      locale: "fr",
    });
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    console.error("Ouverture du portail client impossible", e);
    return NextResponse.redirect(new URL("/acces?portail=erreur", SITE_URL), 303);
  }
}
