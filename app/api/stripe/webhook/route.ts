import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { creerJeton } from "@/lib/acces";
import { emailProprietaire, envoyerEmail } from "@/lib/email";
import { ENTREPRISE, SITE_URL } from "@/lib/entreprise";
import { formule, GARANTIE, INVENTAIRE_OFFERT } from "@/lib/offre";

// Stripe appelle cette adresse à chaque événement de paiement.
// La signature est vérifiée : un appel qui ne vient pas de Stripe est rejeté.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ erreur: "Signature absente." }, { status: 400 });
  }

  let evenement: Stripe.Event;
  try {
    evenement = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch (e) {
    console.error("Webhook Stripe rejeté : signature invalide", e);
    return NextResponse.json({ erreur: "Signature invalide." }, { status: 400 });
  }

  try {
    switch (evenement.type) {
      case "checkout.session.completed":
        await paiementConfirme(evenement.data.object);
        break;
      case "invoice.payment_failed":
        await paiementRefuse(evenement.data.object);
        break;
      case "customer.subscription.deleted":
        await abonnementTermine(evenement.data.object);
        break;
      default:
        break;
    }
  } catch (e) {
    // On répond quand même 200 : le paiement est enregistré chez Stripe, seul l'email a échoué.
    console.error(`Traitement de ${evenement.type} incomplet`, e);
  }
  return NextResponse.json({ recu: true });
}

async function paiementConfirme(session: Stripe.Checkout.Session) {
  if (session.payment_status === "unpaid" || typeof session.customer !== "string") return;
  const email = session.customer_details?.email;
  const f = formule(session.metadata?.formule);
  const lien = `${SITE_URL}/api/acces?t=${encodeURIComponent(creerJeton(session.customer))}`;
  console.info(`Paiement confirmé : ${session.id}, formule ${f?.id ?? "?"}`);

  if (email) {
    await envoyerEmail({
      a: email,
      sujet: "Votre plan Licences est débloqué",
      repondreA: ENTREPRISE.email ?? undefined,
      texte: [
        "Bonjour,",
        "",
        "Merci, votre abonnement Licences est actif.",
        "",
        "Votre lien d'accès personnel (gardez-le, il ouvre votre plan sur n'importe quel appareil) :",
        lien,
        "",
        `Prochaine étape : répondez à cet email avec vos 3 derniers relevés bancaires (PDF ou CSV). Nous faisons l'inventaire complet de vos abonnements sous ${INVENTAIRE_OFFERT.delai}.`,
        "",
        `Satisfait ou remboursé pendant ${GARANTIE.jours} jours : répondez simplement « Remboursement » à cet email.`,
        "",
        "À très vite,",
        "Licences",
      ].join("\n"),
    });
  }

  const proprietaire = emailProprietaire();
  if (proprietaire) {
    await envoyerEmail({
      a: proprietaire,
      sujet: `Nouvelle vente : ${f?.nom ?? "formule inconnue"} (${f ? `${f.prixMois} €/mois` : "?"})`,
      texte: `Client : ${email ?? "email inconnu"}\nSession Stripe : ${session.id}\n\nÀ faire : lui envoyer la demande de relevés si ce n'est pas déjà fait, puis l'inventaire sous ${INVENTAIRE_OFFERT.delai}.`,
    });
  }
}

async function paiementRefuse(facture: Stripe.Invoice) {
  const email = facture.customer_email;
  console.warn(`Paiement refusé pour la facture ${facture.id}`);
  if (!email) return;
  await envoyerEmail({
    a: email,
    sujet: "Votre paiement Licences n'a pas abouti",
    repondreA: ENTREPRISE.email ?? undefined,
    texte: [
      "Bonjour,",
      "",
      "Le prélèvement de votre abonnement Licences n'a pas abouti. Aucun montant n'a été débité.",
      "Stripe va réessayer automatiquement dans les prochains jours. Pour mettre à jour votre carte dès maintenant :",
      `${SITE_URL}/acces`,
      "(bouton « Gérer mon abonnement »)",
      "",
      "Une question ? Répondez à cet email.",
      "Licences",
    ].join("\n"),
  });
}

async function abonnementTermine(abonnement: Stripe.Subscription) {
  console.info(`Abonnement terminé : ${abonnement.id}`);
  const proprietaire = emailProprietaire();
  if (proprietaire) {
    await envoyerEmail({
      a: proprietaire,
      sujet: "Un abonnement Licences vient de se terminer",
      texte: `Abonnement : ${abonnement.id}\nClient Stripe : ${String(abonnement.customer)}\n\nBon moment pour lui demander, en une phrase, ce qui a manqué.`,
    });
  }
}
