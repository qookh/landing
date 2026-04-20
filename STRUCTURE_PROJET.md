# STRUCTURE_PROJET.md — Source de Vérité

> Projet : Landing Page Astro 5 + Tailwind CSS 4
> Dernière mise à jour : 2026-04-17 (post-QA final)
> But : référence exhaustive et auditée — props composants ↔ clés JSON ↔ SiteConfig.

**Interface TypeScript** : `src/types/config.ts` → `SiteConfig`
**Fichier de données** : `src/data/config.json`
**Page principale** : `src/pages/index.astro`

---

## Architecture Data-Flow

```
src/data/config.json
       │
       ▼  (cast as SiteConfig)
src/pages/index.astro
       │
       ├── Props normalisés (heroProps, featuresProps, etc.)
       ├── sectionOrder[] → ordre d'affichage configurable
       └── Spread props → <Composant {...props} background={bg(idx)} />
```

Le `background` de chaque section (alternance `default`/`muted`) est calculé **par index de position** dans `index.astro` et n'est **pas** configurable dans `config.json`. C'est un choix architectural intentionnel.

---

## 1. Configuration Interne (`src/config/`)

Ces fichiers alimentent le Header, Footer, SEO, et les composants qui ne passent pas par `config.json`.

| Fichier | Rôle | Ne pas confondre avec |
|---|---|---|
| `site.ts` | Nom, URL, logo, ogImage, réseaux sociaux | `global` de config.json |
| `navigation.ts` | Liens Header + Footer | `footer.columns` de config.json |
| `contact.ts` | Emails de contact | `global.contact` de config.json |
| `content.ts` | Annonce par défaut, newsletter interne | `announcement` de config.json |

> **Important :** `Header.astro` et `Footer.astro` lisent directement depuis `src/config/` — ils ne reçoivent **pas** de props depuis `config.json`. Pour changer navigation ou logo, modifier `src/config/site.ts` et `src/config/navigation.ts`.

---

## 2. SEO de la Page d'Accueil

Les métadonnées SEO viennent de `config.json → global.seo` et sont passées à `MarketingLayout` :

| Clé JSON | Prop MarketingLayout | Description |
|---|---|---|
| `global.seo.title` | `title` | Titre `<title>` complet |
| `global.seo.description` | `description` | Meta description |
| `global.seo.image` | `image` | Image Open Graph |
| `global.seo.keywords` | `tags` | Mots-clés `<meta name="keywords">` |

Fallbacks : si `seo.title` absent → `"${global.name} — ${global.description}"`. Si `seo.description` absent → `global.description`.

```json
"global": {
  "name": "Dupont Plomberie",
  "description": "Intervention rapide 24h/24 pour tous vos problèmes de plomberie.",
  "seo": {
    "title": "Dupont Plomberie — Plombier d'urgence Paris 24h/24",
    "description": "Plombier certifié Qualibat. Intervention en 1h, devis gratuit, 24h/24 et 7j/7.",
    "image": "/images/og-dupont-plomberie.jpg",
    "keywords": ["plombier Paris", "urgence plomberie", "plombier 24h"]
  }
}
```

---

## 3. Ordre des Sections

Par défaut, les sections s'affichent dans cet ordre :
`hero` → `logoCloud` → `features` → `howItWorks` → `featureHighlight` → `bentoGrid` → `integrations` → `stats` → `testimonials` → `pricing` → `comparisonTable` → `faq` → `cta` → `newsletter`

Pour personnaliser, ajouter `sectionOrder` à la racine de `config.json` :

```json
"sectionOrder": ["hero", "features", "stats", "testimonials", "pricing", "faq", "cta"]
```

Sections omises de `sectionOrder` ne s'affichent pas (même si leur clé existe dans config.json). Sections dont la clé est absente de config.json sont ignorées silencieusement.

---

## 4. Composants Marketing (`src/components/sections/marketing/`)

### `Hero.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `hero.title` | ✅ |
| `subtitle` | `string` | `hero.subtitle` | ✅ (fallback `''`) |
| `primaryCTA` | `{ label: string; href: string }` | `hero.primaryCTA` | ✅ (fallback Contact) |
| `secondaryCTA` | `{ label: string; href: string }` | `hero.secondaryCTA` | — |
| `backgroundType` | `'solid' \| 'gradient' \| 'image' \| 'video'` | `hero.backgroundType` | — |
| `backgroundImage` | `string` | `hero.backgroundSrc` *(si type=image)* | — |
| `backgroundVideo` | `string` | `hero.backgroundSrc` *(si type=video)* | — |
| `backgroundVideoPoster` | `string` | `hero.backgroundVideoPoster` | — |
| `gradient` | `string` | `hero.gradient` | — |
| `overlay` | `boolean` | `hero.overlay` | — |
| `overlayOpacity` | `number` | `hero.overlayOpacity` | — |
| `textColor` | `'auto' \| 'light' \| 'dark'` | `hero.textColor` | — |
| `minHeight` | `'default' \| 'screen' \| 'large'` | `hero.minHeight` | — |
| `align` | `'center' \| 'left'` | `hero.align` | — |

> **Note mapping** : `hero.backgroundSrc` est splitté en `backgroundImage` ou `backgroundVideo` par index.astro selon `backgroundType`. Ne pas mettre `backgroundImage`/`backgroundVideo` directement dans config.json.

```json
"hero": {
  "title": "Plombier d'urgence à Paris — Intervention en 1h",
  "subtitle": "Fuite, dégât des eaux, chauffe-eau en panne ? Notre équipe intervient 24h/24, 7j/7.",
  "primaryCTA": { "label": "Appeler maintenant", "href": "tel:0123456789" },
  "secondaryCTA": { "label": "Voir nos tarifs", "href": "#pricing" },
  "backgroundType": "gradient",
  "align": "center"
}
```

---

### `AnnouncementBar.astro`

> Alimenté par `MarketingLayout` depuis `src/config/content.ts`, **pas** depuis `config.json` directement. La clé `announcement` de config.json n'est pas encore branchée au layout.

| Clé JSON | Type | Description |
|---|---|---|
| `announcement.enabled` | `boolean` | Afficher ou masquer (contrôlé par le layout) |
| `announcement.id` | `string` | ID unique — changer pour reset dismiss localStorage |
| `announcement.text` | `string` | Texte de l'annonce |
| `announcement.href` | `string` | URL du lien optionnel |
| `announcement.linkText` | `string` | Texte du lien |
| `announcement.variant` | `'primary' \| 'secondary' \| 'gradient'` | Style visuel |
| `announcement.dismissible` | `boolean` | Afficher bouton de fermeture |

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

---

### `LogoCloud.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `logoCloud.title` | — |
| `logos` | `Array<{ name, src, href? }>` | `logoCloud.logos` | ✅ |
| `variant` | `'default' \| 'marquee' \| 'grid'` | `logoCloud.variant` | — |
| `grayscale` | `boolean` | `logoCloud.grayscale` | — |
| `pauseOnHover` | `boolean` | `logoCloud.pauseOnHover` | — |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `logoCloud.speed` | — |
| `columns` | `2 \| 3 \| 4 \| 5 \| 6` | `logoCloud.columns` | — |
| `logoSize` | `'sm' \| 'md' \| 'lg'` | `logoCloud.logoSize` | — |

```json
"logoCloud": {
  "title": "Certifié et approuvé par",
  "logos": [
    { "name": "Qualibat", "src": "/logos/qualibat.svg" },
    { "name": "RGE", "src": "/logos/rge.svg" },
    { "name": "CAPEB", "src": "/logos/capeb.svg" },
    { "name": "Décennale Pro", "src": "/logos/decennale.svg" }
  ],
  "variant": "default",
  "grayscale": true
}
```

---

### `FeaturesSection.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `features.title` | — |
| `subtitle` | `string` | `features.subtitle` | — |
| `features` | `Array<{ icon: string; title: string; description: string }>` | `features.features` | ✅ |
| `footerLink` | `{ label: string; href: string }` | `features.footerLink` | — |

> **Attention** : Le composant exige `icon: string` (non optionnel). Si absent dans config.json, index.astro applique le fallback `'lucide:check'`.

```json
"features": {
  "title": "Tous les services de plomberie",
  "subtitle": "Du dépannage d'urgence à la rénovation complète.",
  "features": [
    { "icon": "lucide:zap", "title": "Urgence 24h/24", "description": "Intervention garantie en moins d'une heure, 7j/7." },
    { "icon": "lucide:droplets", "title": "Fuites & Dégâts des eaux", "description": "Détection et réparation sans destruction." },
    { "icon": "lucide:flame", "title": "Chauffe-eau & Chaudières", "description": "Installation, dépannage et entretien." }
  ],
  "footerLink": { "label": "Voir toutes nos prestations", "href": "/services" }
}
```

---

### `HowItWorks.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `howItWorks.title` | — |
| `subtitle` | `string` | `howItWorks.subtitle` | — |
| `steps` | `Array<{ icon?, title, description, image? }>` | `howItWorks.steps` | ✅ |
| `variant` | `'horizontal' \| 'vertical' \| 'alternating'` | `howItWorks.variant` | — |
| `showNumbers` | `boolean` | `howItWorks.showNumbers` | — |

```json
"howItWorks": {
  "title": "Comment ça marche ?",
  "subtitle": "Une intervention simple en 3 étapes.",
  "steps": [
    { "icon": "lucide:phone", "title": "Appelez-nous", "description": "Devis téléphonique immédiat et gratuit." },
    { "icon": "lucide:truck", "title": "On arrive chez vous", "description": "Un plombier qualifié arrive en moins d'une heure." },
    { "icon": "lucide:check-circle", "title": "Problème résolu", "description": "Réparation effectuée. Garantie 2 ans sur les pièces." }
  ],
  "variant": "horizontal",
  "showNumbers": true
}
```

---

### `FeatureHighlight.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `featureHighlight.title` | — |
| `subtitle` | `string` | `featureHighlight.subtitle` | — |
| `features` | `Array<{ badge?, title, description, highlights?, image?, icon?, cta? }>` | `featureHighlight.features` | ✅ |
| `startImageLeft` | `boolean` | `featureHighlight.startImageLeft` | — |

```json
"featureHighlight": {
  "title": "Pourquoi choisir Dupont Plomberie ?",
  "subtitle": "25 ans d'expérience au service des Parisiens.",
  "features": [
    {
      "badge": "Notre engagement",
      "title": "Devis transparent, sans surprise",
      "description": "Le prix affiché est le prix payé, sans frais cachés.",
      "highlights": ["Devis gratuit en 5 min", "Prix fixe à l'avance", "Paiement après intervention"],
      "image": "/images/devis-transparent.jpg",
      "cta": { "label": "Demander un devis", "href": "/contact" }
    },
    {
      "badge": "Expertise",
      "title": "Artisans certifiés Qualibat",
      "description": "Toute notre équipe est certifiée et assurée décennale.",
      "highlights": ["Certification Qualibat", "Assurance décennale incluse", "Formation continue"],
      "image": "/images/certification.jpg"
    }
  ],
  "startImageLeft": true
}
```

---

### `BentoGrid.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `bentoGrid.title` | — |
| `subtitle` | `string` | `bentoGrid.subtitle` | — |
| `items` | `Array<{ size?, title, description, icon?, image?, accent?, href? }>` | `bentoGrid.items` | ✅ |

Valeurs `size` : `'small' | 'medium' | 'large'`
Valeurs `accent` : `'primary' | 'blue' | 'green' | 'purple' | 'orange'`

```json
"bentoGrid": {
  "title": "Notre savoir-faire en un coup d'œil",
  "items": [
    { "size": "large", "title": "Urgence 24h/24", "description": "Disponible nuit et jour.", "icon": "lucide:zap", "accent": "blue" },
    { "size": "small", "title": "Devis gratuit", "description": "En 5 minutes au téléphone.", "icon": "lucide:file-text" },
    { "size": "medium", "title": "Certifié Qualibat", "description": "Artisan reconnu.", "icon": "lucide:shield-check", "accent": "primary" }
  ]
}
```

---

### `IntegrationsGrid.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `integrations.title` | — |
| `subtitle` | `string` | `integrations.subtitle` | — |
| `integrations` | `Array<{ name, logo, category, description?, href?, featured? }>` | `integrations.integrations` | ✅ |
| `showFilter` | `boolean` | `integrations.showFilter` | — |
| `variant` | `'grid' \| 'compact' \| 'detailed'` | `integrations.variant` | — |
| `columns` | `3 \| 4 \| 5 \| 6` | `integrations.columns` | — |
| `invertOnDark` | `boolean` | `integrations.invertOnDark` | — |
| `footerLink` | `{ label: string; href: string }` | `integrations.footerLink` | — |

```json
"integrations": {
  "title": "Nos partenaires assurance & assistance",
  "integrations": [
    { "name": "HomeServe", "logo": "/logos/homeserve.svg", "category": "Assistance", "href": "https://homeserve.fr", "featured": true },
    { "name": "SOS Plomberie", "logo": "/logos/sos.svg", "category": "Urgence" }
  ],
  "showFilter": false,
  "variant": "grid",
  "columns": 4
}
```

---

### `CTA.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `cta.title` | ✅ |
| `description` | `string` | `cta.description` | ✅ (fallback `''`) |
| `action` | `{ label: string; href: string }` | `cta.action` | ✅ (fallback Contact) |
| `secondaryAction` | `{ label: string; href: string }` | `cta.secondaryAction` | — |

> **Note** : `description` et `action` sont requis par le composant mais optionnels en config. index.astro applique des fallbacks. Prévoir ces champs dans config.json.
> `tallyFormId` est prévu en config pour une future intégration Tally (non utilisé actuellement par le composant).

```json
"cta": {
  "title": "Une urgence ? On est là.",
  "description": "Fuite, canalisation bouchée, chauffe-eau HS — appelez-nous maintenant.",
  "action": { "label": "01 23 45 67 89", "href": "tel:0123456789" },
  "secondaryAction": { "label": "Envoyer un message", "href": "/contact" }
}
```

---

### `Newsletter.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `newsletter.title` | — |
| `description` | `string` | `newsletter.description` | — |
| `placeholder` | `string` | `newsletter.placeholder` | — |
| `buttonText` | `string` | `newsletter.buttonText` | — |
| `successMessage` | `string` | `newsletter.successMessage` | — |
| `errorMessage` | `string` | `newsletter.errorMessage` | — |
| `privacyNote` | `string` | `newsletter.privacyNote` | — |
| `action` | `string` | `newsletter.action` | — |
| `variant` | `'default' \| 'compact' \| 'card'` | `newsletter.variant` | — |

> `tallyFormId` prévu en config pour future intégration Tally.

```json
"newsletter": {
  "title": "Conseils plomberie gratuits",
  "description": "Recevez nos astuces pour entretenir vos installations.",
  "placeholder": "votre@email.fr",
  "buttonText": "S'abonner",
  "successMessage": "Merci ! Vous recevrez nos prochains conseils.",
  "errorMessage": "Une erreur est survenue. Réessayez.",
  "privacyNote": "Pas de spam. Désinscription en un clic."
}
```

---

## 5. Composants Social Proof (`src/components/sections/social-proof/`)

### `StatsSection.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `stats.title` | — |
| `subtitle` | `string` | `stats.subtitle` | — |
| `stats` | `Array<{ value: string; label: string; description?: string }>` | `stats.stats` | ✅ |
| `columns` | `2 \| 3 \| 4` | `stats.columns` | — |

> **Attention** : `value` est une chaîne — inclure le suffixe directement (`"25 ans"`, `"98%"`, `"< 1h"`). Il n'y a **pas** de champ `suffix` séparé.

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

---

### `TestimonialsSection.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `testimonials.title` | — |
| `subtitle` | `string` | `testimonials.subtitle` | — |
| `testimonials` | `Array<{ author, role, company, avatar?, quote }>` | `testimonials.testimonials` | ✅ |
| `limit` | `number` | `testimonials.limit` | — |
| `footerLink` | `{ label: string; href: string }` | `testimonials.footerLink` | — |

> **Attention** : Le composant exige `role: string` et `company: string` (non optionnels). Si absents en config, index.astro applique le fallback `''`. Le champ s'appelle **`author`**, pas `name`.

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
    },
    {
      "author": "Thomas Bernard",
      "role": "Gestionnaire",
      "company": "Syndic Haussmann",
      "quote": "Dupont Plomberie gère nos 3 immeubles depuis 8 ans. Professionnalisme exemplaire."
    }
  ],
  "limit": 3,
  "footerLink": { "label": "Lire tous les avis", "href": "https://g.page/dupont-plomberie" }
}
```

---

## 6. Composants Pricing (`src/components/sections/pricing/`)

### `PricingTable.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `pricing.title` | — |
| `subtitle` | `string` | `pricing.subtitle` | — |
| `plans` | `Array<PricingPlan>` | `pricing.plans` | ✅ |
| `annualDiscount` | `number` | `pricing.annualDiscount` | — |
| `defaultPeriod` | `'monthly' \| 'annual'` | `pricing.defaultPeriod` | — |
| `footerLink` | `{ label: string; href: string }` | `pricing.footerLink` | — |

**Structure PricingPlan :**

| Clé | Type | Notes |
|---|---|---|
| `name` | `string` | — |
| `monthlyPrice` | `number \| null` | `null` = plan sur devis |
| `customPrice` | `string` | Affiché si `monthlyPrice` est null |
| `description` | `string` | — |
| `features` | `string[]` | Liste des inclusions |
| `cta` | `{ label: string; href: string }` | — |
| `highlighted` | `boolean` | Badge "Most Popular" |
| `badge` | `string` | Texte badge personnalisé |

> **Attention** : Les champs sont `monthlyPrice` (pas `price`) et `highlighted` (pas `popular`).

```json
"pricing": {
  "title": "Tarifs clairs et sans surprise",
  "subtitle": "Des forfaits adaptés à chaque besoin.",
  "plans": [
    {
      "name": "Diagnostic",
      "monthlyPrice": 89,
      "description": "Pour identifier le problème avant d'agir.",
      "features": ["Visite diagnostic complète", "Rapport écrit", "Devis de réparation gratuit", "Déplacement inclus"],
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
      "description": "Pour les propriétaires et gestionnaires d'immeuble.",
      "features": ["Visites préventives x2/an", "Priorité d'intervention", "Remise 15% sur pièces", "Bilan technique annuel"],
      "cta": { "label": "Nous contacter", "href": "/contact" }
    }
  ],
  "footerLink": { "label": "Tous les tarifs et conditions", "href": "/tarifs" }
}
```

---

### `ComparisonTable.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `comparisonTable.title` | — |
| `subtitle` | `string` | `comparisonTable.subtitle` | — |
| `plans` | `string[]` | `comparisonTable.plans` | ✅ |
| `categories` | `Array<{ name, features[] }>` | `comparisonTable.categories` | ✅ |
| `highlightedPlan` | `number` | `comparisonTable.highlightedPlan` | — |

> **Attention** : `highlightedPlan` est un **index numérique** (0-based), pas un nom de plan.
> `values` dans chaque feature accepte `boolean | string` pour les cellules du tableau.

```json
"comparisonTable": {
  "title": "Comparez nos formules",
  "plans": ["Diagnostic", "Standard", "Annuel"],
  "highlightedPlan": 1,
  "categories": [
    {
      "name": "Inclus",
      "features": [
        { "name": "Déplacement", "values": [true, true, true] },
        { "name": "Garantie pièces", "values": [false, "1 an", "2 ans"] },
        { "name": "Priorité d'intervention", "values": [false, false, true] }
      ]
    }
  ]
}
```

---

## 7. Composants Contenu (`src/components/sections/content/`)

### `FAQSection.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `faq.title` | — |
| `subtitle` | `string` | `faq.subtitle` | — |
| `faqs` | `Array<{ question: string; answer: string }>` | `faq.faqs` | — |
| `categories` | `Array<{ name, faqs[] }>` | `faq.categories` | — |
| `variant` | `'accordion' \| 'simple'` | `faq.variant` | — |

> Utiliser soit `faqs` (liste plate) soit `categories` (groupées). Les deux sont optionnels, le composant gère les deux modes.

```json
"faq": {
  "title": "Questions fréquentes",
  "subtitle": "Tout ce que vous devez savoir avant de nous appeler.",
  "faqs": [
    { "question": "Intervenez-vous la nuit et le week-end ?", "answer": "Oui, 24h/24 et 7j/7. Supplément de 30€ entre 20h et 8h." },
    { "question": "Quelle est la zone d'intervention ?", "answer": "Tout Paris (75) et la petite couronne (92, 93, 94)." }
  ],
  "variant": "accordion"
}
```

---

## 8. Layout (`src/components/layout/`)

### `Header.astro` / `Footer.astro`

Ces composants **ne reçoivent pas de props** — ils lisent directement depuis `src/config/`.
Le `footer` de `config.json` n'est pas encore branché au composant `Footer.astro`.

### `AnnouncementBar.astro`

Alimenté par `MarketingLayout` depuis `siteConfig.announcement` (`src/config/content.ts`).
La clé `announcement` de `config.json` est stockée mais pas encore utilisée par le layout.

---

## 9. Composants Formulaires (`src/components/forms/`)

Ces composants sont **hors du flux config.json** — ils sont utilisés sur des pages dédiées (`/contact`, `/demo`).

| Composant | Rôle | Intégration Tally possible |
|---|---|---|
| `ContactForm.astro` | Formulaire de contact 5 champs | Remplacer par embed/popup Tally |
| `DemoRequestForm.astro` | Demande de devis / démo | Remplacer par embed/popup Tally |
| `LoginForm.astro` | Authentification | — |
| `RegisterForm.astro` | Inscription | — |
| `ForgotPasswordForm.astro` | Réinitialisation mdp | — |

**Intégration Tally future :** ajouter `tallyFormId` dans `cta`, `newsletter`, ou `pricing` de config.json. Les champs sont déjà définis dans `SiteConfig`.

---

## 10. Carte des Pages (`src/pages/`)

| Route | Layout | Composants principaux |
|---|---|---|
| `/` | MarketingLayout | Tous les composants via config.json + sectionOrder |
| `/features` | MarketingLayout | PageHeader, FeatureHighlight, BentoGrid |
| `/pricing` | MarketingLayout | PageHeader, PricingTable, ComparisonTable, FAQSection |
| `/contact` | MarketingLayout | PageHeader, ContactForm |
| `/demo` | MarketingLayout | PageHeader, DemoRequestForm |
| `/blog` | MarketingLayout | PageHeader, liste articles |
| `/blog/[slug]` | BlogLayout | Article content |
| `/login` | MarketingLayout | LoginForm |
| `/register` | MarketingLayout | RegisterForm |
| `/dashboard` | DashboardLayout | DashboardShell |

---

## 11. Résumé : Déployer pour un Nouveau Client

1. **`src/data/config.json`** — remplacer toutes les sections (seul fichier à toucher pour le contenu)
2. **`src/config/site.ts`** — nom, URL de prod, ogImage, réseaux sociaux
3. **`src/config/navigation.ts`** — liens du Header et Footer
4. **`src/config/contact.ts`** — emails de contact
5. **Assets** → `/public/logo.svg`, `/public/images/og-*.jpg`, `/public/logos/*.svg`

---

## 12. Pièges à Éviter (Champs renommés)

| ❌ Ancien nom (obsolète) | ✅ Nom correct | Affecte |
|---|---|---|
| `cta.text` / `action.text` | `label` | Tous les CTALink |
| `testimonials[].name` | `testimonials[].author` | TestimonialsSection |
| `pricing.plans[].price` | `pricing.plans[].monthlyPrice` | PricingTable |
| `pricing.plans[].popular` | `pricing.plans[].highlighted` | PricingTable |
| `stats[].suffix` | *(inclure dans `value`)* | StatsSection |
| `bentoGrid.items[].accentColor` | `bentoGrid.items[].accent` | BentoGrid |
| `comparisonTable.highlightedPlan: string` | `comparisonTable.highlightedPlan: number` | ComparisonTable |

---

## 13. Audit QA Final (2026-04-17)

Résultat des deux passes d'audit croisé composants ↔ SiteConfig :

| Composant | Statut | Correction appliquée |
|---|---|---|
| `Hero.astro` | ✅ | +5 props manquantes dans HeroConfig |
| `LogoCloud.astro` | ✅ | +3 props manquantes dans LogoCloudConfig |
| `FeaturesSection.astro` | ✅ | Fallback `icon ?? 'lucide:check'` dans index.astro |
| `HowItWorks.astro` | ✅ | Aucun écart |
| `FeatureHighlight.astro` | ✅ | +`icon?` ajouté aux items dans FeatureHighlightConfig |
| `BentoGrid.astro` | ✅ | `accentColor: string` → `accent: enum` + `href?` |
| `IntegrationsGrid.astro` | ✅ | +`invertOnDark`, `footerLink`, `featured`, type `columns` corrigé |
| `CTA.astro` | ✅ | Fallbacks `description ?? ''` et `action ?? {...}` dans index.astro |
| `Newsletter.astro` | ✅ | +`variant?` dans NewsletterConfig |
| `StatsSection.astro` | ✅ | Aucun écart |
| `TestimonialsSection.astro` | ✅ | Fallbacks `role ?? ''` et `company ?? ''` dans index.astro |
| `PricingTable.astro` | ✅ | Aucun écart |
| `ComparisonTable.astro` | ✅ | Interface créée de zéro (`ComparisonTableConfig`) |
| `FAQSection.astro` | ✅ | +`categories?` + `faqs` rendu optionnel |
| **`background` prop (tous)** | ✅ | Pattern architectural intentionnel — piloté par index.astro, absent de config.json |
| `tallyFormId` (config uniquement) | ℹ️ | Conservé dans CTAConfig, NewsletterConfig, PricingConfig pour future intégration Tally |
