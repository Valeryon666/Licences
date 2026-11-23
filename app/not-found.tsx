import Link from "next/link";
import { Conteneur, Fleche, Logo, classeBouton } from "@/components/ui";

export const metadata = { title: "Page introuvable · Licences", robots: { index: false } };

export default function Introuvable() {
  return (
    <main>
      <Conteneur etroit className="py-4">
        <Logo />
      </Conteneur>
      <Conteneur etroit className="pt-10 pb-16">
        <p className="montant text-[13px] text-gris">Erreur 404</p>
        <h1 className="mt-2 font-serif text-[31px] leading-tight sm:text-[40px]">Cette page n’existe pas, ou plus.</h1>
        <p className="mt-3 text-[17px] text-gris">Le lien est peut-être incomplet. Tout recommence depuis l’accueil.</p>
        <Link href="/" className={`${classeBouton} mt-8`}>
          Revenir à l’accueil
          <Fleche />
        </Link>
      </Conteneur>
    </main>
  );
}
