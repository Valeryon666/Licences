import type { Metadata } from "next";

export const PROMESSE = "Votre entreprise paie des logiciels que personne n'utilise.";
export const DESCRIPTION =
  "Comptes de personnes parties, outils en double, renouvellements oubliés : Licences retrouve ce que votre entreprise paie pour rien. Diagnostic gratuit en 2 minutes.";

/** Titre, description et aperçu de partage (Open Graph) d'une page. */
export function meta({
  titre,
  description = DESCRIPTION,
  chemin,
  indexer = true,
}: {
  titre?: string;
  description?: string;
  chemin: string;
  indexer?: boolean;
}): Metadata {
  const titreComplet = titre ? `${titre} · Licences` : `Licences — ${PROMESSE}`;
  return {
    title: titreComplet,
    description,
    alternates: { canonical: chemin },
    robots: indexer ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: "Licences",
      url: chemin,
      title: titre ?? PROMESSE,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: PROMESSE }],
    },
    twitter: {
      card: "summary_large_image",
      title: titre ?? PROMESSE,
      description,
      images: ["/og.png"],
    },
  };
}
