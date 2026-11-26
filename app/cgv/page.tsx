import Link from "next/link";
import { PageLegale } from "@/components/PageLegale";
import { ACompleter } from "@/components/ui";
import { ENTREPRISE } from "@/lib/entreprise";
import { meta } from "@/lib/meta";
import { FORMULES, GARANTIE, INVENTAIRE_OFFERT } from "@/lib/offre";

export const metadata = meta({
  titre: "Conditions générales de vente",
  description: "Conditions générales de vente de l’abonnement Licences.",
  chemin: "/cgv",
});

export default function Cgv() {
  const e = ENTREPRISE;
  const email = <ACompleter valeur={e.email} quoi="email de contact" />;
  return (
    <PageLegale titre="Conditions générales de vente" maj="23 novembre 2026">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent la vente de l’abonnement Licences par{" "}
          <ACompleter valeur={e.editeur} quoi="nom et prénom, ou raison sociale" /> (SIRET {e.siret}), ci-après « Licences »,
          à des clients professionnels (entreprises, associations, indépendants), ci-après « le Client ». Le paiement de
          l’abonnement vaut acceptation des présentes conditions.
        </p>
      </section>
      <section>
        <h2>2. Le service</h2>
        <p>L’abonnement donne accès à :</p>
        <ul>
          <li>l’inventaire des logiciels et abonnements payés par le Client ;</li>
          <li>le calcul de leur coût annuel, par outil et par personne ;</li>
          <li>le repérage des doublons de fonction et des comptes inutilisés ;</li>
          <li>un rappel avant chaque renouvellement annuel, sous forme de calendrier téléchargeable puis d’email ;</li>
          <li>
            la réalisation de l’inventaire par Licences, à partir des relevés bancaires transmis par le Client, sous{" "}
            {INVENTAIRE_OFFERT.delai} à compter de leur réception.
          </li>
        </ul>
        <p>
          Les montants affichés (économies, doublons, comptes inutilisés) sont des estimations fondées sur les informations
          fournies par le Client. Ils constituent une aide à la décision : la résiliation ou la modification des abonnements
          auprès de leurs éditeurs reste du ressort du Client.
        </p>
      </section>
      <section>
        <h2>3. Prix</h2>
        <ul>
          {FORMULES.map((f) => (
            <li key={f.id}>
              Formule {f.nom} ({f.pourQui.toLowerCase()}) : {f.prixMois} € par mois.
            </li>
          ))}
        </ul>
        <p>
          Prix en euros. <ACompleter valeur={e.tva} quoi="régime de TVA" />. Le prix applicable est celui affiché au moment
          de la souscription. Toute évolution de prix est annoncée par email au moins 30 jours à l’avance ; le Client
          peut alors résilier sans frais.
        </p>
      </section>
      <section>
        <h2>4. Commande, paiement et accès</h2>
        <p>
          L’abonnement est payé par carte bancaire via la plateforme sécurisée Stripe. Licences n’a jamais accès aux
          numéros de carte. L’abonnement est mensuel et se renouvelle automatiquement chaque mois à la date anniversaire
          de la souscription. Un reçu est envoyé par email à chaque paiement.
        </p>
        <p>
          L’accès au service est ouvert immédiatement après la confirmation du paiement par Stripe. Un lien d’accès
          personnel est fourni au Client, qui s’engage à ne le communiquer qu’aux personnes de son organisation.
        </p>
      </section>
      <section>
        <h2>5. Durée et résiliation</h2>
        <p>
          L’abonnement est sans engagement de durée. Le Client peut le résilier à tout moment depuis son espace (bouton
          « Gérer mon abonnement ») ou par email à {email}. La résiliation prend effet à la fin de la période mensuelle en
          cours, déjà payée ; aucun nouveau prélèvement n’a lieu ensuite.
        </p>
      </section>
      <section>
        <h2>6. Garantie satisfait ou remboursé</h2>
        <p>
          Lors de sa première souscription, le Client peut demander le remboursement intégral de son premier paiement dans les{" "}
          {GARANTIE.jours} jours qui le suivent, sans avoir à se justifier, par un email à {email} (objet :
          « Remboursement »). Licences lance le remboursement sous {GARANTIE.delaiLancement} ; il apparaît sur le compte du
          Client sous {GARANTIE.delaiBanque}, selon sa banque. L’abonnement est alors résilié.
        </p>
        <p>
          Lorsque le Client bénéficie du droit de rétractation prévu à l’article L221-3 du Code de la consommation, la
          présente garantie en couvre le délai de 14 jours et ses modalités.
        </p>
      </section>
      <section>
        <h2>7. Défaut de paiement</h2>
        <p>
          En cas d’échec d’un prélèvement, Stripe effectue de nouvelles tentatives et le Client est prévenu par email
          pour mettre à jour sa carte. Sans régularisation, l’accès au service est suspendu.
        </p>
      </section>
      <section>
        <h2>8. Responsabilité</h2>
        <p>
          Licences s’engage à fournir le service avec soin (obligation de moyens). Sa responsabilité ne peut être engagée
          pour des décisions prises par le Client sur la base des estimations fournies, ni pour l’indisponibilité
          temporaire du service. En tout état de cause, elle est limitée aux sommes versées par le Client au cours des 12
          derniers mois.
        </p>
      </section>
      <section>
        <h2>9. Données personnelles</h2>
        <p>
          Le traitement des données est décrit dans la <Link href="/confidentialite">politique de confidentialité</Link>. Les
          relevés bancaires transmis servent uniquement à réaliser l’inventaire et sont supprimés au plus tard 30 jours
          après sa remise.
        </p>
      </section>
      <section>
        <h2>10. Droit applicable et litiges</h2>
        <p>
          Les présentes conditions sont soumises au droit français. En cas de différend, les parties recherchent d’abord
          une solution amiable. À défaut, le litige est porté devant les tribunaux compétents de{" "}
          <ACompleter valeur={e.villeTribunal} quoi="ville du siège" />.
        </p>
      </section>
      <section>
        <h2>11. Modification des conditions</h2>
        <p>
          Licences peut modifier les présentes conditions. Les modifications sont annoncées par email au moins 30 jours avant
          leur entrée en vigueur ; elles s’appliquent aux abonnements en cours à l’issue de ce délai.
        </p>
      </section>
    </PageLegale>
  );
}
