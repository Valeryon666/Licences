import Link from "next/link";
import { PageLegale } from "@/components/PageLegale";
import { ACompleter } from "@/components/ui";
import { ENTREPRISE, HEBERGEUR } from "@/lib/entreprise";
import { meta } from "@/lib/meta";

export const metadata = meta({
  titre: "Mentions légales",
  description: "Éditeur, hébergeur et informations légales du site Licences.",
  chemin: "/mentions-legales",
});

export default function MentionsLegales() {
  const e = ENTREPRISE;
  return (
    <PageLegale titre="Mentions légales" maj="23 novembre 2026">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          Le site Licences est édité par <ACompleter valeur={e.editeur} quoi="nom et prénom, ou raison sociale" />,{" "}
          <ACompleter valeur={e.forme} quoi="forme juridique" />.
        </p>
        <ul>
          <li>SIRET : {e.siret}</li>
          <li>
            Adresse : <ACompleter valeur={e.adresse} quoi="adresse postale" />
          </li>
          <li>
            Email : <ACompleter valeur={e.email} quoi="email de contact" />
          </li>
          <li>
            TVA : <ACompleter valeur={e.tva} quoi="régime de TVA" />
          </li>
          <li>
            Directeur de la publication :{" "}
            <ACompleter valeur={e.directeurPublication ?? e.editeur} quoi="nom du directeur de la publication" />
          </li>
        </ul>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par {HEBERGEUR.nom}, {HEBERGEUR.adresse}. Site : <a href={HEBERGEUR.site}>{HEBERGEUR.site}</a>.
        </p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, la présentation et le code du site sont la propriété de l’éditeur. Toute reproduction sans
          autorisation est interdite. Les noms de logiciels cités appartiennent à leurs éditeurs respectifs ; leur mention
          sert uniquement à les identifier et n’implique aucun partenariat.
        </p>
      </section>
      <section>
        <h2>Données personnelles</h2>
        <p>
          La manière dont nous traitons vos données est décrite dans notre{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </section>
    </PageLegale>
  );
}
