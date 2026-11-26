// Exports générés dans le navigateur : inventaire en CSV (Excel), calendrier des renouvellements (.ics).

import { FONCTIONS } from "./catalogue";
import type { LigneCalculee } from "./analyse";

function telecharger(nomFichier: string, contenu: string, type: string): void {
  const blob = new Blob([contenu], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomFichier;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function celluleCsv(v: string | number): string {
  const s = typeof v === "number" ? v.toFixed(2).replace(".", ",") : v;
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exporterCsv(lignes: LigneCalculee[]): void {
  const entete = [
    "Outil",
    "Fonction",
    "Comptes",
    "Prix par compte et par mois (€)",
    "Coût annuel (€)",
    "Coût annuel par compte (€)",
    "Prochain renouvellement",
  ];
  const rangs = lignes.map((l) => [
    l.outil.nom,
    l.outil.fonctions.map((f) => FONCTIONS[f]).join(" / "),
    String(l.comptes),
    l.prixMois,
    l.coutAn,
    l.coutParCompteAn,
    l.renouvellement ? l.renouvellement.split("-").reverse().join("/") : "",
  ]);
  const csv = [entete, ...rangs].map((r) => r.map(celluleCsv).join(";")).join("\r\n");
  telecharger("licences-inventaire.csv", "\uFEFF" + csv, "text/csv;charset=utf-8");
}

function texteIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function exporterCalendrier(lignes: LigneCalculee[]): number {
  const avecDate = lignes.filter((l) => l.renouvellement && /^\d{4}-\d{2}-\d{2}$/.test(l.renouvellement));
  const maintenant = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const evenements = avecDate.map((l) => {
    const jour = l.renouvellement!.replace(/-/g, "");
    const cout = Math.round(l.coutAn).toLocaleString("fr-FR");
    return [
      "BEGIN:VEVENT",
      `UID:licences-${l.id}-${jour}@licences`,
      `DTSTAMP:${maintenant}`,
      `DTSTART;VALUE=DATE:${jour}`,
      "RRULE:FREQ=YEARLY",
      `SUMMARY:${texteIcs(`Renouvellement : ${l.outil.nom}`)}`,
      `DESCRIPTION:${texteIcs(`${l.comptes} comptes, environ ${cout} € par an.\nAvant cette date : garder, réduire le nombre de comptes ou résilier.`)}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${texteIcs(`${l.outil.nom} se renouvelle dans 30 jours`)}`,
      "TRIGGER:-P30D",
      "END:VALARM",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${texteIcs(`${l.outil.nom} se renouvelle dans 7 jours`)}`,
      "TRIGGER:-P7D",
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Licences//Renouvellements//FR",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Renouvellements des logiciels",
    ...evenements,
    "END:VCALENDAR",
  ].join("\r\n");
  if (avecDate.length > 0) telecharger("licences-renouvellements.ics", ics, "text/calendar;charset=utf-8");
  return avecDate.length;
}
