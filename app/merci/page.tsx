import Link from "next/link";
import { CopierLien } from "@/components/CopierLien";
import { ACompleter, Conteneur, Fleche, Logo, classeBouton } from "@/components/ui";
import { verifierAcces } from "@/lib/acces";
import { ENTREPRISE, SITE_URL } from "@/lib/entreprise";
import { meta } from "@/lib/meta";
import { GARANTIE, INVENTAIRE_OFFERT } from "@/lib/offre";

export const metadata = meta({ titre: "Merci", chemin: "/merci", indexer: false });

export default async function PageMerci() {
  const acces = await verifierAcces();

  return (
    <main>
      <Conteneur etroit className="py-4">
        <Logo />
      </Conteneur>
      <Conteneur etroit className="apparition pt-6 pb-12">
        {acces.statut === "ok" ? (
          <>
            <p className="montant text-[13px] text-gris">Paiement confirmé</p>
            <h1 className="mt-2 font-serif text-[31px] leading-[1.12] tracking-tight sm:text-[40px]">
              C’est fait. Votre plan est débloqué.
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-gris">
              Stripe vous envoie votre reçu par email. Voici les trois choses à faire maintenant.
            </p>

            <ol className="mt-8 space-y-6">
              <li className="rounded-md border border-trait bg-carte p-5">
                <p className="montant text-[13px] text-vermillon-texte">01</p>
                <p className="mt-1 text-[18px] font-semibold">Ouvrez votre plan complet</p>
                <p className="mt-1 text-[15px] text-gris">Toutes vos trouvailles, le coût par personne, les exports et le calendrier.</p>
                <Link href="/acces" className={`${classeBouton} mt-4`}>
                  Ouvrir mon plan
                  <Fleche />
                </Link>
              </li>
              <li className="rounded-md border border-trait bg-carte p-5">
                <p className="montant text-[13px] text-vermillon-texte">02</p>
                <p className="mt-1 text-[18px] font-semibold">Envoyez-nous vos relevés</p>
                <p className="mt-1 text-[15px] leading-relaxed text-gris">
                  Vos 3 derniers relevés bancaires (PDF ou CSV), à{" "}
                  {ENTREPRISE.email ? (
                    <a
                      className="font-medium text-encre underline underline-offset-4"
                      href={`mailto:${ENTREPRISE.email}?subject=${encodeURIComponent("Mes relevés pour l’inventaire Licences")}`}
                    >
                      {ENTREPRISE.email}
                    </a>
                  ) : (
                    <ACompleter valeur={null} quoi="email de contact" />
                  )}
                  . Nous faisons l’inventaire complet de vos abonnements sous {INVENTAIRE_OFFERT.delai}.
                </p>
              </li>
              <li className="rounded-md border border-trait bg-carte p-5">
                <p className="montant text-[13px] text-vermillon-texte">03</p>
                <p className="mt-1 text-[18px] font-semibold">Gardez votre lien d’accès</p>
                <p className="mt-1 mb-3 text-[15px] leading-relaxed text-gris">
                  Il ouvre votre plan sur n’importe quel appareil. Ne le partagez qu’avec des collègues de confiance.
                </p>
                <CopierLien lien={`${SITE_URL}/api/acces?t=${encodeURIComponent(acces.jeton)}`} />
              </li>
            </ol>
            <p className="mt-8 text-[14px] text-gris">
              Rappel : satisfait ou remboursé pendant {GARANTIE.jours} jours, sur simple email.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-serif text-[29px] leading-tight sm:text-[36px]">Nous n’avons pas pu confirmer votre paiement.</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-gris">
              Si vous venez de payer, patientez une minute puis rechargez cette page. Si le problème continue, écrivez-nous à{" "}
              <ACompleter valeur={ENTREPRISE.email} quoi="email de contact" /> : nous rétablissons votre accès dans la
              journée. Aucun montant n’est débité deux fois.
            </p>
            <Link href="/offre" className={`${classeBouton} mt-8`}>
              Revenir à mon plan
              <Fleche />
            </Link>
          </>
        )}
      </Conteneur>
    </main>
  );
}
