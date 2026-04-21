# SITE_CONTENT_MAP.md — Carte de Données & Copywriting

> Projet : Landing Page Astro 5 — Dupont Plomberie
> Dernière mise à jour : 2026-04-21
> Audience : IA Marketeur, copywriter, responsable contenu

---

## Instructions Copywriting — Dupont Plomberie

**Client cible :**
- Particuliers parisiens (75, 92, 93, 94) confrontés à une urgence plomberie
- Gestionnaires de copropriété / syndics cherchant un prestataire de confiance
- Propriétaires bailleurs souhaitant un contrat d'entretien annuel

**Ton :** Rassurant et direct. Professionnel sans être froid — l'artisan de quartier qu'on peut appeler à 2h du matin. Concret : chiffres, délais, garanties plutôt qu'adjectifs vagues.

**Mots-clés à intégrer :** urgence, intervention rapide, certifié Qualibat, devis gratuit, 24h/24, Paris, transparent, garanti

**À éviter :** superlatifs sans preuve ("le meilleur"), anglicismes, phrases > 20 mots dans les titres, jargon technique inutile

**Longueurs recommandées :**

| Champ | Longueur idéale | Exemple |
|---|---|---|
| `title` Hero | 4–8 mots | "Intervention en 1h garantie" |
| `subtitle` / `description` section | 1 phrase, max 15 mots | "Artisan certifié Qualibat à Paris depuis 1998." |
| `description` feature | 1–2 phrases, bénéfice client explicite | "Détection et réparation sans destruction." |
| `quote` témoignage | 1–3 phrases, fait concret + résultat | "Intervention en 45 min un dimanche soir. Efficace, propre, au prix annoncé." |
| `answer` FAQ | 2–4 phrases, chiffres si possible | "Oui, 24h/24 et 7j/7. Supplément de 30€ entre 20h et 8h." |

---

## Inventaire des Pages

| Route | Layout | Fichier de données | Interface TS |
|---|---|---|---|
| `/` | MarketingLayout | `src/data/config.json` | `SiteConfig` |
| `/about` | MarketingLayout | `src/data/pages/about.json` | `AboutPageConfig` |
| `/contact` | MarketingLayout | `src/data/pages/contact.json` | `ContactPageConfig` |
| `/customers` | MarketingLayout | `src/data/pages/customers.json` | `CustomersPageConfig` |
| `/faq` | MarketingLayout | `src/data/pages/faq.json` | `FAQPageConfig` |
| `/features` | MarketingLayout | `src/data/pages/features.json` | `FeaturesPageConfig` |
| `/pricing` | MarketingLayout | `src/data/pages/pricing.json` | `PricingPageConfig` |
| `/testimonials` | MarketingLayout | `src/data/pages/testimonials.json` | `TestimonialsPageConfig` |
| `/privacy` | MarketingLayout | `src/data/pages/privacy.json` | `LegalPageConfig` |
| `/terms` | MarketingLayout | `src/data/pages/terms.json` | `LegalPageConfig` |
| `/403`, `/404`, `/500` | MarketingLayout | `src/data/pages/errors.json` | `ErrorsPageConfig` |

**Pages hors data-driven (intentionnel) :** `/login`, `/register`, `/forgot-password`, `/blog`, `/blog/[slug]`, `/dashboard` — ces pages ont leur propre logique ou sont hors scope copywriting.

---

## Page d'Accueil — `src/data/config.json`

### Variables modifiables

#### `global` — Identité de marque

```json
"global": {
  "name": "Dupont Plomberie",
  "tagline": "Votre plombier de confiance à Paris",
  "description": "Intervention rapide 24h/24 pour tous vos problèmes de plomberie.",
  "logo": "/logo.svg",
  "ogImage": "/images/og-dupont-plomberie.jpg",
  "url": "https://dupont-plomberie.fr",
  "seo": {
    "title": "Dupont Plomberie — Plombier d'urgence Paris 24h/24",
    "description": "Plombier certifié Qualibat. Intervention en 1h, devis gratuit, 24h/24 et 7j/7.",
    "image": "/images/og-dupont-plomberie.jpg",
    "keywords": ["plombier Paris", "urgence plomberie", "plombier 24h"]
  },
  "contact": {
    "email": "contact@dupont-plomberie.fr",
    "phone": "01 23 45 67 89",
    "address": "Paris, Île-de-France"
  }
}
```

#### `announcement` — Bandeau promotionnel

```json
"announcement": {
  "enabled": true,
  "id": "promo-printemps-2026",
  "text": "🔧 -20% sur tous les diagnostics ce mois-ci !",
  "href": "/contact",
  "linkText": "Prendre rendez-vous",
  "variant": "primary",
  "dismissible": true
}
```

#### `hero` — Section principale

```json
"hero": {
  "layout": "split",
  "title": "Intervention en 1h garantie",
  "subtitle": "Artisan certifié Qualibat à Paris depuis 1998.",
  "badge": "⚡ Disponible 24h/24",
  "foregroundImage": "/images/hero-plombier.jpg",
  "foregroundImageAlt": "Plombier en intervention",
  "backgroundType": "gradient",
  "gradient": "from-primary/10 via-background to-background",
  "primaryCTA": { "label": "Appeler maintenant", "href": "tel:0123456789" },
  "secondaryCTA": { "label": "Voir nos tarifs", "href": "#pricing" }
}
```

#### `logoCloud` — Certifications et partenaires

```json
"logoCloud": {
  "title": "Certifié et approuvé par",
  "logos": [
    { "name": "Qualibat", "src": "/logos/qualibat.svg" },
    { "name": "RGE", "src": "/logos/rge.svg" },
    { "name": "CAPEB", "src": "/logos/capeb.svg" }
  ],
  "variant": "default",
  "grayscale": true
}
```

#### `features` — Services principaux

```json
"features": {
  "title": "Tous les services de plomberie",
  "subtitle": "Du dépannage d'urgence à la rénovation complète.",
  "features": [
    { "icon": "lucide:zap", "title": "Urgence 24h/24", "description": "Intervention garantie en moins d'une heure, 7j/7." },
    { "icon": "lucide:droplets", "title": "Fuites & Dégâts des eaux", "description": "Détection et réparation sans destruction." },
    { "icon": "lucide:flame", "title": "Chauffe-eau & Chaudières", "description": "Installation, dépannage et entretien." }
  ],
  "footerLink": { "label": "Voir toutes nos prestations", "href": "/features" }
}
```

#### `stats` — Chiffres clés

```json
"stats": {
  "title": "Des chiffres qui parlent",
  "stats": [
    { "value": "25 ans", "label": "d'expérience" },
    { "value": "4800+", "label": "Interventions réalisées" },
    { "value": "98%", "label": "Clients satisfaits" },
    { "value": "< 1h", "label": "Délai d'intervention" }
  ],
  "columns": 4
}
```

#### `testimonials` — Avis clients

```json
"testimonials": {
  "title": "Ce que disent nos clients",
  "subtitle": "Plus de 500 avis vérifiés sur Google.",
  "testimonials": [
    {
      "author": "Marie Leclerc",
      "role": "Propriétaire",
      "company": "Paris 11e",
      "quote": "Intervention en 45 minutes un dimanche soir. Efficace, propre, et au prix annoncé !"
    }
  ],
  "limit": 3,
  "footerLink": { "label": "Lire tous les avis", "href": "https://g.page/dupont-plomberie" }
}
```

#### `pricing` — Grille tarifaire

```json
"pricing": {
  "title": "Tarifs clairs et sans surprise",
  "plans": [
    {
      "name": "Diagnostic",
      "monthlyPrice": 89,
      "description": "Pour identifier le problème avant d'agir.",
      "features": ["Visite diagnostic complète", "Rapport écrit", "Devis gratuit", "Déplacement inclus"],
      "cta": { "label": "Réserver", "href": "/contact" }
    },
    {
      "name": "Intervention Standard",
      "monthlyPrice": 189,
      "description": "La plupart des dépannages courants.",
      "features": ["Diagnostic inclus", "1h de main d'œuvre", "Pièces standard incluses", "Garantie 1 an"],
      "cta": { "label": "Réserver", "href": "/contact" },
      "highlighted": true
    },
    {
      "name": "Contrat Annuel",
      "monthlyPrice": null,
      "customPrice": "Sur devis",
      "description": "Pour les propriétaires et gestionnaires.",
      "features": ["Visites préventives x2/an", "Priorité d'intervention", "Remise 15% sur pièces"],
      "cta": { "label": "Nous contacter", "href": "/contact" }
    }
  ]
}
```

#### `cta` — Appel à l'action final

```json
"cta": {
  "title": "Une urgence ? On est là.",
  "description": "Fuite, canalisation bouchée, chauffe-eau HS — appelez-nous maintenant.",
  "action": { "label": "01 23 45 67 89", "href": "tel:0123456789" },
  "secondaryAction": { "label": "Envoyer un message", "href": "/contact" }
}
```

#### `faq` — Questions fréquentes

```json
"faq": {
  "title": "Questions fréquentes",
  "faqs": [
    { "question": "Intervenez-vous la nuit et le week-end ?", "answer": "Oui, 24h/24 et 7j/7. Supplément de 30€ entre 20h et 8h." },
    { "question": "Quelle est la zone d'intervention ?", "answer": "Tout Paris (75) et la petite couronne (92, 93, 94)." }
  ],
  "variant": "accordion"
}
```

---

## Page `/about` — `src/data/pages/about.json`

**Composants :** PageHeader, StatsSection, VideoEmbed, ValuesSection, TeamSection, ContentSection, CTA

| Clé JSON | Description |
|---|---|
| `seo.title`, `seo.description` | SEO de la page |
| `header.title`, `header.subtitle` | Titre et accroche de l'en-tête |
| `header.layout`, `header.foregroundImage` | Mode split ou centered, image droite |
| `stats.stats[]` | Chiffres clés (valeur + label) |
| `video.videoId` | ID YouTube/Vimeo (optionnel) |
| `values.title`, `values.items[]` | Section valeurs / engagements |
| `team.title`, `team.members[]` | Membres de l'équipe |
| `content.title`, `content.paragraphs[]` | Bloc texte libre |
| `cta.title`, `cta.action` | CTA de fin de page |

---

## Page `/contact` — `src/data/pages/contact.json`

**Composants :** PageHeader, ContactForm (données contactMethods/contactFAQs via `src/config`)

| Clé JSON | Description |
|---|---|
| `seo.title`, `seo.description` | SEO de la page |
| `header.title`, `header.subtitle` | Titre et accroche |
| `header.layout`, `header.foregroundImage` | Mode split ou centered |
| `formTitle` | Titre affiché au-dessus du formulaire |
| `methodsTitle` | Titre de la section "Autres moyens de contact" |
| `officeTitle` | Titre de la section adresse |
| `faqsTitle` | Titre de la section FAQ rapide |
| `faqsLink` | Lien "Voir toutes les FAQ" |

> Les coordonnées réelles (email, téléphone, adresse) viennent de `config.json → global.contact` et `src/config/index.ts`.

---

## Page `/customers` — `src/data/pages/customers.json`

**Composants :** PageHeader, StatsSection, CaseStudyCard, LogoCloud, CTA

| Clé JSON | Description |
|---|---|
| `seo.*` | SEO de la page |
| `header.*` | En-tête (layout, image, fond) |
| `stats.stats[]` | Chiffres clients (interventions, satisfaction…) |
| `featuredCases.cases[]` | Cas clients mis en avant (company, quote, author, metrics) |
| `gridCases.cases[]` | Grille de cas clients |
| `logoCloud.logos[]` | Logos clients / partenaires |
| `cta.*` | CTA de fin de page |

---

## Page `/faq` — `src/data/pages/faq.json`

**Composants :** PageHeader, FAQSection, CTA

| Clé JSON | Description |
|---|---|
| `seo.*` | SEO |
| `header.*` | En-tête |
| `faqs[]` | Liste plate de questions/réponses |
| `categories[]` | Alternative : FAQs groupées par catégorie |
| `variant` | `'accordion'` ou `'simple'` |
| `cta.*` | CTA de fin |

---

## Page `/features` — `src/data/pages/features.json`

**Composants :** PageHeader, FeatureHighlight, ValuesSection, BentoGrid, CTA

| Clé JSON | Description |
|---|---|
| `seo.*` | SEO |
| `header.*` | En-tête (layout split recommandé) |
| `highlight.features[]` | Features mises en avant (badge, titre, description, highlights, image, CTA) |
| `categories[]` | Groupes de features (ValuesSection par catégorie) |
| `bentoGrid.items[]` | Grille bento illustrative |
| `cta.*` | CTA de fin |

---

## Page `/pricing` — `src/data/pages/pricing.json`

**Composants :** PricingTable, TrustBadges, ComparisonTable, FAQSection, CTA

| Clé JSON | Description |
|---|---|
| `seo.*` | SEO |
| `plans[]` | Plans tarifaires (name, monthlyPrice, features[], cta, highlighted) |
| `annualDiscount` | % de remise annuelle |
| `guarantee.title`, `guarantee.description` | Garantie (ex: satisfait ou remboursé) |
| `badges[]` | Badges de confiance (icône + label) |
| `comparison.plans[]`, `comparison.categories[]` | Tableau comparatif |
| `faqs[]` | FAQ spécifique tarification |
| `cta.*` | CTA de fin |

---

## Page `/testimonials` — `src/data/pages/testimonials.json`

**Composants :** PageHeader, liste testimonials via `astro:content`, CTA

| Clé JSON | Description |
|---|---|
| `seo.*` | SEO |
| `header.*` | En-tête |
| `emptyMessage` | Message si aucun témoignage disponible |
| `cta.*` | CTA de fin |

> Les témoignages individuels viennent du Content Layer Astro (`src/content/testimonials/`), pas du JSON.

---

## Pages `/privacy` et `/terms` — `src/data/pages/privacy.json` / `terms.json`

| Clé JSON | Description |
|---|---|
| `seo.*` | SEO |
| `title` | Titre h1 de la page |
| `lastUpdated` | Date de dernière mise à jour (format "1er janvier 2026") |
| `intro` | Paragraphe d'introduction |
| `sections[]` | Sections : `heading?`, `subheading?`, `content?`, `items?[]` |
| `contactEmail` | Email DPO / contact légal |
| `address` | Adresse de l'entreprise |

---

## Déploiement pour un Nouveau Client

5 étapes pour adapter le site à un nouveau client :

1. **`src/data/config.json`** — remplacer toutes les sections (contenu page d'accueil + global + contact + announcement)
2. **`src/data/pages/*.json`** — remplacer le contenu de chaque page secondaire
3. **`src/config/site.ts`** — nom, URL de prod, ogImage, réseaux sociaux (lit config.json, env var `SITE_NAME` en override)
4. **`src/config/navigation.ts`** — liens du Header et Footer (statique, éditer ce fichier)
5. **Assets** → `/public/logo.svg`, `/public/images/og-*.jpg`, `/public/logos/*.svg`, `/public/images/hero-*.jpg`
