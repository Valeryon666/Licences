"use client";

import { loadStripe, type Stripe, type StripeEmbeddedCheckout } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import type { FormuleId } from "@/lib/offre";
import { ENTREPRISE } from "@/lib/entreprise";
import { ACompleter } from "@/components/ui";

const CLE_PUBLIQUE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromesse: Promise<Stripe | null> | null = null;
function chargerStripe() {
  if (!CLE_PUBLIQUE) return null;
  stripePromesse ??= loadStripe(CLE_PUBLIQUE);
  return stripePromesse;
}

// Stripe n’accepte qu’un formulaire intégré à la fois : on enchaîne création et destruction.
let file: Promise<void> = Promise.resolve();

/** Formulaire de paiement Stripe, intégré directement dans la page. */
export function Paiement({ formule }: { formule: FormuleId }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const [statut, setStatut] = useState<"chargement" | "pret" | "erreur">("chargement");

  useEffect(() => {
    if (!CLE_PUBLIQUE) return;
    let annule = false;
    let instance: StripeEmbeddedCheckout | null = null;

    file = file.then(async () => {
      if (annule) return;
      try {
        const stripe = await chargerStripe();
        if (!stripe || annule) return;
        const formulaire = await stripe.createEmbeddedCheckoutPage({
          fetchClientSecret: async () => {
            const r = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ formule }),
            });
            const donnees = (await r.json().catch(() => ({}))) as { clientSecret?: string; erreur?: string };
            if (!r.ok || !donnees.clientSecret) throw new Error(donnees.erreur ?? "Paiement indisponible");
            return donnees.clientSecret;
          },
        });
        if (annule || !conteneur.current) {
          formulaire.destroy();
          return;
        }
        instance = formulaire;
        formulaire.mount(conteneur.current);
        setStatut("pret");
      } catch (e) {
        console.error(e);
        if (!annule) setStatut("erreur");
      }
    });

    return () => {
      annule = true;
      file = file.then(() => instance?.destroy());
    };
  }, [formule]);

  if (!CLE_PUBLIQUE) {
    return (
      <div className="rounded-md border border-trait bg-carte p-5 text-[15px] leading-relaxed">
        <p className="font-semibold">Le paiement en ligne ouvre dans quelques heures.</p>
        <p className="mt-1 text-gris">
          Pour démarrer dès maintenant, écrivez à{" "}
          {ENTREPRISE.email ? (
            <a className="text-encre underline underline-offset-4" href={`mailto:${ENTREPRISE.email}`}>
              {ENTREPRISE.email}
            </a>
          ) : (
            <ACompleter valeur={null} quoi="email de contact" />
          )}{" "}
          : nous vous envoyons un lien de paiement.
        </p>
      </div>
    );
  }

  return (
    <div>
      {statut === "chargement" ? (
        <p className="montant py-6 text-center text-[13px] text-gris" role="status">
          Chargement du paiement sécurisé…
        </p>
      ) : null}
      {statut === "erreur" ? (
        <div role="alert" className="rounded-md border border-vermillon bg-vermillon-fond p-4 text-[15px] leading-relaxed">
          <p className="font-semibold text-vermillon-texte">Le formulaire de paiement n’a pas pu se charger.</p>
          <p className="mt-1">
            Aucun montant n’a été débité. Rechargez la page pour réessayer
            {ENTREPRISE.email ? (
              <>
                , ou écrivez-nous à{" "}
                <a className="underline underline-offset-4" href={`mailto:${ENTREPRISE.email}`}>
                  {ENTREPRISE.email}
                </a>
              </>
            ) : null}
            .
          </p>
        </div>
      ) : null}
      <div ref={conteneur} className={statut === "pret" ? "min-h-[420px]" : ""} />
    </div>
  );
}
