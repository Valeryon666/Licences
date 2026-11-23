import { Conteneur, Logo } from "./ui";

/** En-tête des écrans du parcours : logo et barre de progression visible. */
export function EnTeteTunnel({ etape, total, libelle }: { etape: number; total: number; libelle: string }) {
  const pourcentage = Math.round((etape / total) * 100);
  return (
    <header className="border-b border-trait bg-papier">
      <Conteneur etroit className="pt-2 pb-3">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <span className="montant text-[12px] text-gris">{libelle}</span>
        </div>
        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-gris-clair"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pourcentage}
          aria-label={libelle}
        >
          <div className="h-full bg-vermillon transition-[width] duration-300" style={{ width: `${pourcentage}%` }} />
        </div>
      </Conteneur>
    </header>
  );
}
