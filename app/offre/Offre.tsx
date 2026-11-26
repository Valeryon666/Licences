"use client";

import Link from "next/link";
import { useState } from "react";
import { analyser } from "@/lib/analyse";
import { estimer, libelleReponse } from "@/lib/diagnostic";
import { useEtat } from "@/lib/etat";
import { arrondi10, eur, eurCentimes, pluriel } from "@/lib/format";
import { FORMULES, GARANTIE, INCLUS, INVENTAIRE_OFFERT, formule as trouverFormule, formulePourEffectif, prixParJour, type FormuleId } from "@/lib/offre";
import { ENTREPRISE } from "@/lib/entreprise";
import { ACompleter, Coche, Souligne } from "@/components/ui";
import { Paiement } from "./Paiement";

function Email() {
  return ENTREPRISE.email ? (
    <a className="font-medium text-encre underline underline-offset-4" href={`mailto:${ENTREPRISE.email}`}>
      {ENTREPRISE.email}
    </a>
  ) : (
    <ACompleter valeur={null} quoi="email de contact" />
  );
}

export function Offre({ paiement }: { paiement: string | null }) {
  const [etat, pret] = useEtat();
  const [choix, setChoix] = useState<FormuleId | null>(null);

  const reponduAuDiagnostic = Boolean(etat.reponses.effectif && etat.reponses.departs && etat.reponses.achats);
  const estimation = reponduAuDiagnostic ? estimer(etat.reponses) : null;
  const effectif = etat.effectifExact ?? estimation?.effectif ?? null;
  const analyse = analyser(etat.inventaire, effectif ?? 20, estimation, libelleReponse("departs", etat.reponses.departs));
  const avecInventaire = analyse.lignes.length > 0;
  const perte = arrondi10(avecInventaire && analyse.trouvailles.length > 0 ? analyse.economieTotale : (estimation?.total ?? 0));

  const formuleId = choix ?? (pret ? formulePourEffectif(effectif) : "entreprise");
  const f = trouverFormule(formuleId)!;
  const prixAn = f.prixMois * 12;

  return (
    <div className="space-y-10">
      {paiement === "echec" ? (
        <div role="alert" className="rounded-md border border-vermillon bg-vermillon-fond p-4 text-[15px] leading-relaxed">
          <p className="font-semibold text-vermillon-texte">Le paiement n’a pas abouti.</p>
          <p className="mt-1">
            Aucun montant n’a été débité. Vous pouvez réessayer ci-dessous, avec la même carte ou une autre.
          </p>
        </div>
      ) : null}
      {paiement === "indisponible" ? (
        <div role="alert" className="rounded-md border border-vermillon bg-vermillon-fond p-4 text-[15px] leading-relaxed">
          <p className="font-semibold text-vermillon-texte">Le paiement est momentanément indisponible.</p>
          <p className="mt-1">
            Aucun montant n’a été débité. Écrivez-nous à <Email />, nous vous répondons dans la journée.
          </p>
        </div>
      ) : null}

      {/* 1. Ce qui a déjà été fait pour la personne */}
      <section>
        <p className="montant text-[13px] text-gris">Votre plan</p>
        <h1 className="mt-2 font-serif text-[31px] leading-[1.12] tracking-tight sm:text-[40px]">Votre plan est prêt.</h1>
        <p className="mt-3 text-[17px] leading-relaxed">
          {avecInventaire
            ? `${pluriel(analyse.lignes.length, "logiciel")} inventorié${analyse.lignes.length > 1 ? "s" : ""}, ${pluriel(
                analyse.trouvailles.length,
                "trouvaille",
              )} chiffrée${analyse.trouvailles.length > 1 ? "s" : ""}, et le calendrier de vos renouvellements à remplir. Il ne vous reste qu’à le garder.`
            : estimation
              ? "Votre diagnostic est fait. Gardez votre plan pour passer de l’estimation à vos vrais chiffres, outil par outil."
              : "L’inventaire de vos logiciels, ce qu’ils coûtent par personne, ce qui fait doublon, et un rappel avant chaque renouvellement."}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-md border border-encre px-3 py-2 text-[14px] font-medium">
          <Coche className="text-vermillon" />
          Satisfait ou remboursé {GARANTIE.jours} jours · sans engagement
        </p>
      </section>

      {/* 2. Ce que ça rapporte, comparé au prix */}
      {perte > prixAn ? (
        <section aria-labelledby="titre-comparaison" className="rounded-md border border-trait bg-carte p-5">
          <h2 id="titre-comparaison" className="font-serif text-[22px] leading-tight sm:text-[26px]">
            Vous perdez environ <Souligne>{eur(perte)}</Souligne> par an.
          </h2>
          <div className="mt-6 space-y-4">
            <div>
              <div className="ligne-releve text-[14px]">
                <span>{avecInventaire && analyse.trouvailles.length > 0 ? "Vos trouvailles" : "Votre estimation"}</span>
                <span className="pointilles" aria-hidden />
                <span className="montant text-vermillon-texte">{eur(perte)}<span className="font-sans">/an</span></span>
              </div>
              <div className="mt-2 h-3 w-full rounded-sm bg-vermillon" />
            </div>
            <div>
              <div className="ligne-releve text-[14px]">
                <span>Licences, formule {f.nom}</span>
                <span className="pointilles" aria-hidden />
                <span className="montant">{eur(prixAn)}<span className="font-sans">/an</span></span>
              </div>
              <div className="mt-2 h-3 rounded-sm bg-encre" style={{ width: `${Math.max(3, Math.round((prixAn / perte) * 100))}%` }} />
            </div>
          </div>
          <p className="mt-5 text-[16px] leading-relaxed">
            Soit <strong className="font-semibold">{eurCentimes(prixParJour(f.prixMois))}</strong> par jour pour arrêter de
            perdre {eurCentimes(perte / 365)} par jour.
          </p>
        </section>
      ) : (
        <section className="rounded-md border border-trait bg-carte p-5">
          <h2 className="font-serif text-[22px] leading-tight sm:text-[26px]">Un seul oubli suffit à le rembourser.</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-gris">
            Un outil annuel reconduit sans relecture, c’est une année entière payée d’avance. Votre plan vous
            prévient 30 jours avant chaque échéance, pour {eurCentimes(prixParJour(f.prixMois))} par jour.
          </p>
        </section>
      )}

      {/* 3. Les formules */}
      <section aria-labelledby="titre-formules">
        <h2 id="titre-formules" className="font-serif text-[22px] leading-tight sm:text-[26px]">
          Choisissez votre formule
        </h2>
        <div role="radiogroup" aria-labelledby="titre-formules" className="mt-4 grid gap-3 sm:grid-cols-3">
          {FORMULES.map((x) => {
            const actif = x.id === formuleId;
            return (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={actif}
                onClick={() => setChoix(x.id)}
                className={`relative flex flex-col rounded-md border-2 p-4 text-left transition-colors ${
                  actif ? "border-encre bg-carte" : "border-trait bg-carte/60 hover:border-trait-fort"
                } ${x.recommandee ? "sm:-mt-3 sm:pt-7" : ""}`}
              >
                {x.recommandee ? (
                  <span className="montant absolute -top-3 left-4 rounded-sm bg-vermillon px-2 py-0.5 text-[11px] text-white">
                    Recommandée
                  </span>
                ) : null}
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[17px] font-semibold">{x.nom}</span>
                  <span
                    aria-hidden
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${actif ? "border-encre bg-encre text-papier" : "border-trait-fort"}`}
                  >
                    {actif ? <Coche className="h-3 w-3" /> : null}
                  </span>
                </span>
                <span className="text-[14px] text-gris">{x.pourQui}</span>
                <span className="mt-3 flex items-baseline gap-1">
                  <span className="montant text-[26px] leading-none">{x.prixMois}</span>
                  <span className="text-[20px] leading-none font-semibold">€</span>
                  <span className="ml-0.5 text-[14px] text-gris">/ mois</span>
                </span>
                <span className="montant mt-1 text-[13px] text-gris">soit {eurCentimes(prixParJour(x.prixMois))} par jour</span>
              </button>
            );
          })}
        </div>
        <ul className="mt-5 space-y-2 text-[15px]">
          {INCLUS.map((i) => (
            <li key={i} className="flex gap-2">
              <Coche className="mt-1 shrink-0 text-vermillon" />
              {i}
            </li>
          ))}
        </ul>
        {ENTREPRISE.tva ? <p className="mt-3 text-[13px] text-gris">Prix en euros. {ENTREPRISE.tva}.</p> : null}
      </section>

      {/* 4. La garantie */}
      <section aria-labelledby="titre-garantie" className="rounded-md border-2 border-encre p-5">
        <h2 id="titre-garantie" className="font-serif text-[22px] leading-tight">
          {GARANTIE.jours} jours satisfait ou remboursé
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed">
          Si Licences ne vous convient pas, écrivez « Remboursement » à <Email /> dans les {GARANTIE.jours} jours qui suivent
          votre paiement, sans avoir à vous justifier. Nous lançons le remboursement intégral sous {GARANTIE.delaiLancement}{" "}
          ; il apparaît sur votre compte sous {GARANTIE.delaiBanque}, selon votre banque.
        </p>
      </section>

      {/* 5 et 6. Paiement sur le même écran, avec « sans engagement » juste à côté */}
      <section aria-labelledby="titre-paiement">
        <h2 id="titre-paiement" className="font-serif text-[22px] leading-tight sm:text-[26px]">
          Paiement sécurisé
        </h2>
        <p className="mt-2 flex items-center gap-2 text-[15px] font-medium">
          <Coche className="text-vermillon" />
          Sans engagement, résiliable à tout moment.
        </p>
        <p className="mt-1 text-[13px] text-gris">
          {f.nom} · {f.prixMois} € par mois · paiement par carte via Stripe. En payant, vous acceptez nos{" "}
          <Link href="/cgv" className="underline underline-offset-4" target="_blank">
            conditions générales de vente
          </Link>
          .
        </p>
        <div className="mt-4 overflow-hidden rounded-md border border-trait bg-white">
          {pret ? <Paiement key={formuleId} formule={formuleId} /> : <div className="min-h-[420px]" />}
        </div>
      </section>

      {/* 7. Les quatre objections */}
      <section aria-labelledby="titre-faq">
        <h2 id="titre-faq" className="font-serif text-[22px] leading-tight sm:text-[26px]">
          Questions fréquentes
        </h2>
        <div className="mt-4 divide-y divide-trait border-y border-trait">
          <Question titre="Est-ce que ça marche pour mon entreprise ?">
            Oui, si vous êtes entre 10 et 100 personnes et que plusieurs personnes souscrivent des logiciels. Pas besoin de
            service informatique, ni de connecter vos outils : on part de ce que vous payez, tel que ça apparaît sur vos
            relevés. Un doute ? Écrivez à <Email /> avant de payer, on vous répond franchement.
          </Question>
          <Question titre="Combien de temps ça me prend ?">
            Dix minutes pour nous envoyer vos relevés bancaires : nous faisons l’inventaire pour vous sous{" "}
            {INVENTAIRE_OFFERT.delai}. Ensuite, quelques minutes par mois, et un rappel avant chaque renouvellement.
          </Question>
          <Question titre="Et si je veux arrêter ?">
            Vous résiliez vous-même, en deux clics, depuis votre espace (bouton « Gérer mon abonnement »).
            L’abonnement s’arrête à la fin du mois payé, sans frais ni préavis. Et pendant {GARANTIE.jours} jours
            après le paiement, vous êtes remboursé intégralement sur simple email.
          </Question>
          <Question titre="À quoi sert exactement ce que je paie ?">
            À ne plus payer pour rien. Concrètement : l’inventaire de vos abonnements, fait pour vous à partir de vos
            relevés ; le coût annuel par outil et par personne ; la liste des doublons et des comptes inutilisés à fermer ; et
            un rappel avant chaque renouvellement annuel. Votre plan complet s’ouvre dès le paiement.
          </Question>
        </div>
      </section>
    </div>
  );
}

function Question({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <details className="group py-1">
      <summary className="flex min-h-14 items-center justify-between gap-4 py-2 text-[16px] font-semibold">
        {titre}
        <span aria-hidden className="montant text-[20px] text-gris transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="pb-4 text-[15px] leading-relaxed text-gris">{children}</p>
    </details>
  );
}
