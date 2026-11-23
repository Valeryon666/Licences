"use client";

import Link from "next/link";
import { HYPOTHESES, QUESTIONS, estimer, type Reponses } from "@/lib/diagnostic";
import { useEtat } from "@/lib/etat";
import { arrondi10, eur, pluriel } from "@/lib/format";
import { Conteneur, Fleche, LigneReleve, Souligne, classeBouton } from "@/components/ui";

const ACHATS: Record<string, string> = {
  "une-personne-liste": "une seule personne souscrit les logiciels et tient la liste à jour",
  "une-personne": "une seule personne souscrit les logiciels, sans liste à jour",
  responsables: "chaque responsable d’équipe peut souscrire un logiciel",
  "tout-le-monde": "n’importe qui peut souscrire un logiciel avec une carte ou une note de frais",
};

function libelle(reponses: Reponses, cle: "effectif" | "departs"): string {
  const q = QUESTIONS.find((x) => x.cle === cle)!;
  return (q.options.find((o) => o.id === reponses[cle])?.libelle ?? "").toLowerCase();
}

function phraseSituation(r: Reponses): string {
  const effectif = libelle(r, "effectif");
  const departs =
    r.departs === "0"
      ? "personne n’est parti cette année"
      : `${libelle(r, "departs")} personnes sont parties ces 12 derniers mois`;
  return `Vous êtes ${effectif} dans l’entreprise, ${departs}, et ${ACHATS[r.achats ?? ""] ?? ""}.`;
}

export function Resultat() {
  const [etat, pret] = useEtat();
  if (!pret) return <Conteneur etroit className="min-h-[60vh] pt-10" />;

  const r = etat.reponses;
  const manquante = QUESTIONS.findIndex((q) => !r[q.cle]);
  if (manquante >= 0) {
    return (
      <Conteneur etroit className="pt-10 pb-12">
        <h1 className="font-serif text-[27px] leading-tight">Il manque une réponse pour calculer votre résultat.</h1>
        <p className="mt-3 text-[16px] text-gris">Trois questions, deux minutes. On reprend là où vous en étiez.</p>
        <Link href={`/diagnostic/${manquante + 1}`} className={`${classeBouton} mt-8`}>
          Reprendre le diagnostic
          <Fleche />
        </Link>
      </Conteneur>
    );
  }

  const e = estimer(r);
  const total = arrondi10(e.total);
  const changements: [string, string][] = [
    ["Personne n’a la liste complète des abonnements.", "La liste complète en 30 minutes, ou faite pour vous à partir de vos relevés."],
  ];
  if (e.departs > 0)
    changements.push([
      `Les comptes des ${libelle(r, "departs")} personnes parties sont peut-être encore payés.`,
      "Vous savez qui a quoi, et vous fermez les comptes qui ne servent plus.",
    ]);
  if (e.doublons > 0)
    changements.push([
      `${pluriel(e.doublons, "outil")} en double, choisi${e.doublons > 1 ? "s" : ""} par des équipes différentes.`,
      "Un seul outil par usage, choisi en connaissance de cause.",
    ]);
  changements.push(["Les renouvellements annuels arrivent sans prévenir.", "Un rappel 30 jours avant chaque échéance, à temps pour décider."]);

  return (
    <Conteneur etroit className="apparition pt-8 pb-12 sm:pt-12">
      <p className="montant text-[13px] text-gris">Votre diagnostic</p>
      {total > 0 ? (
        <h1 className="mt-2 font-serif text-[29px] leading-[1.15] tracking-tight text-balance sm:text-[38px]">
          Environ <Souligne>{eur(total)}</Souligne> par an partent sans que personne l’ait décidé.
        </h1>
      ) : (
        <h1 className="mt-2 font-serif text-[29px] leading-[1.15] tracking-tight sm:text-[38px]">
          Bonne nouvelle : votre situation semble saine.
        </h1>
      )}
      <p className="mt-4 text-[17px] leading-relaxed">{phraseSituation(r)}</p>

      <section aria-label="Le détail" className="mt-8 rounded-md border border-trait bg-carte p-5">
        <div className="divide-y divide-trait">
          {e.comptesOublies > 0 ? (
            <LigneReleve
              libelle={`Environ ${pluriel(e.comptesOublies, "compte")} de personnes parties, encore payés`}
              montant={eur(e.coutComptesOublies)}
              detail={`${e.comptesOublies} comptes × ${HYPOTHESES.prixCompte} €/mois × 12 mois`}
              perte
            />
          ) : null}
          {e.doublons > 0 ? (
            <LigneReleve
              libelle={`${pluriel(e.doublons, "outil")} payé${e.doublons > 1 ? "s" : ""} en double par des équipes différentes`}
              montant={eur(e.coutDoublons)}
              detail={`${e.doublons} × ${e.licencesParDoublon} licences × ${HYPOTHESES.prixLicenceDoublon} €/mois × 12 mois`}
              perte
            />
          ) : null}
          <LigneReleve libelle="Refaire la liste à la main, aujourd’hui" montant={e.tempsListe} />
        </div>
        {total > 0 ? (
          <div className="ligne-releve mt-1 border-t-2 border-encre pt-3">
            <span className="text-[15px] font-semibold">Estimation prudente, par an</span>
            <span className="pointilles" aria-hidden />
            <span className="montant text-[17px] text-vermillon-texte">{eur(total)}</span>
          </div>
        ) : (
          <p className="mt-3 text-[15px] leading-relaxed text-gris">
            Votre risque principal se trouve dans les renouvellements annuels : un outil reconduit sans relecture, c’est une
            année entière payée d’avance.
          </p>
        )}
        <details className="mt-4 text-[14px] text-gris">
          <summary className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-encre">
            Comment on calcule
          </summary>
          <p className="mt-2 leading-relaxed">
            Hypothèses volontairement basses : {HYPOTHESES.comptesParPersonne} comptes payants par personne à{" "}
            {HYPOTHESES.prixCompte} €/mois ; une part des comptes reste ouverte après un départ, d’autant plus grande que
            les achats sont dispersés ; chaque outil en double concerne environ 30 % de l’équipe à{" "}
            {HYPOTHESES.prixLicenceDoublon} €/mois. Vos vrais chiffres arrivent à l’étape suivante.
          </p>
        </details>
      </section>

      <section aria-labelledby="titre-changement" className="mt-10">
        <h2 id="titre-changement" className="font-serif text-[23px] leading-tight sm:text-[27px]">
          Ce que Licences change pour vous
        </h2>
        <ul className="mt-5 space-y-4">
          {changements.map(([avant, apres]) => (
            <li key={avant} className="rounded-md border border-trait bg-carte p-4">
              <p className="text-[15px] text-gris line-through decoration-vermillon/60">{avant}</p>
              <p className="mt-1 text-[16px] font-medium">{apres}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Link href="/apercu" className={classeBouton}>
          Voir mes trouvailles, outil par outil
          <Fleche />
        </Link>
        <p className="montant mt-3 text-[13px] text-gris">Gratuit · 2 minutes · rien à installer</p>
      </div>
    </Conteneur>
  );
}
