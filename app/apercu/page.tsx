import Link from "next/link";
import { BarreAction } from "@/components/BarreAction";
import { EnTeteTunnel } from "@/components/EnTeteTunnel";
import { Inventaire } from "@/components/Inventaire";
import { Conteneur, Fleche, classeBouton } from "@/components/ui";
import { meta } from "@/lib/meta";
import { GARANTIE } from "@/lib/offre";

export const metadata = meta({
  titre: "Vos trouvailles",
  description: "Cochez vos logiciels : coût annuel, doublons et comptes en trop, calculés en direct.",
  chemin: "/apercu",
  indexer: false,
});

export default function PageApercu() {
  return (
    <main>
      <EnTeteTunnel etape={1} total={1} libelle="Vos trouvailles" />
      <Conteneur etroit className="apparition pt-8 pb-12 sm:pt-12">
        <h1 className="font-serif text-[29px] leading-[1.15] tracking-tight text-balance sm:text-[36px]">
          Vérifiez par vous-même, outil par outil.
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-gris">
          Le coût annuel et les doublons se calculent à mesure que vous cochez. Tout reste dans votre navigateur : rien
          n’est envoyé.
        </p>
        <div className="mt-8">
          <Inventaire
            debloque={false}
            cta={
              <Link id="cta-trouvailles" href="/offre" className={classeBouton}>
                Garder mon plan et tout débloquer
                <Fleche />
              </Link>
            }
          />
        </div>
        <div className="mt-10 border-t border-trait pt-8">
          <Link id="cta-apercu" href="/offre" className={classeBouton}>
            Garder mon plan et tout débloquer
            <Fleche />
          </Link>
          <p className="montant mt-3 text-[13px] text-gris">
            Satisfait ou remboursé {GARANTIE.jours} jours · sans engagement
          </p>
        </div>
      </Conteneur>
      <BarreAction href="/offre" libelle="Débloquer mon plan complet" cibles={["cta-trouvailles", "cta-apercu"]} />
    </main>
  );
}
