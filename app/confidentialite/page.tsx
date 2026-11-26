import { PageLegale } from "@/components/PageLegale";
import { ACompleter } from "@/components/ui";
import { ENTREPRISE } from "@/lib/entreprise";
import { meta } from "@/lib/meta";

export const metadata = meta({
  titre: "Politique de confidentialité",
  description: "Quelles données Licences traite, pourquoi, et combien de temps.",
  chemin: "/confidentialite",
});

export default function Confidentialite() {
  const e = ENTREPRISE;
  const email = <ACompleter valeur={e.email} quoi="email de contact" />;
  return (
    <PageLegale titre="Politique de confidentialité" maj="23 novembre 2026">
      <section>
        <h2>En bref</h2>
        <p>
          Vos réponses au diagnostic et votre inventaire restent dans votre navigateur : ils ne sont pas envoyés à nos
          serveurs. Nous ne vendons aucune donnée, et nous ne déposons aucun cookie publicitaire.
        </p>
      </section>
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          <ACompleter valeur={e.editeur} quoi="nom et prénom, ou raison sociale" />, SIRET {e.siret},{" "}
          <ACompleter valeur={e.adresse} quoi="adresse postale" />. Contact : {email}.
        </p>
      </section>
      <section>
        <h2>Les données que nous traitons</h2>
        <ul>
          <li>
            <strong>Diagnostic et inventaire</strong> : enregistrés uniquement dans votre navigateur (stockage local). Vous
            pouvez les effacer à tout moment en supprimant les données du site dans votre navigateur.
          </li>
          <li>
            <strong>Paiement et facturation</strong> : email, nom, adresse de facturation et, le cas échéant, numéro de TVA,
            collectés par notre prestataire de paiement Stripe. Nous ne voyons jamais vos numéros de carte. Base légale :
            exécution du contrat et obligations comptables. Durée : 10 ans pour les pièces comptables.
          </li>
          <li>
            <strong>Relevés bancaires</strong> que vous nous envoyez par email pour l’inventaire : utilisés uniquement
            pour le réaliser, puis supprimés au plus tard 30 jours après sa remise. Vous pouvez masquer les lignes sans
            rapport avec vos logiciels avant de les envoyer. Base légale : exécution du contrat.
          </li>
          <li>
            <strong>Échanges par email</strong> : conservés le temps de traiter votre demande, et au plus 3 ans après notre
            dernier échange.
          </li>
          <li>
            <strong>Mesure d’audience</strong> : Vercel Web Analytics, sans cookie, sous forme de statistiques agrégées
            (pages vues, pays, type d’appareil). Aucune donnée ne permet de vous identifier. Base légale : intérêt
            légitime à savoir quelles pages sont utiles.
          </li>
        </ul>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>
          Un seul cookie : <code className="montant text-[14px]">licences_acces</code>, déposé après votre paiement pour vous
          reconnaître comme abonné. Il est strictement nécessaire au service, ne sert à aucun suivi et dure 13 mois. Il ne
          demande donc pas de consentement.
        </p>
      </section>
      <section>
        <h2>Nos prestataires</h2>
        <ul>
          <li>Stripe Payments Europe (Irlande) : paiement et facturation ;</li>
          <li>Vercel Inc. (États-Unis) : hébergement du site et mesure d’audience ;</li>
          <li>Resend (États-Unis) : envoi des emails automatiques (confirmation, rappels).</li>
        </ul>
        <p>
          Les transferts hors de l’Union européenne sont encadrés par les garanties prévues par le RGPD, notamment les
          clauses contractuelles types de la Commission européenne.
        </p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez accéder à vos données, les rectifier, les effacer, vous opposer à leur traitement, en limiter
          l’usage ou en demander une copie, en écrivant à {email}. Nous répondons sous un mois. Si vous estimez que vos
          droits ne sont pas respectés, vous pouvez saisir la CNIL (cnil.fr).
        </p>
      </section>
    </PageLegale>
  );
}
