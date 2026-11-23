"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { QUESTIONS } from "@/lib/diagnostic";
import { modifier, useEtat } from "@/lib/etat";
import { Coche, Conteneur } from "@/components/ui";

export function Question({ index }: { index: number }) {
  const router = useRouter();
  const [etat] = useEtat();
  const question = QUESTIONS[index];
  const choisie = etat.reponses[question.cle];
  const suivante = index < QUESTIONS.length - 1 ? `/diagnostic/${index + 2}` : "/resultat";

  useEffect(() => {
    router.prefetch(suivante);
  }, [router, suivante]);

  function choisir(id: string) {
    modifier((e) => ({
      ...e,
      reponses: { ...e.reponses, [question.cle]: id },
      // Une nouvelle taille d’entreprise remet l’effectif exact à zéro.
      effectifExact: question.cle === "effectif" && e.reponses.effectif !== id ? undefined : e.effectifExact,
    }));
    router.push(suivante);
  }

  return (
    <Conteneur etroit className="apparition pt-8 pb-12 sm:pt-12">
      <h1 className="font-serif text-[27px] leading-[1.18] tracking-tight text-balance sm:text-[34px]">{question.titre}</h1>
      <p className="mt-3 text-[16px] leading-relaxed text-gris">{question.aide}</p>

      <fieldset className="mt-8">
        <legend className="sr-only">{question.titre}</legend>
        <div className="flex flex-col gap-3">
          {question.options.map((o) => {
            const active = choisie === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => choisir(o.id)}
                aria-pressed={active}
                className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-[17px] transition-colors ${
                  active
                    ? "border-encre bg-encre text-papier"
                    : "border-trait-fort bg-carte text-encre hover:border-encre active:bg-gris-clair"
                }`}
              >
                <span>{o.libelle}</span>
                {active ? <Coche className="shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 text-[15px]">
        <Link
          href={index === 0 ? "/" : `/diagnostic/${index}`}
          className="inline-flex min-h-11 items-center text-gris underline-offset-4 hover:text-encre hover:underline"
        >
          ← Retour
        </Link>
      </div>
    </Conteneur>
  );
}
