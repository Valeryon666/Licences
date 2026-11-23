"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Fleche } from "./ui";

/**
 * Bouton fixé en bas de l’écran sur mobile, à portée de pouce,
 * qui apparaît dès qu’on a fait défiler la page et qu’aucun bouton principal n’est visible.
 */
export function BarreAction({ href, libelle, cibles }: { href: string; libelle: string; cibles: string[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let image = 0;
    const mettreAJour = () => {
      image = 0;
      const hauteur = window.innerHeight;
      const unBoutonVisible = cibles.some((id) => {
        const r = document.getElementById(id)?.getBoundingClientRect();
        return Boolean(r && r.bottom > 0 && r.top < hauteur);
      });
      setVisible(window.scrollY > 480 && !unBoutonVisible);
    };
    const surDefilement = () => {
      if (!image) image = requestAnimationFrame(mettreAJour);
    };
    window.addEventListener("scroll", surDefilement, { passive: true });
    mettreAJour();
    return () => {
      window.removeEventListener("scroll", surDefilement);
      cancelAnimationFrame(image);
    };
  }, [cibles]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-trait bg-papier/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-transform duration-200 sm:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <Link
        href={href}
        tabIndex={visible ? 0 : -1}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-md bg-encre px-6 text-[17px] font-semibold text-papier"
      >
        {libelle}
        <Fleche />
      </Link>
    </div>
  );
}
