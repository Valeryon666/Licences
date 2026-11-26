"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Conteneur, Logo, classeBouton, classeBoutonSecondaire } from "@/components/ui";

export default function Erreur({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <Conteneur etroit className="py-4">
        <Logo />
      </Conteneur>
      <Conteneur etroit className="pt-10 pb-16">
        <h1 className="font-serif text-[31px] leading-tight sm:text-[40px]">Quelque chose s’est mal passé de notre côté.</h1>
        <p className="mt-3 text-[17px] text-gris">
          Vos réponses sont gardées dans votre navigateur : rien n’est perdu. Réessayez, ou repartez de l’accueil.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={classeBouton}>
            Réessayer
          </button>
          <Link href="/" className={classeBoutonSecondaire}>
            Revenir à l’accueil
          </Link>
        </div>
      </Conteneur>
    </main>
  );
}
