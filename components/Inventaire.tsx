"use client";

import { useState, type ReactNode } from "react";
import { analyser, type LigneCalculee, type Trouvaille } from "@/lib/analyse";
import { FONCTIONS, OUTILS, comptesParDefaut, outil, type FonctionId } from "@/lib/catalogue";
import { estimer, libelleReponse } from "@/lib/diagnostic";
import { modifier, useEtat } from "@/lib/etat";
import { exporterCalendrier, exporterCsv } from "@/lib/exports";
import { eur, eurCentimes, pluriel } from "@/lib/format";
import { INVENTAIRE_OFFERT } from "@/lib/offre";
import { ENTREPRISE } from "@/lib/entreprise";
import { ACompleter, Cadenas, Coche } from "./ui";

const TROUVAILLES_GRATUITES = 2;

function nombre(v: string): number {
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function Inventaire({ debloque, cta }: { debloque: boolean; cta?: ReactNode }) {
  const [etat, pret] = useEtat();
  const [message, setMessage] = useState<string | null>(null);
  if (!pret) return <div className="min-h-[50vh]" />;

  const estimation = Object.keys(etat.reponses).length ? estimer(etat.reponses) : null;
  const effectif = etat.effectifExact ?? estimation?.effectif ?? 20;
  const analyse = analyser(etat.inventaire, effectif, estimation, libelleReponse("departs", etat.reponses.departs));
  const choisis = new Set(etat.inventaire.map((l) => l.id));

  function basculer(id: string) {
    const o = outil(id);
    if (!o) return;
    modifier((e) => ({
      ...e,
      inventaire: e.inventaire.some((l) => l.id === id)
        ? e.inventaire.filter((l) => l.id !== id)
        : [...e.inventaire, { id, comptes: comptesParDefaut(o, effectif), prixMois: o.prixIndicatif }],
    }));
  }

  function changer(id: string, champ: "comptes" | "prixMois" | "renouvellement", valeur: string) {
    modifier((e) => ({
      ...e,
      inventaire: e.inventaire.map((l) =>
        l.id === id ? { ...l, [champ]: champ === "renouvellement" ? valeur || undefined : nombre(valeur) } : l,
      ),
    }));
  }

  const visibles = debloque ? analyse.trouvailles : analyse.trouvailles.slice(0, TROUVAILLES_GRATUITES);
  const cachees = debloque ? [] : analyse.trouvailles.slice(TROUVAILLES_GRATUITES);
  const economieCachee = cachees.reduce((s, t) => s + t.economieAn, 0);

  return (
    <div className="space-y-10">
      {/* Effectif exact */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-trait bg-carte p-4">
        <label htmlFor="effectif" className="text-[16px] font-medium">
          Nombre de personnes dans l’entreprise
        </label>
        <input
          id="effectif"
          type="number"
          inputMode="numeric"
          min={1}
          max={1000}
          value={effectif}
          onChange={(ev) => {
            const n = Math.round(nombre(ev.target.value));
            modifier((e) => ({ ...e, effectifExact: n > 0 ? n : undefined }));
          }}
          className="montant h-12 w-24 rounded-md border border-trait-fort bg-papier px-3 text-right text-[17px]"
        />
      </section>

      {/* Choix des outils */}
      <section aria-labelledby="titre-choix">
        <h2 id="titre-choix" className="font-serif text-[22px] leading-tight sm:text-[26px]">
          Cochez les logiciels que l’entreprise paie
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-gris">
          Pas besoin d’être exhaustif : cinq outils suffisent pour un premier résultat. Les prix sont des moyennes
          indicatives, corrigez-les avec les vôtres.
        </p>
        <div className="mt-5 space-y-5">
          {(Object.keys(FONCTIONS) as FonctionId[]).map((f) => (
            <fieldset key={f}>
              <legend className="montant mb-2 text-[12px] text-gris">{FONCTIONS[f]}</legend>
              <div className="flex flex-wrap gap-2">
                {OUTILS.filter((o) => o.fonctions[0] === f).map((o) => {
                  const actif = choisis.has(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => basculer(o.id)}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3.5 text-[15px] transition-colors ${
                        actif ? "border-encre bg-encre text-papier" : "border-trait-fort bg-carte hover:border-encre"
                      }`}
                    >
                      {actif ? <Coche /> : null}
                      {o.nom}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      {/* Trouvailles */}
      <section aria-labelledby="titre-trouvailles">
        <h2 id="titre-trouvailles" className="font-serif text-[22px] leading-tight sm:text-[26px]">
          {analyse.trouvailles.length > 0
            ? `${pluriel(analyse.trouvailles.length, "trouvaille")}, ${eur(analyse.economieTotale)} par an`
            : "Vos trouvailles"}
        </h2>
        {analyse.trouvailles.length === 0 ? (
          <p className="mt-3 rounded-md border border-dashed border-trait-fort p-5 text-[15px] leading-relaxed text-gris">
            Aucun doublon pour l’instant. Cochez tous les outils de chaque catégorie : c’est souvent la messagerie,
            la visio et le stockage qui se chevauchent.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {visibles.map((t) => (
              <CarteTrouvaille key={t.id} t={t} />
            ))}
          </ul>
        )}
        {cachees.length > 0 ? (
          <div className="relative mt-3">
            <ul aria-hidden className="pointer-events-none space-y-3 blur-[5px] select-none">
              {cachees.slice(0, 2).map((t) => (
                <CarteTrouvaille key={t.id} t={t} />
              ))}
            </ul>
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <p className="flex items-center gap-2 rounded-md border border-encre bg-carte px-4 py-3 text-center text-[15px] font-medium shadow-[0_1px_0_var(--color-trait)]">
                <Cadenas className="shrink-0" />
                {pluriel(cachees.length, "autre trouvaille", "autres trouvailles")}, {eur(economieCachee)} par an, dans votre plan
              </p>
            </div>
          </div>
        ) : null}
        {cta ? <div className="mt-6">{cta}</div> : null}
      </section>

      {/* Inventaire */}
      <section aria-labelledby="titre-inventaire">
        <h2 id="titre-inventaire" className="font-serif text-[22px] leading-tight sm:text-[26px]">
          Votre inventaire
        </h2>
        {analyse.lignes.length === 0 ? (
          <p className="mt-3 rounded-md border border-dashed border-trait-fort p-5 text-[15px] leading-relaxed text-gris">
            Il apparaîtra ici dès que vous aurez coché un premier outil, avec son coût annuel calculé automatiquement.
          </p>
        ) : (
          <>
            <ul className="mt-4 space-y-3">
              {analyse.lignes.map((l) => (
                <LigneOutil key={l.id} ligne={l} debloque={debloque} onChange={changer} onRetirer={() => basculer(l.id)} />
              ))}
            </ul>
            {!debloque ? (
              <p className="mt-3 flex items-center gap-2 text-[14px] text-gris">
                <Cadenas className="shrink-0" /> Le coût par personne, outil par outil, est dans votre plan complet.
              </p>
            ) : null}
            <div className="mt-4 rounded-md bg-encre p-4 text-papier">
              <div className="ligne-releve">
                <span className="text-[15px]">Total, par an</span>
                <span className="pointilles opacity-40" aria-hidden />
                <span className="montant text-[18px]">{eur(analyse.totalAn)}</span>
              </div>
              <div className="ligne-releve mt-1">
                <span className="text-[15px]">Par personne, par an</span>
                <span className="pointilles opacity-40" aria-hidden />
                <span className="montant text-[18px]">{eur(analyse.parPersonneAn)}</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Ce qui est verrouillé, ou les outils débloqués */}
      {debloque ? (
        <section aria-labelledby="titre-outils" className="space-y-4">
          <h2 id="titre-outils" className="font-serif text-[22px] leading-tight sm:text-[26px]">
            Vos exports
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => exporterCsv(analyse.lignes)}
              disabled={analyse.lignes.length === 0}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-encre px-5 text-[15px] font-semibold hover:bg-gris-clair disabled:opacity-40"
            >
              Télécharger l’inventaire (Excel)
            </button>
            <button
              type="button"
              onClick={() => {
                const n = exporterCalendrier(analyse.lignes);
                setMessage(
                  n === 0
                    ? "Ajoutez d’abord une date de renouvellement sur au moins un outil."
                    : `${pluriel(n, "renouvellement")} dans votre calendrier, avec un rappel 30 jours puis 7 jours avant. Ouvrez le fichier téléchargé pour l’ajouter.`,
                );
              }}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-encre px-5 text-[15px] font-semibold hover:bg-gris-clair"
            >
              Ajouter les rappels à mon calendrier
            </button>
          </div>
          {message ? (
            <p role="status" className="text-[15px] text-gris">
              {message}
            </p>
          ) : null}
          <div className="rounded-md border border-trait bg-carte p-4 text-[15px] leading-relaxed">
            <p className="font-semibold">Votre inventaire fait pour vous</p>
            <p className="mt-1 text-gris">
              Envoyez vos 3 derniers relevés bancaires (PDF ou CSV) à{" "}
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
              . Nous faisons l’inventaire complet sous {INVENTAIRE_OFFERT.delai}.
            </p>
          </div>
        </section>
      ) : (
        <section aria-labelledby="titre-verrou">
          <h2 id="titre-verrou" className="font-serif text-[22px] leading-tight sm:text-[26px]">
            Dans votre plan complet
          </h2>
          <ul className="mt-4 divide-y divide-trait rounded-md border border-trait bg-carte">
            {[
              ["Toutes vos trouvailles, chiffrées", "Doublons, comptes en trop, comptes des personnes parties"],
              ["Le coût par personne, outil par outil", "Pour savoir qui coûte quoi, et décider en connaissance de cause"],
              ["Le calendrier des renouvellements", "Un rappel 30 jours puis 7 jours avant chaque échéance annuelle"],
              ["L’export pour votre comptable", "Votre inventaire en un fichier Excel"],
              ["Votre inventaire fait pour vous", `À partir de vos relevés bancaires, sous ${INVENTAIRE_OFFERT.delai}`],
            ].map(([titre, detail]) => (
              <li key={titre} className="flex gap-3 p-4">
                <Cadenas className="mt-1 shrink-0 text-gris" />
                <div>
                  <p className="text-[16px] font-medium">{titre}</p>
                  <p className="text-[14px] text-gris">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function CarteTrouvaille({ t }: { t: Trouvaille }) {
  return (
    <li className="rounded-md border border-trait bg-carte p-4">
      <p className="montant text-[15px] text-vermillon-texte">− {eur(t.economieAn)} par an</p>
      <p className="mt-1 text-[16px] font-semibold leading-snug">{t.titre}</p>
      <p className="mt-1 text-[15px] leading-relaxed text-gris">{t.detail}</p>
      {t.estimation ? <p className="montant mt-2 text-[12px] text-gris">Estimation tirée de vos réponses</p> : null}
    </li>
  );
}

function LigneOutil({
  ligne,
  debloque,
  onChange,
  onRetirer,
}: {
  ligne: LigneCalculee;
  debloque: boolean;
  onChange: (id: string, champ: "comptes" | "prixMois" | "renouvellement", valeur: string) => void;
  onRetirer: () => void;
}) {
  const champ = "montant mt-1 h-11 w-full rounded-md border border-trait-fort bg-papier px-2.5 text-right text-[16px] text-encre";
  return (
    <li className="rounded-md border border-trait bg-carte px-3.5 pt-2 pb-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[16px] font-semibold">{ligne.outil.nom}</p>
        <button
          type="button"
          onClick={onRetirer}
          aria-label={`Retirer ${ligne.outil.nom}`}
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-[20px] text-gris hover:bg-gris-clair hover:text-encre"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2.5">
        <label className="text-[12px] text-gris">
          Comptes
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={ligne.comptes}
            onChange={(e) => onChange(ligne.id, "comptes", e.target.value)}
            className={champ}
          />
        </label>
        <label className="text-[12px] text-gris">
          € / compte / mois
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.5"
            value={ligne.prixMois}
            onChange={(e) => onChange(ligne.id, "prixMois", e.target.value)}
            className={champ}
          />
        </label>
        <div className="flex h-11 min-w-[5.5rem] flex-col items-end justify-center">
          <span className="text-[12px] text-gris">Par an</span>
          <span className="montant text-[16px]">{eur(ligne.coutAn)}</span>
        </div>
      </div>
      {debloque ? (
        <div className="mt-3 grid grid-cols-[1fr_auto] items-end gap-3 border-t border-trait pt-3">
          <label className="text-[12px] text-gris">
            Prochain renouvellement (facultatif)
            <input
              type="date"
              value={ligne.renouvellement ?? ""}
              onChange={(e) => onChange(ligne.id, "renouvellement", e.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-trait-fort bg-papier px-2.5 text-[16px] text-encre"
            />
          </label>
          <div className="flex h-11 flex-col items-end justify-center">
            <span className="text-[12px] text-gris">Par personne</span>
            <span className="montant text-[15px]">{eurCentimes(ligne.coutParCompteAn)}/an</span>
          </div>
        </div>
      ) : null}
    </li>
  );
}
