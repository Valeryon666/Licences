// Les logiciels les plus courants dans une PME, classés par fonction.
// Les prix sont des moyennes indicatives par compte et par mois : l'utilisateur les corrige.

export type FonctionId =
  | "messagerie"
  | "visio"
  | "bureautique"
  | "projet"
  | "signature"
  | "design"
  | "crm"
  | "motsdepasse";

export const FONCTIONS: Record<FonctionId, string> = {
  bureautique: "Bureautique et stockage",
  messagerie: "Messagerie d'équipe",
  visio: "Visioconférence",
  projet: "Gestion de projet et notes",
  signature: "Signature électronique",
  design: "Design et création",
  crm: "CRM et prospection",
  motsdepasse: "Mots de passe",
};

/** Combien de comptes par défaut : toute l'entreprise, une partie, ou quelques personnes. */
export type Portee = "tous" | "equipe" | "quelques";

export type Outil = {
  id: string;
  nom: string;
  fonctions: FonctionId[];
  prixIndicatif: number;
  portee: Portee;
  suite?: boolean; // suite bureautique : on ne propose jamais de la supprimer pour un doublon
  note?: string;
};

export const OUTILS: Outil[] = [
  { id: "google-workspace", nom: "Google Workspace", fonctions: ["bureautique", "visio"], prixIndicatif: 12, portee: "tous", suite: true, note: "inclut Google Meet" },
  { id: "microsoft-365", nom: "Microsoft 365", fonctions: ["bureautique"], prixIndicatif: 11, portee: "tous", suite: true },
  { id: "dropbox", nom: "Dropbox", fonctions: ["bureautique"], prixIndicatif: 15, portee: "equipe" },
  { id: "box", nom: "Box", fonctions: ["bureautique"], prixIndicatif: 15, portee: "equipe" },
  { id: "slack", nom: "Slack", fonctions: ["messagerie"], prixIndicatif: 8, portee: "tous" },
  { id: "teams", nom: "Microsoft Teams", fonctions: ["messagerie", "visio"], prixIndicatif: 5, portee: "tous" },
  { id: "zoom", nom: "Zoom", fonctions: ["visio"], prixIndicatif: 14, portee: "equipe" },
  { id: "notion", nom: "Notion", fonctions: ["projet"], prixIndicatif: 10, portee: "equipe" },
  { id: "asana", nom: "Asana", fonctions: ["projet"], prixIndicatif: 11, portee: "equipe" },
  { id: "trello", nom: "Trello", fonctions: ["projet"], prixIndicatif: 6, portee: "equipe" },
  { id: "monday", nom: "monday.com", fonctions: ["projet"], prixIndicatif: 12, portee: "equipe" },
  { id: "clickup", nom: "ClickUp", fonctions: ["projet"], prixIndicatif: 9, portee: "equipe" },
  { id: "jira", nom: "Jira", fonctions: ["projet"], prixIndicatif: 8, portee: "equipe" },
  { id: "docusign", nom: "Docusign", fonctions: ["signature"], prixIndicatif: 25, portee: "quelques" },
  { id: "yousign", nom: "Yousign", fonctions: ["signature"], prixIndicatif: 15, portee: "quelques" },
  { id: "adobe-acrobat", nom: "Adobe Acrobat", fonctions: ["signature"], prixIndicatif: 20, portee: "quelques" },
  { id: "canva", nom: "Canva", fonctions: ["design"], prixIndicatif: 10, portee: "quelques" },
  { id: "adobe-cc", nom: "Adobe Creative Cloud", fonctions: ["design"], prixIndicatif: 70, portee: "quelques" },
  { id: "figma", nom: "Figma", fonctions: ["design"], prixIndicatif: 15, portee: "quelques" },
  { id: "hubspot", nom: "HubSpot", fonctions: ["crm"], prixIndicatif: 20, portee: "quelques" },
  { id: "pipedrive", nom: "Pipedrive", fonctions: ["crm"], prixIndicatif: 25, portee: "quelques" },
  { id: "salesforce", nom: "Salesforce", fonctions: ["crm"], prixIndicatif: 30, portee: "quelques" },
  { id: "1password", nom: "1Password", fonctions: ["motsdepasse"], prixIndicatif: 8, portee: "tous" },
  { id: "dashlane", nom: "Dashlane", fonctions: ["motsdepasse"], prixIndicatif: 8, portee: "tous" },
  { id: "bitwarden", nom: "Bitwarden", fonctions: ["motsdepasse"], prixIndicatif: 5, portee: "tous" },
  { id: "lastpass", nom: "LastPass", fonctions: ["motsdepasse"], prixIndicatif: 6, portee: "tous" },
];

export function outil(id: string): Outil | undefined {
  return OUTILS.find((o) => o.id === id);
}

export function comptesParDefaut(o: Outil, effectif: number): number {
  if (o.portee === "tous") return effectif;
  if (o.portee === "equipe") return Math.max(1, Math.round(effectif * 0.3));
  return Math.min(3, effectif);
}
