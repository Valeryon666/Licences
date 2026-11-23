"use client";

// L'état du diagnostic, gardé dans le navigateur du visiteur (localStorage).
// Rien n'est envoyé à un serveur.

import { useSyncExternalStore } from "react";
import type { LigneInventaire } from "./analyse";
import type { Reponses } from "./diagnostic";

export type Etat = {
  reponses: Reponses;
  effectifExact?: number;
  inventaire: LigneInventaire[];
};

const CLE = "licences:v1";
const VIDE: Etat = { reponses: {}, inventaire: [] };

let cache: Etat | null = null;
const abonnes = new Set<() => void>();

function nettoyer(brut: unknown): Etat {
  if (!brut || typeof brut !== "object") return VIDE;
  const b = brut as Record<string, unknown>;
  const reponses = b.reponses && typeof b.reponses === "object" ? (b.reponses as Reponses) : {};
  const inventaire = Array.isArray(b.inventaire)
    ? (b.inventaire as LigneInventaire[]).filter((l) => l && typeof l.id === "string")
    : [];
  const effectifExact = typeof b.effectifExact === "number" && b.effectifExact > 0 ? b.effectifExact : undefined;
  return { reponses, inventaire, effectifExact };
}

function lire(): Etat {
  if (cache) return cache;
  try {
    const brut = window.localStorage.getItem(CLE);
    cache = brut ? nettoyer(JSON.parse(brut)) : VIDE;
  } catch {
    cache = VIDE;
  }
  return cache;
}

export function modifier(maj: (e: Etat) => Etat): void {
  const suivant = maj(lire());
  cache = suivant;
  try {
    window.localStorage.setItem(CLE, JSON.stringify(suivant));
  } catch {
    // Navigation privée ou stockage plein : l'état reste en mémoire pour cette visite.
  }
  abonnes.forEach((f) => f());
}

function abonner(f: () => void): () => void {
  abonnes.add(f);
  const surStockage = (ev: StorageEvent) => {
    if (ev.key === CLE) {
      cache = null;
      f();
    }
  };
  window.addEventListener("storage", surStockage);
  return () => {
    abonnes.delete(f);
    window.removeEventListener("storage", surStockage);
  };
}

const rien = () => () => {};

/** [état, vrai une fois l'état du navigateur chargé] */
export function useEtat(): [Etat, boolean] {
  const etat = useSyncExternalStore(abonner, lire, () => VIDE);
  const pret = useSyncExternalStore(rien, () => true, () => false);
  return [etat, pret];
}
