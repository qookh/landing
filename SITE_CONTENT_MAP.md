# SITE_CONTENT_MAP.md — Carte de Données & Copywriting

> Projet : Landing Page One-Page — Rizset Plomberie Montpellier
> Dernière mise à jour : 2026-06-03
> Audience : IA Marketeur, copywriter, responsable contenu

---

## Instructions Copywriting — Rizset Plomberie

**Client cible :**
- Particuliers montpelliérains (34) confrontés à une urgence plomberie
- Gestionnaires de copropriété / syndics cherchant un prestataire de confiance
- Propriétaires bailleurs souhaitant un contrat d'entretien annuel

**Ton :** Rassurant et direct. Professionnel sans être froid — l'artisan de quartier qu'on appelle à 2h du matin. Concret : chiffres, délais, garanties plutôt qu'adjectifs vagues. Parler à la 1re personne pour renforcer la proximité ("je vous recontacte", "je vous rappelle").

**Mots-clés à intégrer :** urgence, intervention rapide, certifié Qualibat, devis gratuit, 24h/24, Montpellier, transparent, garanti

**À éviter :** superlatifs sans preuve, anglicismes, phrases > 20 mots dans les titres, jargon technique inutile

**Longueurs recommandées :**

| Champ | Longueur idéale | Exemple |
|---|---|---|
| `title` Hero | 4–8 mots | "Plombier à Montpellier, intervention en 1h" |
| `subtitle` section | 1 phrase, max 15 mots | "Artisan certifié Qualibat. Devis gratuit, 7j/7." |
| `description` feature | 1–2 phrases, bénéfice client | "Détection et réparation sans destruction." |
| `quote` témoignage | 1–3 phrases, fait concret + résultat | "Arrivé en 40 min un samedi soir. Propre, efficace, au prix annoncé." |
| `answer` FAQ | 2–4 phrases, chiffres si possible | "Oui, 24h/24 et 7j/7. Supplément de 35 € entre 20h et 8h." |

---

## Parcours de Conversion

```
Visiteur
  │
  ├─ Header CTA "Demander un devis" → Pop-up Tally (2E7d7V) ← conversion instantanée
  │
  ├─ Nav ancres → #features / #pricing / #testimonials / #faq (scroll fluide)
  │
  ├─ Sections pricing / CTA → /contact (page dédiée avec Tally embed)
  │
  └─ Contact page → Tally embed natif (fallback desktop/mobile)
```

---

## Architecture — One-Page

```
src/data/config.json
       │
       ▼  sectionOrder: ["hero", "logoCloud", "features", "pricing", "testimonials", "faq", "cta"]
src/pages/index.astro
       ├── sections features/pricing/testimonials/faq → <div id="…" class="scroll-mt-20">
       └── Ancres header (#features, #pricing, #testimonials, #faq) → scroll fluide
```

---

## Inventaire des Pages

| Route | Rôle | Fichier de données |
|---|---|---|
| `/` | Landing page one-page | `src/data/config.json` |
| `/contact` | Questionnaire devis (Tally embed) | aucun JSON — hardcodé |
| `/privacy` | Politique de confidentialité | `src/data/pages/privacy.json` |
| `/terms` | Mentions légales | `src/data/pages/terms.json` |
| `/403`, `/404`, `/500` | Pages d'erreur | `src/data/pages/errors.json` |

---

## Page d'Accueil — `src/data/config.json`

### `global` — Identité de marque

| Clé | Valeur actuelle | À personnaliser |
|---|---|---|
| `global.name` | `"Rizset Plomberie"` | Nom de l'enseigne |
| `global.tagline` | `"Votre plombier de confiance à Montpellier"` | Accroche courte |
| `global.contact.phone` | `"06 00 00 00 00"` | ✅ Numéro réel |
| `global.contact.address.city` | `"Montpellier"` | Ville |
| `global.seo.title` | Titre `<title>` | ✅ SEO local |
| `global.seo.keywords` | `["plombier Montpellier", …]` | Mots-clés locaux |

### `announcement` — Bandeau d'urgence

```json
"announcement": {
  "enabled": true,
  "id": "urgence-contact-2026",
  "text": "🔧 Une urgence ? Remplissez notre formulaire pour une intervention rapide !",
  "href": "/contact",
  "linkText": "Formulaire de contact",
  "variant": "primary",
  "dismissible": true
}
```
> Changer `id` pour réinitialiser le dismiss localStorage côté client (les anciens visiteurs reverront le bandeau).

### `hero` — Section principale

| Clé | Description |
|---|---|
| `hero.title` | Promesse principale — 4–8 mots |
| `hero.subtitle` | Accroche — 1 phrase, bénéfice immédiat |
| `hero.badge` | Badge urgence |
| `hero.primaryCTA.href` | `tel:+33XXXXXXXXX` — numéro urgence |
| `hero.secondaryCTA.href` | `/contact` — formulaire devis |
| `hero.foregroundImage` | Image plombier en intervention (split layout) |

### `features` — Services (ancre `#features`)

6 items max. `icon` (lucide), `title` (2–4 mots), `description` (1–2 phrases, bénéfice client).

### `pricing` — Grille tarifaire (ancre `#pricing`)

3 plans. Plan mis en avant : `"highlighted": true` + `"badge": "Le plus demandé"`.
Tous les CTAs pointent vers `/contact`.

### `testimonials` — Avis clients (ancre `#testimonials`)

3 témoignages locaux Montpellier. Champs : `author`, `role`, `company` (quartier), `quote`.

### `faq` — Questions fréquentes (ancre `#faq`)

5 questions clés : horaires, zone, prix, délai, certification.

### `cta` — Appel à l'action final

```json
"cta": {
  "title": "Besoin d'un plombier maintenant ?",
  "action": { "label": "📞 Appeler le 06 XX XX XX XX", "href": "tel:+33XXXXXXXXX" },
  "secondaryAction": { "label": "Demander un devis gratuit", "href": "/contact" },
  "tallyFormId": "2E7d7V"
}
```

---

## Page `/contact` — Questionnaire Tally (réhumanisée)

Page dédiée à la capture de leads. Hardcodée dans `src/pages/contact.astro`.

| Élément | Valeur |
|---|---|
| Layout PageHeader | `split` — image artisan à droite |
| Fond | `backgroundType="solid" background="muted"` → texte sombre, contraste maximal |
| Titre | "Demande de devis gratuit" |
| Sous-titre | "Vous préférez le téléphone ? Appelez-moi directement au 04 67 00 00 00. Sinon, remplissez ce questionnaire en 2 minutes et je vous recontacte avec une estimation claire sous 30 minutes." |
| Image | `/images/header-contact.jpg` — photo artisan, chaleureuse |
| Formulaire embed | Tally `2E7d7V` — `dynamicHeight=1` |

> **Copywriting** : la 1re personne ("je vous recontacte") humanise la page et réduit la distance. Le numéro de téléphone visible dans le sous-titre est un filet de sécurité pour les visiteurs qui préfèrent l'appel direct.

> **Contraste** : ne jamais utiliser `backgroundType="gradient"` avec un gradient clair sur PageHeader — le composant force automatiquement `text-white` sur tous les gradients. Utiliser `backgroundType="solid"` pour garantir un texte lisible sur fond clair.

Pour changer le formulaire Tally : modifier l'ID `2E7d7V` dans l'URL embed de `contact.astro`.

---

## Convention de Nommage des Images

| Dossier | Pattern | Exemples |
|---|---|---|
| `/public/images/` | `hero-*.jpg` | `hero-plombier-index.jpg` |
| `/public/images/` | `header-*.jpg` | `header-contact.jpg` |
| `/public/images/` | `og-*.jpg` | `og-rizset-plomberie.jpg` |
| `/public/images/realisations/` | `<intervention>-<etat>.jpg` | `fuite-reparee.jpg`, `chauffe-eau-installe.jpg` |
| `/public/logos/` | `<certif>.png/.jpg` | `qualibat.jpg`, `rge.png` |

**Règles** :
- Toujours utiliser des chemins absolus commençant par `/` (ex: `/images/logos/qualibat.jpg`, jamais `images/logos/qualibat.jpg`).
- Ne jamais créer de sous-dossiers supplémentaires hors ceux listés ci-dessus.
- Respecter strictement ces patterns pour la cohérence avec les chemins référencés dans `config.json`.

---

## Navigation (Header)

| Lien | Destination | Type |
|---|---|---|
| Nos Services | `/#features` | Ancre absolue (fonctionne depuis toutes les pages) |
| Tarifs | `/#pricing` | Ancre absolue |
| Avis Clients | `/#testimonials` | Ancre absolue |
| FAQ | `/#faq` | Ancre absolue |
| Contact | `/contact` | Lien direct |
| **Demander un devis** (CTA) | `/contact` | Bouton primaire |

> **Règle** : utiliser `/#section` (chemin absolu) et non `#section` (relatif) — les ancres relatives sont brisées depuis les pages secondaires comme `/contact`.

---

## Pages Légales

| Page | Fichier | Clés modifiables |
|---|---|---|
| `/privacy` | `src/data/pages/privacy.json` | `title`, `lastUpdated`, `intro`, `sections[]`, `contactEmail`, `address` |
| `/terms` | `src/data/pages/terms.json` | Idem |

---

## Déploiement pour un Nouveau Client

1. **`src/data/config.json`** — `global` (nom, ville, contact, SEO) + tout le contenu des sections
2. **`src/config/navigation.ts`** — mettre à jour le `tallyFormId` et le numéro `tel:` dans le CTA header
3. **`src/pages/contact.astro`** — remplacer l'ID Tally `2E7d7V` + numéro de téléphone dans le sous-titre + image artisan
4. **`src/data/pages/privacy.json` et `terms.json`** — mettre à jour les mentions légales
5. **Assets** → `/public/logo.svg`, `/public/images/og-*.jpg`, `/public/images/hero-*.jpg`, `/public/images/artisan-contact.jpg`
