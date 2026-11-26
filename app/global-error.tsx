"use client";

// Dernier filet de sécurité, si la mise en page elle-même plante.
export default function ErreurGlobale({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: "#f7f5f0", color: "#14213d", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "64px 16px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30, lineHeight: 1.2 }}>Quelque chose s’est mal passé.</h1>
          <p style={{ fontSize: 17, color: "#615c53" }}>Le site rencontre un problème passager. Réessayez dans un instant.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <button
              type="button"
              onClick={reset}
              style={{ minHeight: 56, padding: "0 24px", background: "#14213d", color: "#f7f5f0", border: 0, borderRadius: 4, fontSize: 17, fontWeight: 600 }}
            >
              Réessayer
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ minHeight: 56, padding: "0 24px", display: "inline-flex", alignItems: "center", color: "#14213d", fontSize: 17 }}>
              Revenir à l’accueil
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
