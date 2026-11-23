// Les formules et la garantie. Changer un prix ici change tout le site ;
// côté Stripe, changer aussi la version de lookupKey (v1 → v2) pour créer un nouveau prix.

export type FormuleId = "equipe" | "entreprise" | "grande";

export type Formule = {
  id: FormuleId;
  nom: string;
  pourQui: string;
  prixMois: number; // en euros
  lookupKey: string;
  recommandee?: boolean;
};

export const FORMULES: Formule[] = [
  {
    id: "equipe",
    nom: "Équipe",
    pourQui: "Jusqu’à 20 personnes",
    prixMois: 39,
    lookupKey: "licences_equipe_mensuel_v1",
  },
  {
    id: "entreprise",
    nom: "Entreprise",
    pourQui: "De 21 à 50 personnes",
    prixMois: 79,
    lookupKey: "licences_entreprise_mensuel_v1",
    recommandee: true,
  },
  {
    id: "grande",
    nom: "Grande équipe",
    pourQui: "De 51 à 100 personnes",
    prixMois: 129,
    lookupKey: "licences_grande_mensuel_v1",
  },
];

export function formule(id: string | null | undefined): Formule | undefined {
  return FORMULES.find((f) => f.id === id);
}

export function prixParJour(prixMois: number): number {
  return (prixMois * 12) / 365;
}

export function formulePourEffectif(effectif: number | null): FormuleId {
  if (effectif === null) return "entreprise";
  if (effectif <= 20) return "equipe";
  if (effectif <= 50) return "entreprise";
  return "grande";
}

export const GARANTIE = {
  jours: 14,
  delaiLancement: "48 heures",
  delaiBanque: "5 à 10 jours ouvrés",
};

export const INVENTAIRE_OFFERT = {
  delai: "48 heures ouvrées",
};

export const INCLUS = [
  "L’inventaire complet de vos abonnements, tenu à jour",
  "Le coût annuel par outil et par personne",
  "Les doublons et les comptes inutilisés, repérés et chiffrés",
  "Un rappel avant chaque renouvellement annuel",
  "Votre inventaire fait pour vous à partir de vos relevés",
];
