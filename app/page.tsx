import Link from "next/link";
import { BarreAction } from "@/components/BarreAction";
import { Coche, Conteneur, Fleche, LigneReleve, Logo, Souligne, classeBouton } from "@/components/ui";
import { PROMESSE } from "@/lib/meta";

const BENEFICES = [
  {
    titre: "La liste complète, enfin",
    texte:
      "Tous les abonnements de l’entreprise au même endroit, avec le coût annuel par outil et par personne. Saisis en quelques minutes, ou lus depuis vos relevés bancaires.",
  },
  {
    titre: "L’argent qui part pour rien",
    texte:
      "Les comptes des personnes parties, les licences payées pour personne et les outils qui font la même chose : repérés et chiffrés en euros.",
  },
  {
    titre: "Plus de renouvellement surprise",
    texte: "Un rappel avant chaque échéance annuelle, à temps pour résilier, réduire le nombre de comptes ou renégocier.",
  },
];

export default function Accueil() {
  return (
    <main>
      <Conteneur>
        <header className="flex items-center justify-between py-4">
          <Logo lien={false} />
        </header>
      </Conteneur>

      {/* Promesse : reprise mot pour mot des vidéos */}
      <Conteneur className="grid gap-10 pt-6 pb-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:pt-14 lg:pb-20">
        <section>
          <p className="montant mb-4 text-[13px] text-gris">Pour les entreprises de 10 à 100 personnes</p>
          <h1 className="font-serif text-[34px] leading-[1.12] tracking-tight text-balance sm:text-[46px] lg:text-[54px]">
            {PROMESSE}
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-gris sm:text-[18px]">
            Comptes de personnes parties, outils en double, abonnements reconduits sans que personne ne relise :
            Licences retrouve ce que vous payez pour rien, et vous prévient avant chaque renouvellement.
          </p>
          <div className="mt-8">
            <Link id="cta-principal" href="/diagnostic/1" className={classeBouton}>
              Commencer le diagnostic gratuit
              <Fleche />
            </Link>
            <p className="montant mt-3 text-[13px] text-gris">3 questions · 2 minutes · sans inscription</p>
          </div>
        </section>

        {/* La douleur, chiffrée sur un relevé */}
        <section aria-labelledby="titre-releve" className="rounded-md border border-trait bg-carte p-5 sm:p-7">
          <p className="montant text-[12px] text-gris">Exemple · entreprise de 25 personnes</p>
          <h2 id="titre-releve" className="mt-2 font-serif text-[24px] leading-tight sm:text-[28px]">
            <Souligne>3 012 €</Souligne> par an.
            <br />
            Personne ne l’a décidé.
          </h2>
          <div className="mt-5 divide-y divide-trait border-t border-trait">
            <LigneReleve
              libelle="Les comptes de 2 personnes parties"
              montant="1 080 €"
              detail="6 comptes × 15 €/mois × 12 mois"
              perte
            />
            <LigneReleve
              libelle="Deux outils de visio, un par équipe"
              montant="1 344 €"
              detail="8 licences en double × 14 €/mois × 12 mois"
              perte
            />
            <LigneReleve
              libelle="Un outil testé une fois, reconduit chaque année"
              montant="588 €"
              detail="49 €/mois, facturés à l’année"
              perte
            />
          </div>
          <div className="ligne-releve border-t-2 border-encre pt-3">
            <span className="text-[15px] font-semibold">Payé pour rien, chaque année</span>
            <span className="pointilles" aria-hidden />
            <span className="montant text-[17px] text-vermillon-texte">3 012 €</span>
          </div>
          <p className="mt-4 text-[14px] text-gris">Chaque ligne est petite. C’est pour ça que personne ne la voit.</p>
        </section>
      </Conteneur>

      {/* Trois bénéfices */}
      <section aria-labelledby="titre-benefices" className="border-y border-trait bg-carte">
        <Conteneur className="py-12 sm:py-16">
          <h2 id="titre-benefices" className="font-serif text-[26px] leading-tight sm:text-[32px]">
            Ce que Licences fait pour vous
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10">
            {BENEFICES.map((b, i) => (
              <li key={b.titre} className="border-t-2 border-encre pt-4">
                <span className="montant text-[13px] text-vermillon-texte">0{i + 1}</span>
                <h3 className="mt-2 text-[19px] font-semibold leading-snug">{b.titre}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-gris">{b.texte}</p>
              </li>
            ))}
          </ol>
        </Conteneur>
      </section>

      {/* Pour qui */}
      <Conteneur className="py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
          <div>
            <h2 className="font-serif text-[26px] leading-tight sm:text-[32px]">C’est pour vous si…</h2>
            <ul className="mt-6 space-y-3 text-[17px] leading-snug">
              {[
                "vous êtes entre 10 et 100 personnes ;",
                "personne ne s’occupe de l’informatique à plein temps ;",
                "plusieurs personnes peuvent payer un logiciel avec une carte de l’entreprise.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <Coche className="mt-1 shrink-0 text-vermillon" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-end rounded-md border border-trait p-5 text-[16px] leading-relaxed text-gris">
            Rien à installer, rien à connecter. On part de ce que vous payez, tel que ça apparaît sur vos relevés.
          </div>
        </div>
      </Conteneur>

      {/* Dernier appel, même action */}
      <section className="bg-encre text-papier">
        <Conteneur className="py-14 sm:py-20">
          <h2 className="max-w-2xl font-serif text-[28px] leading-tight sm:text-[38px]">
            Combien votre entreprise paie-t-elle pour rien&nbsp;?
          </h2>
          <p className="mt-3 text-[17px] text-papier/80">Réponse en 2 minutes, avec vos chiffres.</p>
          <Link
            id="cta-final"
            href="/diagnostic/1"
            className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-papier px-6 py-4 text-[17px] font-semibold text-encre transition-colors hover:bg-gris-clair sm:w-auto"
          >
            Commencer le diagnostic gratuit
            <Fleche />
          </Link>
        </Conteneur>
      </section>

      <BarreAction href="/diagnostic/1" libelle="Commencer, c’est gratuit" cibles={["cta-principal", "cta-final"]} />
    </main>
  );
}
