"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Fleche } from "./ui";

/**
 * Bouton fixé en bas de l'écran sur mobile, à portée de pouce,
 * qui apparaît quand les boutons principaux de la page ne sont plus visibles.
 */
export function BarreAction({ href, libelle, cibles }: { href: string; libelle: string; cibles: string[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elements = cibles.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    if (elements.length === 0) return;
    const visibles = new Set<Element>();
    const observateur = new IntersectionObserver((entrees) => {
      for (const e of entrees) {
        if (e.isIntersecting) visibles.add(e.target);
        else visibles.delete(e.target);
      }
      const premier = elements[0].getBoundingClientRect();
      setVisible(visibles.size === 0 && premier.bottom < 0);
    });
    elements.forEach((e) => observateur.observe(e));
    return () => observateur.disconnect();
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
