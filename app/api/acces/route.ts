import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ACCES, OPTIONS_COOKIE, creerJeton, lireJeton } from "@/lib/acces";
import { abonnementActif, stripe, stripeConfigure } from "@/lib/stripe";
import { SITE_URL } from "@/lib/entreprise";

// Ouvre l'accès :
//  - ?session_id=… au retour du paiement : on interroge Stripe côté serveur (jamais l'URL seule) ;
//  - ?t=… depuis le lien d'accès personnel, sur un autre appareil.
export async function GET(request: NextRequest) {
  const vers = (chemin: string) => new URL(chemin, SITE_URL);
  if (!stripeConfigure() || !process.env.ACCESS_SECRET) {
    return NextResponse.redirect(vers("/offre?paiement=indisponible"), 303);
  }

  const sessionId = request.nextUrl.searchParams.get("session_id");
  const jetonRecu = request.nextUrl.searchParams.get("t");

  try {
    let customerId: string | null = null;
    let destination = "/acces";

    if (sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
      const session = await stripe().checkout.sessions.retrieve(sessionId);
      const paye = session.status === "complete" && session.payment_status !== "unpaid";
      if (!paye || typeof session.customer !== "string") {
        return NextResponse.redirect(vers("/offre?paiement=echec"), 303);
      }
      customerId = session.customer;
      destination = "/merci";
    } else if (jetonRecu) {
      customerId = lireJeton(jetonRecu);
      if (!customerId || !(await abonnementActif(customerId))) {
        return NextResponse.redirect(vers("/acces?lien=invalide"), 303);
      }
    } else {
      return NextResponse.redirect(vers("/acces"), 303);
    }

    const reponse = NextResponse.redirect(vers(destination), 303);
    reponse.cookies.set(COOKIE_ACCES, creerJeton(customerId), OPTIONS_COOKIE);
    return reponse;
  } catch (e) {
    console.error("Ouverture de l'accès impossible", e);
    return NextResponse.redirect(vers("/acces?lien=erreur"), 303);
  }
}
