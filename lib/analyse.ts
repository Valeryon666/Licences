// Analyse de l’inventaire : coût annuel, doublons de fonction, comptes en trop,
// comptes des personnes parties. Tout est calculé dans le navigateur.

import { FONCTIONS, outil, type FonctionId, type Outil } from "./catalogue";
import type { Estimation } from "./diagnostic";
import { eur, pluriel } from "./format";

export type LigneInventaire = {
  id: string;
  comptes: number;
  prixMois: number;
  renouvellement?: string; // AAAA-MM-JJ, date de la prochaine échéance annuelle
};

export type LigneCalculee = LigneInventaire & {
  outil: Outil;
  coutAn: number;
  coutParCompteAn: number;
};

export type Trouvaille = {
  id: string;
  type: "partants" | "doublon" | "surplus";
  titre: string;
  detail: string;
  economieAn: number;
  estimation?: boolean;
};

export type Analyse = {
  lignes: LigneCalculee[];
  totalAn: number;
  parPersonneAn: number;
  trouvailles: Trouvaille[];
  economieTotale: number;
};

function listeNoms(noms: string[]): string {
  if (noms.length <= 1) return noms.join("");
  return `${noms.slice(0, -1).join(", ")} et ${noms[noms.length - 1]}`;
}

export function analyser(
  inventaire: LigneInventaire[],
  effectif: number,
  estimation: Estimation | null,
  libelleDeparts?: string,
): Analyse {
  const lignes: LigneCalculee[] = inventaire
    .map((l) => {
      const o = outil(l.id);
      if (!o) return null;
      const comptes = Math.max(0, Math.round(l.comptes || 0));
      const prixMois = Math.max(0, l.prixMois || 0);
      return { ...l, comptes, prixMois, outil: o, coutAn: comptes * prixMois * 12, coutParCompteAn: prixMois * 12 };
    })
    .filter((l): l is LigneCalculee => l !== null);

  const totalAn = lignes.reduce((s, l) => s + l.coutAn, 0);
  const parPersonneAn = effectif > 0 ? totalAn / effectif : 0;
  const trouvailles: Trouvaille[] = [];

  // 1. Comptes des personnes parties (estimation tirée du diagnostic)
  if (estimation && estimation.comptesOublies > 0) {
    trouvailles.push({
      id: "partants",
      type: "partants",
      titre: "Des comptes de personnes parties, toujours payés",
      detail: `${libelleDeparts ? `${libelleDeparts} départs cette année` : "Vos départs de l’année"} : environ ${pluriel(estimation.comptesOublies, "compte")} restés ouverts. À vérifier outil par outil, avec la liste de qui a quoi.`,
      economieAn: estimation.coutComptesOublies,
      estimation: true,
    });
  }

  // 2. Doublons de fonction : on garde les suites, puis l’outil qui couvre le plus d’usages, puis le plus utilisé
  const retires = new Set<string>();
  for (const fonction of Object.keys(FONCTIONS) as FonctionId[]) {
    const groupe = lignes.filter((l) => l.outil.fonctions.includes(fonction) && !retires.has(l.id) && l.comptes > 0);
    if (groupe.length < 2) continue;
    const tries = [...groupe].sort(
      (a, b) =>
        Number(Boolean(b.outil.suite)) - Number(Boolean(a.outil.suite)) ||
        b.outil.fonctions.length - a.outil.fonctions.length ||
        b.coutAn - a.coutAn,
    );
    const garde = tries[0];
    const aRetirer = tries.slice(1).filter((l) => !l.outil.suite || tries.every((t) => t.outil.suite));
    const economie = aRetirer.reduce((s, l) => s + l.coutAn, 0);
    if (aRetirer.length === 0 || economie <= 0) continue;
    aRetirer.forEach((l) => retires.add(l.id));
    const nomGarde = garde.outil.note ? `${garde.outil.nom} (${garde.outil.note})` : garde.outil.nom;
    trouvailles.push({
      id: `doublon-${fonction}`,
      type: "doublon",
      titre: `${FONCTIONS[fonction]} : ${listeNoms(groupe.map((l) => l.outil.nom))} font la même chose`,
      detail: `En gardant seulement ${nomGarde}, vous arrêtez de payer ${listeNoms(aRetirer.map((l) => l.outil.nom))}. À décider avec les équipes qui les utilisent.`,
      economieAn: economie,
    });
  }

  // 3. Plus de comptes que de personnes
  for (const l of lignes) {
    if (effectif > 0 && l.comptes > effectif && !retires.has(l.id)) {
      const surplus = l.comptes - effectif;
      trouvailles.push({
        id: `surplus-${l.id}`,
        type: "surplus",
        titre: `${l.outil.nom} : ${l.comptes} comptes pour ${effectif} personnes`,
        detail: `${pluriel(surplus, "compte")} payé${surplus > 1 ? "s" : ""} pour personne, soit ${eur(surplus * l.prixMois * 12)} par an.`,
        economieAn: surplus * l.prixMois * 12,
      });
    }
  }

  trouvailles.sort((a, b) => b.economieAn - a.economieAn);
  const economieTotale = trouvailles.reduce((s, t) => s + t.economieAn, 0);
  return { lignes, totalAn, parPersonneAn, trouvailles, economieTotale };
}
