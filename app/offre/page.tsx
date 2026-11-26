import { EnTeteTunnel } from "@/components/EnTeteTunnel";
import { Conteneur } from "@/components/ui";
import { meta } from "@/lib/meta";
import { Offre } from "./Offre";

export const metadata = meta({
  titre: "Votre plan est prêt",
  description: "Gardez votre plan : inventaire, doublons, comptes inutilisés et rappels de renouvellement. Satisfait ou remboursé 14 jours.",
  chemin: "/offre",
});

export default async function PageOffre({ searchParams }: PageProps<"/offre">) {
  const { paiement } = await searchParams;
  return (
    <main>
      <EnTeteTunnel etape={1} total={1} libelle="Votre plan" />
      <Conteneur etroit className="apparition pt-8 pb-12 sm:pt-12">
        <Offre paiement={typeof paiement === "string" ? paiement : null} />
      </Conteneur>
    </main>
  );
}
