import { EnTeteTunnel } from "@/components/EnTeteTunnel";
import { meta } from "@/lib/meta";
import { Resultat } from "./Resultat";

export const metadata = meta({
  titre: "Votre résultat",
  description: "Ce que vos logiciels inutilisés coûtent à votre entreprise chaque année.",
  chemin: "/resultat",
  indexer: false,
});

export default function PageResultat() {
  return (
    <main>
      <EnTeteTunnel etape={1} total={1} libelle="Votre résultat" />
      <Resultat />
    </main>
  );
}
