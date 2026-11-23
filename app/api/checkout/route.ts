import { NextResponse } from "next/server";
import { formule } from "@/lib/offre";
import { prixStripe, stripe, stripeConfigure } from "@/lib/stripe";
import { GARANTIE } from "@/lib/offre";
import { SITE_URL } from "@/lib/entreprise";

// Crée une session Stripe Checkout intégrée à la page (le formulaire de carte s'affiche sur /offre).
export async function POST(request: Request) {
  if (!stripeConfigure()) {
    return NextResponse.json({ erreur: "Le paiement n'est pas encore activé." }, { status: 503 });
  }

  let corps: unknown;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }
  const id = corps && typeof corps === "object" ? (corps as Record<string, unknown>).formule : null;
  const f = typeof id === "string" ? formule(id) : undefined;
  if (!f) {
    return NextResponse.json({ erreur: "Formule inconnue." }, { status: 400 });
  }

  try {
    const prix = await prixStripe(f.id);
    const session = await stripe().checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "subscription",
      line_items: [{ price: prix, quantity: 1 }],
      return_url: `${SITE_URL}/api/acces?session_id={CHECKOUT_SESSION_ID}`,
      locale: "fr",
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      metadata: { formule: f.id },
      subscription_data: { metadata: { formule: f.id } },
      custom_text: {
        submit: {
          message: `Sans engagement, résiliable à tout moment. Satisfait ou remboursé pendant ${GARANTIE.jours} jours. En payant, vous acceptez nos conditions générales de vente.`,
        },
      },
    });
    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (e) {
    console.error("Création de la session Stripe impossible", e);
    return NextResponse.json({ erreur: "Le paiement n'a pas pu démarrer." }, { status: 502 });
  }
}
