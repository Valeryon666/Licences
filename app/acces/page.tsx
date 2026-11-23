import Link from "next/link";
import { Inventaire } from "@/components/Inventaire";
import { ACompleter, Conteneur, Fleche, Logo, classeBouton, classeBoutonSecondaire } from "@/components/ui";
import { verifierAcces } from "@/lib/acces";
import { ENTREPRISE } from "@/lib/entreprise";
import { meta } from "@/lib/meta";

export const metadata = meta({ titre: "Votre plan", chemin: "/acces", indexer: false });

export default async function PageAcces({ searchParams }: PageProps<"/acces">) {
  const { lien, portail } = await searchParams;
  const acces = await verifierAcces();

  return (
    <main>
      <Conteneur etroit className="flex items-center justify-between py-4">
        <Logo />
        {acces.statut === "ok" ? (
          <form action="/api/portail" method="post">
            <button type="submit" className="min-h-11 text-[14px] text-gris underline underline-offset-4 hover:text-encre">
              Gérer mon abonnement
            </button>
          </form>
        ) : null}
      </Conteneur>

      <Conteneur etroit className="apparition pt-4 pb-12">
        {acces.statut === "ok" ? (
          <>
            {portail === "erreur" ? (
              <p role="alert" className="mb-6 rounded-md border border-vermillon bg-vermillon-fond p-4 text-[15px]">
                La gestion de l’abonnement n’a pas pu s’ouvrir. Réessayez dans un instant, ou écrivez-nous à{" "}
                <ACompleter valeur={ENTREPRISE.email} quoi="email de contact" />.
              </p>
            ) : null}
            <p className="montant text-[13px] text-gris">Plan complet</p>
            <h1 className="mt-2 font-serif text-[29px] leading-[1.15] tracking-tight sm:text-[36px]">Votre plan</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-gris">
              Votre inventaire est enregistré sur cet appareil. Ajoutez les dates de renouvellement, puis téléchargez le
              calendrier : vous serez prévenu 30 jours avant chaque échéance.
            </p>
            <div className="mt-8">
              <Inventaire debloque />
            </div>
            <form action="/api/portail" method="post" className="mt-10 border-t border-trait pt-6">
              <button type="submit" className={classeBoutonSecondaire}>
                Gérer mon abonnement (factures, carte, résiliation)
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="font-serif text-[29px] leading-tight sm:text-[36px]">
              {acces.statut === "inactif" ? "Votre abonnement n’est plus actif." : "Cette page est réservée aux abonnés."}
            </h1>
            <p className="mt-3 text-[17px] leading-relaxed text-gris">
              {lien === "invalide"
                ? "Ce lien d’accès n’est pas valide, ou l’abonnement associé est terminé. "
                : lien === "erreur" || acces.statut === "indisponible"
                  ? "Nous n’avons pas pu vérifier votre accès pour le moment. Réessayez dans un instant. "
                  : "Déjà client ? Ouvrez le lien d’accès personnel affiché après votre paiement. "}
              Une question : <ACompleter valeur={ENTREPRISE.email} quoi="email de contact" />.
            </p>
            <Link href="/offre" className={`${classeBouton} mt-8`}>
              Voir les formules
              <Fleche />
            </Link>
          </>
        )}
      </Conteneur>
    </main>
  );
}
