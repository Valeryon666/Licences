import { notFound } from "next/navigation";
import { EnTeteTunnel } from "@/components/EnTeteTunnel";
import { QUESTIONS } from "@/lib/diagnostic";
import { meta } from "@/lib/meta";
import { Question } from "./Question";

export function generateStaticParams() {
  return QUESTIONS.map((_, i) => ({ etape: String(i + 1) }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/diagnostic/[etape]">) {
  const { etape } = await params;
  return meta({
    titre: `Diagnostic, question ${etape} sur ${QUESTIONS.length}`,
    description: "Trois questions pour chiffrer ce que votre entreprise paie en logiciels inutilisés.",
    chemin: `/diagnostic/${etape}`,
    indexer: etape === "1",
  });
}

export default async function PageQuestion({ params }: PageProps<"/diagnostic/[etape]">) {
  const { etape } = await params;
  const index = Number(etape) - 1;
  if (!Number.isInteger(index) || index < 0 || index >= QUESTIONS.length) notFound();
  return (
    <main>
      <EnTeteTunnel etape={index + 1} total={QUESTIONS.length} libelle={`Question ${index + 1} sur ${QUESTIONS.length}`} />
      <Question index={index} />
    </main>
  );
}
