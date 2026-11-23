"use client";

import { useState } from "react";

export function CopierLien({ lien }: { lien: string }) {
  const [copie, setCopie] = useState(false);
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        readOnly
        value={lien}
        aria-label="Votre lien d’accès personnel"
        onFocus={(e) => e.currentTarget.select()}
        className="montant h-12 min-w-0 flex-1 rounded-md border border-trait-fort bg-papier px-3 text-[13px]"
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(lien);
            setCopie(true);
            setTimeout(() => setCopie(false), 2500);
          } catch {
            setCopie(false);
          }
        }}
        className="inline-flex min-h-12 items-center justify-center rounded-md border border-encre px-5 text-[15px] font-semibold hover:bg-gris-clair"
      >
        {copie ? "Lien copié" : "Copier le lien"}
      </button>
    </div>
  );
}
