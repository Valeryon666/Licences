// Informations légales affichées dans les mentions légales, les CGV,
// la politique de confidentialité et la garantie.
// Une valeur à null s’affiche « [À COMPLÉTER] » sur le site.

export const ENTREPRISE = {
  marque: "Licences",
  editeur: null as string | null, // Nom et prénom, ou raison sociale
  forme: "Entrepreneur individuel (micro-entreprise)" as string | null, // À confirmer
  siret: "993 212 323 00022",
  adresse: null as string | null, // Adresse postale complète
  email: null as string | null, // Email de contact affiché publiquement
  directeurPublication: null as string | null,
  tva: "TVA non applicable, article 293 B du Code général des impôts" as string | null, // À confirmer
  villeTribunal: null as string | null, // Ville du tribunal compétent (souvent celle du siège)
};

export const HEBERGEUR = {
  nom: "Vercel Inc.",
  adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
  site: "https://vercel.com",
};

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
