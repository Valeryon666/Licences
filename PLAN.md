# Licences — plan de build

> Les logiciels payés par l'entreprise et utilisés par personne.

Ce fichier sert de mémoire au projet : où on en est, ce qui est décidé, ce qui reste à faire.

## Déjà en place

- Dépôt GitHub `Valeryon666/Licences`
- Projet Vercel `licences`, relié au dépôt. Adresse publique : https://licences-nine.vercel.app
- Comptes Supabase et Vercel existants (Supabase : déjà 2 projets actifs sur 2 autorisés en gratuit)

## Phase A — Encaisser (ce soir → demain)

Pas de base de données, pas de compte utilisateur. Tout le calcul se fait dans le navigateur du visiteur.

| Étape | Ce que tu vois tourner | Ton action |
|---|---|---|
| 1. Landing en ligne | La page d'accueil sur ton téléphone, avec mentions légales, CGV, confidentialité (champs `[À COMPLÉTER]`), page 404, aperçu de partage, mesure d'audience | 1 clic « Merge » sur GitHub |
| 2. Le tunnel | 3 questions → résultat chiffré → avant-goût : tu coches tes outils, il trouve les doublons et le coût par personne ; 2 trouvailles visibles, le reste verrouillé | Aucune |
| 3. Paywall + paiement test | Formules, garantie, FAQ, formulaire de carte Stripe sur le même écran, webhook signé, page d'accès débloquée | Créer le compte Stripe (mode test), coller 3 clés dans Vercel |
| 4. Passage en réel | Le même tunnel qui encaisse de vrais paiements ; résiliation via le portail client Stripe | Activer Stripe, passer Vercel en Pro |

Vérification du paiement : le webhook Stripe est signé et vérifié côté serveur ; la page d'accès interroge Stripe côté serveur (jamais les paramètres de l'URL seuls) ; à chaque visite, l'accès est revérifié auprès de Stripe, donc une résiliation referme l'accès d'elle-même.

## Phase B — Le produit (1 h/jour, environ 2 semaines)

| Étape | Contenu |
|---|---|
| 5. Comptes | Supabase : schéma (montré avant la migration), connexion par lien magique, page admin pour créer un client à la main avec données pré-remplies |
| 6. Inventaire | Outils, personnes, comptes attribués ; coût annuel par outil et par personne |
| 7. Relevés | Import du CSV de la banque → abonnements détectés automatiquement (CSV seulement, pas de PDF) |
| 8. Inutilisés et doublons | Comptes de personnes parties, licences payées non attribuées, outils de même fonction |
| 9. Rappels | Email à J-30 et J-7 avant chaque renouvellement annuel (tâche quotidienne Vercel + Resend) |
| 10. Vérification finale | Vitesse en 4G, aperçus de partage, paiement refusé, résiliation ; puis plan de lancement sur 14 jours |

## Services et coûts

| Service | Coût | Pourquoi |
|---|---|---|
| Vercel | Gratuit → **Pro 20 $/mois dès les paiements réels** | Les conditions de Vercel réservent l'offre gratuite à un usage non commercial |
| Stripe | 0 €/mois, environ 2 à 2,5 % + 0,25 € par paiement | Paiement + abonnement |
| Supabase | Gratuit | Il faudra mettre en pause un projet inutilisé (limite de 2 actifs) |
| Resend | Gratuit (3 000 emails/mois) | Rappels de renouvellement, phase B |
| Vercel Web Analytics | Gratuit | Sans cookie, donc sans bandeau de consentement |
| Nom de domaine | ~10 €/an, recommandé avant l'étape 9 | Crédibilité, et des emails qui n'arrivent pas en spam |

## Décisions prises (23/11)

1. Prix : 39 / 79 / 129 €/mois selon la taille (jusqu'à 20 / 21-50 / 51-100 personnes), 79 € mise en avant
2. Direction « relevé annoté » validée, vouvoiement
3. SIRET 993 212 323 00022
4. Garantie : 14 jours satisfait ou remboursé, remboursement lancé sous 48 h
5. Inventaire fait à la main à partir des relevés, sous 48 h ouvrées, pour les premiers clients

## Reste à fournir

- Nom et prénom (ou raison sociale), adresse postale, email de contact public, ville du tribunal → `lib/entreprise.ts`
- Confirmer : micro-entreprise et TVA non applicable (art. 293 B du CGI)

## Journal

- 23/11 — Plan rédigé.
- 23/11 — Étapes 1 à 3 codées : accueil, 3 questions, résultat, avant-goût, paywall avec paiement Stripe intégré, webhook signé, accès signé, portail client, pages légales, 404, image de partage. Testé sur iPhone simulé. Reste : clés Stripe dans Vercel et paiement de test.
