import Link from "next/link";
import type { ReactNode } from "react";

export const classeBouton =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-encre px-6 py-4 text-center text-[17px] font-semibold text-papier transition-colors hover:bg-encre-clair active:translate-y-px sm:w-auto";

export const classeBoutonSecondaire =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-encre px-5 py-3 text-center text-[15px] font-semibold text-encre transition-colors hover:bg-gris-clair";

export function Logo({ lien = true }: { lien?: boolean }) {
  const contenu = (
    <span className="inline-flex items-baseline gap-2 font-serif text-[22px] leading-none tracking-tight text-encre">
      <span aria-hidden className="inline-block h-[3px] w-4 translate-y-[-5px] bg-vermillon" />
      Licences
    </span>
  );
  return lien ? (
    <Link href="/" aria-label="Licences, retour à l’accueil" className="inline-flex py-2">
      {contenu}
    </Link>
  ) : (
    contenu
  );
}

/** Soulignement vermillon tracé à la main, pour les montants perdus. */
export function Souligne({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.18em] left-[-2%] h-[0.32em] w-[104%] text-vermillon"
      >
        <path
          d="M2 8.5C40 4.5 90 3 140 4.2c20 .5 38 1.6 56 3.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function LigneReleve({
  libelle,
  montant,
  detail,
  perte = false,
}: {
  libelle: ReactNode;
  montant: string;
  detail?: ReactNode;
  perte?: boolean;
}) {
  return (
    <div className="py-3">
      <div className="ligne-releve">
        <span className="text-[15px] leading-snug">{libelle}</span>
        <span className="pointilles" aria-hidden />
        <span className={`montant text-[15px] ${perte ? "text-vermillon-texte" : ""}`}>{montant}</span>
      </div>
      {detail ? <p className="montant mt-1 text-[12px] whitespace-normal text-gris">{detail}</p> : null}
    </div>
  );
}

export function Fleche({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`h-5 w-5 ${className}`} fill="none">
      <path d="M4 10h11m-4.5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Cadenas({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`h-4 w-4 ${className}`} fill="none">
      <rect x="4" y="9" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Coche({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className={`h-4 w-4 ${className}`} fill="none">
      <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Valeur légale encore inconnue : bien visible pour ne pas l’oublier. */
export function ACompleter({ valeur, quoi }: { valeur: string | null | undefined; quoi: string }) {
  if (valeur) return <>{valeur}</>;
  return <mark className="rounded-sm bg-vermillon-fond px-1 font-mono text-[0.9em] text-vermillon-texte">[À COMPLÉTER : {quoi}]</mark>;
}

export function Conteneur({ children, etroit = false, className = "" }: { children?: ReactNode; etroit?: boolean; className?: string }) {
  return <div className={`mx-auto w-full px-4 sm:px-6 ${etroit ? "max-w-xl" : "max-w-5xl"} ${className}`}>{children}</div>;
}
