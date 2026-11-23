// Les trois questions du diagnostic et le calcul de l’estimation.
// Toutes les hypothèses sont ici, et affichées telles quelles sur la page de résultat.

export type Option = { id: string; libelle: string; valeur: number };

export type Question = {
  cle: "effectif" | "departs" | "achats";
  titre: string;
  aide: string;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    cle: "effectif",
    titre: "Combien de personnes travaillent dans l’entreprise ?",
    aide: "Comptez aussi les stagiaires, les alternants et les freelances : eux aussi ont des comptes payés par l’entreprise.",
    options: [
      { id: "moins-10", libelle: "Moins de 10", valeur: 7 },
      { id: "10-20", libelle: "10 à 20", valeur: 15 },
      { id: "21-50", libelle: "21 à 50", valeur: 35 },
      { id: "51-100", libelle: "51 à 100", valeur: 75 },
      { id: "plus-100", libelle: "Plus de 100", valeur: 120 },
    ],
  },
  {
    cle: "departs",
    titre: "Combien de personnes sont parties ces 12 derniers mois ?",
    aide: "Salariés, stagiaires, CDD, freelances. Chacune avait des comptes : messagerie, stockage, outils métier. Tous ont-ils été fermés ?",
    options: [
      { id: "0", libelle: "Aucune", valeur: 0 },
      { id: "1-2", libelle: "1 ou 2", valeur: 1.5 },
      { id: "3-5", libelle: "3 à 5", valeur: 4 },
      { id: "6-10", libelle: "6 à 10", valeur: 8 },
      { id: "plus-10", libelle: "Plus de 10", valeur: 12 },
    ],
  },
  {
    cle: "achats",
    titre: "Qui peut souscrire un logiciel au nom de l’entreprise ?",
    aide: "C’est comme ça que deux équipes finissent par payer deux outils qui font la même chose, sans le savoir.",
    options: [
      { id: "une-personne-liste", libelle: "Une seule personne, qui tient une liste à jour", valeur: 0 },
      { id: "une-personne", libelle: "Une seule personne, sans liste à jour", valeur: 1 },
      { id: "responsables", libelle: "Chaque responsable d’équipe", valeur: 2 },
      { id: "tout-le-monde", libelle: "N’importe qui, avec une carte ou une note de frais", valeur: 3 },
    ],
  },
];

export type Reponses = Partial<Record<Question["cle"], string>>;

export const HYPOTHESES = {
  comptesParPersonne: 4,
  prixCompte: 12, // € par mois et par compte
  tauxOubli: [0.2, 0.5, 0.6, 0.75], // part des comptes restés ouverts après un départ, selon le mode d’achat
  doublonsParNiveau: [0, 1, 2, 3],
  partLicencesDoublon: 0.3, // part de l’effectif qui utilise un outil en double
  prixLicenceDoublon: 10, // € par mois
  tempsListe: ["environ 1 heure", "une demi-journée", "une journée", "plus d’une journée"],
};

function option(question: Question, id: string | undefined): Option | undefined {
  return question.options.find((o) => o.id === id);
}

export function libelleReponse(cle: Question["cle"], id: string | undefined): string | undefined {
  const q = QUESTIONS.find((x) => x.cle === cle);
  return q ? option(q, id)?.libelle : undefined;
}

export type Estimation = {
  complet: boolean;
  effectif: number;
  departs: number;
  niveauAchats: number;
  comptesOublies: number;
  coutComptesOublies: number;
  doublons: number;
  licencesParDoublon: number;
  coutDoublons: number;
  total: number;
  tempsListe: string;
};

export function estimer(reponses: Reponses): Estimation {
  const [qEffectif, qDeparts, qAchats] = QUESTIONS;
  const oEffectif = option(qEffectif, reponses.effectif);
  const oDeparts = option(qDeparts, reponses.departs);
  const oAchats = option(qAchats, reponses.achats);
  const complet = Boolean(oEffectif && oDeparts && oAchats);

  const effectif = oEffectif?.valeur ?? 35;
  const departs = oDeparts?.valeur ?? 0;
  const niveauAchats = oAchats?.valeur ?? 0;
  const h = HYPOTHESES;

  const comptesOublies = Math.round(departs * h.comptesParPersonne * h.tauxOubli[niveauAchats]);
  const coutComptesOublies = comptesOublies * h.prixCompte * 12;

  let doublons = h.doublonsParNiveau[niveauAchats];
  if (effectif < 10) doublons = Math.min(doublons, 1);
  if (effectif > 50 && niveauAchats > 0) doublons += 1;
  const licencesParDoublon = Math.min(30, Math.max(3, Math.round(effectif * h.partLicencesDoublon)));
  const coutDoublons = doublons * licencesParDoublon * h.prixLicenceDoublon * 12;

  return {
    complet,
    effectif,
    departs,
    niveauAchats,
    comptesOublies,
    coutComptesOublies,
    doublons,
    licencesParDoublon,
    coutDoublons,
    total: coutComptesOublies + coutDoublons,
    tempsListe: h.tempsListe[niveauAchats],
  };
}
