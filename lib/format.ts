const euros0 = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const euros2 = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const nombre = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 4 080 € */
export function eur(montant: number): string {
  return euros0.format(Math.round(montant));
}

/** 2,60 € */
export function eurCentimes(montant: number): string {
  return euros2.format(montant);
}

export function nb(n: number): string {
  return nombre.format(n);
}

/** Arrondi à la dizaine, pour ne pas afficher une fausse précision. */
export function arrondi10(montant: number): number {
  return Math.round(montant / 10) * 10;
}

/** « 1 compte », « 3 comptes » */
export function pluriel(n: number, singulier: string, plurielForme?: string): string {
  return `${nb(n)} ${n > 1 ? (plurielForme ?? singulier + "s") : singulier}`;
}
