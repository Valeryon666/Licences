import Link from "next/link";
import { ENTREPRISE } from "@/lib/entreprise";
import { Conteneur } from "./ui";

export function PiedDePage() {
  return (
    <footer className="mt-16 border-t border-trait bg-papier">
      <Conteneur className="flex flex-col gap-4 py-8 text-[14px] text-gris sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Informations légales" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/mentions-legales" className="py-1 underline-offset-4 hover:text-encre hover:underline">
            Mentions légales
          </Link>
          <Link href="/cgv" className="py-1 underline-offset-4 hover:text-encre hover:underline">
            CGV
          </Link>
          <Link href="/confidentialite" className="py-1 underline-offset-4 hover:text-encre hover:underline">
            Confidentialité
          </Link>
          {ENTREPRISE.email ? (
            <a href={`mailto:${ENTREPRISE.email}`} className="py-1 underline-offset-4 hover:text-encre hover:underline">
              Contact
            </a>
          ) : null}
        </nav>
        <p className="montant text-[12px]">© 2026 Licences · SIRET {ENTREPRISE.siret}</p>
      </Conteneur>
    </footer>
  );
}
