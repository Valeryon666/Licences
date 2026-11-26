import type { ReactNode } from "react";
import { Conteneur, Logo } from "./ui";

export function PageLegale({ titre, maj, children }: { titre: string; maj: string; children: ReactNode }) {
  return (
    <main>
      <Conteneur etroit className="py-4">
        <Logo />
      </Conteneur>
      <Conteneur etroit className="pt-6 pb-8">
        <h1 className="font-serif text-[31px] leading-tight sm:text-[38px]">{titre}</h1>
        <p className="montant mt-2 text-[12px] text-gris">Dernière mise à jour : {maj}</p>
        <div className="mt-8 space-y-8 text-[16px] leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-[21px] [&_h2]:leading-tight [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:mt-2 [&_ul]:space-y-1">
          {children}
        </div>
      </Conteneur>
    </main>
  );
}
