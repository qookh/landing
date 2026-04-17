# STRUCTURE_PROJET.md — Source de Vérité

> Projet : Virex SaaS Landing Page (Astro 5 + Tailwind CSS 4)
> Généré le : 2026-04-17
> But : référence centralisée pour rendre chaque composant dynamique.
>
> **Interface TypeScript** : `src/types/config.ts` → `SiteConfig`
> **Fichier de données** : `src/data/config.json` (exemple plombier complet)

---

## 1. Configuration Centrale (`src/config/`)

Ces fichiers sont la **première source** à modifier pour personnaliser le site.

### `src/config/site.ts`
| Variable | Valeur par défaut | Env var |
|---|---|---|
| `name` | `"Virex"` | `SITE_NAME` |
| `description` | `"The modern platform for building and shipping faster"` | — |
| `url` | `"http://localhost:4321"` | `SITE_URL` |
| `author` | `"Virex Team"` | `SITE_AUTHOR` |
| `logo` | `"/logo.svg"` | — |
| `ogImage` | `"/images/og-image.png"` | — |
| `social.twitter` | `"https://twitter.com/virex"` | — |
| `social.github` | `"https://github.com/virex"` | — |
| `social.discord` | `"https://discord.gg/virex"` | — |
| `legal.privacyEmail` | — | — |
| `legal.legalEmail` | — | — |
| `legal.lastUpdated` | `"December 17, 2024"` | — |

### `src/config/content.ts`
| Variable | Valeur par défaut |
|---|---|
| `announcement.enabled` | `true` |
| `announcement.id` | `"launch-2025"` |
| `announcement.text` | `"🚀 Virex 2.0 is here!"` |
| `announcement.href` | `"/changelog"` |
| `announcement.linkText` | `"See what's new"` |
| `announcement.variant` | `"primary"` |
| `newsletter.title` | `"Stay in the loop"` |
| `newsletter.description` | `"Get the latest updates…"` |
| `newsletter.placeholder` | `"Enter your email"` |
| `newsletter.buttonText` | `"Subscribe"` |

### `src/config/contact.ts`
| Variable | Valeur par défaut |
|---|---|
| `email` | `"hello@virex.example.com"` |
| `supportEmail` | `"support@virex.example.com"` |
| `salesEmail` | `"sales@virex.example.com"` |
| `address` | `"123 Market Street, Suite 400, San Francisco, CA 94102"` |

### `src/config/navigation.ts`
| Zone | Liens |
|---|---|
| Header principal | Features, Pricing, Demo, Customers, Enterprise, Docs*, Blog* |
| Header CTA | Login (ghost), Get Started (primary) |
| Footer Product | Features, Integrations, Security, Pricing, FAQ |
| Footer Solutions | Enterprise, Customers, Request Demo, Status |
| Footer Resources | Documentation*, Blog*, Changelog*, Roadmap* |
| Footer Company | About, Careers, Contact, Testimonials* |

*Items marqués : visibilité contrôlée par `src/config/features.ts`

---

## 2. Layouts (`src/layouts/`)

| Fichier | Rôle | Props clés |
|---|---|---|
| `BaseLayout.astro` | Racine HTML, SEO, thème | `title`, `description`, `image`, `type` |
| `MarketingLayout.astro` | Page publique avec Header+Footer | Hérite de BaseLayout |
| `BlogLayout.astro` | Article de blog | — |
| `DashboardLayout.astro` | Interface app | — |
| `DocsLayout.astro` | Documentation | — |
| `ErrorLayout.astro` | Pages d'erreur | — |

---

## 3. Composants Marketing (`src/components/sections/marketing/`)

### `Hero.astro`
**Rôle** : Section hero principale de la landing page.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre principal (H1) |
| `subtitle` | `string` | Sous-titre / accroche |
| `badge` | `string` | Badge flottant au-dessus du titre |
| `primaryCTA` | `{ text, href }` | Bouton CTA principal |
| `secondaryCTA` | `{ text, href }` | Bouton secondaire (optionnel) |
| `backgroundType` | `solid\|gradient\|image\|video` | Type de fond |
| `backgroundSrc` | `string` | URL image/vidéo |
| `overlay` | `boolean` | Overlay sombre sur image/vidéo |
| `align` | `left\|center\|right` | Alignement du contenu |

```json
"hero": {
  "title": "Plombier d'urgence à Paris — Intervention en 1h",
  "subtitle": "Fuite, dégât des eaux, chauffe-eau en panne ? Notre équipe intervient 24h/24, 7j/7.",
  "badge": "⚡ Disponible 24h/24",
  "primaryCTA": { "text": "Appeler maintenant", "href": "tel:0123456789" },
  "secondaryCTA": { "text": "Voir nos tarifs", "href": "#pricing" },
  "backgroundType": "gradient",
  "align": "center"
}
```

---

### `AnnouncementBar.astro`
**Rôle** : Bandeau dismissible en haut de page.

| Prop | Type | Description |
|---|---|---|
| `enabled` | `boolean` | Afficher ou masquer |
| `id` | `string` | ID unique (persistance localStorage) |
| `text` | `string` | Texte de l'annonce |
| `href` | `string` | URL du lien |
| `linkText` | `string` | Texte du lien |
| `variant` | `primary\|secondary\|gradient` | Style |
| `dismissible` | `boolean` | Bouton de fermeture |

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
**Rôle** : Logos clients / certifications / partenaires.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre (ex: "Certifié par") |
| `logos` | `Array<{ name, src, href? }>` | Liste des logos |
| `variant` | `default\|marquee\|grid` | Style d'affichage |
| `grayscale` | `boolean` | Logos en niveaux de gris |
| `pauseOnHover` | `boolean` | Pause au survol (marquee) |

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

---

### `FeaturesSection.astro`
**Rôle** : Grille de fonctionnalités (icônes + texte).

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre de la section |
| `subtitle` | `string` | Sous-titre |
| `features` | `Array<{ icon, title, description }>` | Liste des features |
| `footerLink` | `{ text, href }` | Lien en bas de section |
| `background` | `string` | Variante de fond |

```json
"features": {
  "title": "Tous les services de plomberie",
  "subtitle": "Du dépannage d'urgence à la rénovation complète.",
  "features": [
    { "icon": "lucide:zap", "title": "Urgence 24h/24", "description": "Intervention garantie en moins d'une heure, 7j/7." },
    { "icon": "lucide:droplets", "title": "Fuites & Dégâts des eaux", "description": "Détection et réparation sans destruction." },
    { "icon": "lucide:flame", "title": "Chauffe-eau & Chaudières", "description": "Installation, dépannage et entretien." }
  ],
  "footerLink": { "text": "Voir toutes nos prestations", "href": "/services" }
}
```

---

### `HowItWorks.astro`
**Rôle** : Processus en étapes numérotées.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre de la section |
| `subtitle` | `string` | Sous-titre |
| `steps` | `Array<{ icon, title, description, image? }>` | Étapes du processus |
| `variant` | `horizontal\|vertical\|alternating` | Disposition |
| `showNumbers` | `boolean` | Afficher numéros |

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
**Rôle** : Sections alternées image/texte pour highlights produit.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre global |
| `subtitle` | `string` | Sous-titre |
| `features` | `Array<{ badge, title, description, highlights[], image, cta? }>` | Features avec images |
| `startImageLeft` | `boolean` | Commencer image à gauche |

```json
"featureHighlight": {
  "title": "Pourquoi choisir Dupont Plomberie ?",
  "features": [
    {
      "badge": "Notre engagement",
      "title": "Devis transparent, sans surprise",
      "description": "Le prix affiché est le prix payé, sans frais cachés.",
      "highlights": ["Devis gratuit en 5 min", "Prix fixe à l'avance", "Paiement après intervention"],
      "image": "/images/devis-transparent.jpg",
      "cta": { "text": "Demander un devis", "href": "/contact" }
    }
  ],
  "startImageLeft": true
}
```

---

### `BentoGrid.astro`
**Rôle** : Grille bento style moderne pour présenter des fonctionnalités.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre de la section |
| `subtitle` | `string` | Sous-titre |
| `items` | `Array<{ size, title, description, icon?, image?, accentColor }>` | Items de la grille |

Tailles disponibles : `small`, `medium`, `large`

```json
"bentoGrid": {
  "title": "Notre savoir-faire en un coup d'œil",
  "items": [
    { "size": "large", "title": "Urgence 24h/24", "description": "Disponible nuit et jour.", "icon": "lucide:zap", "accentColor": "blue" },
    { "size": "small", "title": "Devis gratuit", "description": "En 5 minutes au téléphone.", "icon": "lucide:file-text" },
    { "size": "medium", "title": "Certifié Qualibat", "description": "Artisan reconnu.", "icon": "lucide:shield-check" }
  ]
}
```

---

### `IntegrationsGrid.astro`
**Rôle** : Vitrine des intégrations / connecteurs.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre |
| `subtitle` | `string` | Sous-titre |
| `integrations` | `Array<{ name, logo, category, description?, href? }>` | Liste |
| `showFilter` | `boolean` | Filtre par catégorie |
| `variant` | `grid\|compact\|detailed` | Style d'affichage |

```json
"integrations": {
  "title": "Nos partenaires",
  "integrations": [
    { "name": "HomeServe", "logo": "/logos/homeserve.svg", "category": "Assistance", "href": "https://homeserve.fr" },
    { "name": "SOS Plomberie", "logo": "/logos/sos.svg", "category": "Urgence" }
  ],
  "showFilter": false,
  "variant": "grid"
}
```

---

### `Newsletter.astro`
**Rôle** : Formulaire d'inscription newsletter.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre |
| `description` | `string` | Description |
| `placeholder` | `string` | Placeholder email |
| `buttonText` | `string` | Texte bouton |
| `successMessage` | `string` | Message succès |
| `errorMessage` | `string` | Message erreur |
| `privacyNote` | `string` | Note confidentialité |
| `action` | `string` | URL endpoint (vide = démo) |
| `tallyFormId` | `string` | ID Tally (optionnel) |

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

## 4. Composants Social Proof (`src/components/sections/social-proof/`)

### `StatsSection.astro`
**Rôle** : Affichage de métriques / chiffres clés.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre de section |
| `subtitle` | `string` | Sous-titre |
| `stats` | `Array<{ value, label, suffix? }>` | Liste des métriques |
| `columns` | `2\|3\|4` | Nombre de colonnes |

```json
"stats": {
  "title": "Des chiffres qui parlent",
  "stats": [
    { "value": "25", "label": "Années d'expérience", "suffix": "ans" },
    { "value": "4800", "label": "Interventions réalisées", "suffix": "+" },
    { "value": "98", "label": "Clients satisfaits", "suffix": "%" },
    { "value": "1", "label": "Délai d'intervention", "suffix": "h" }
  ],
  "columns": 4
}
```

---

### `TestimonialsSection.astro`
**Rôle** : Grille de témoignages clients.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre |
| `subtitle` | `string` | Sous-titre |
| `testimonials` | `Array<{ name, role, company, avatar?, quote }>` | Témoignages |
| `limit` | `number` | Nombre max à afficher |
| `footerLink` | `{ text, href }` | Lien "Voir tous" |

```json
"testimonials": {
  "title": "Ce que disent nos clients",
  "subtitle": "Plus de 500 avis vérifiés sur Google.",
  "testimonials": [
    {
      "name": "Marie Leclerc",
      "role": "Propriétaire",
      "company": "Paris 11e",
      "quote": "Intervention en 45 minutes un dimanche soir. Efficace, propre, et au prix annoncé !"
    },
    {
      "name": "Thomas Bernard",
      "role": "Gestionnaire",
      "company": "Syndic Haussmann",
      "quote": "Dupont Plomberie gère nos 3 immeubles depuis 8 ans. Professionnalisme exemplaire."
    }
  ],
  "limit": 3,
  "footerLink": { "text": "Lire tous les avis", "href": "https://g.page/dupont-plomberie" }
}
```

---

## 5. Composants Pricing (`src/components/sections/pricing/`)

### `PricingTable.astro`
**Rôle** : Tableau de plans tarifaires avec toggle mensuel/annuel.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre |
| `subtitle` | `string` | Sous-titre |
| `plans` | `Array<{ name, price, annualPrice?, description, features[], cta, popular? }>` | Plans |
| `annualDiscount` | `number` | % réduction annuelle |
| `defaultPeriod` | `monthly\|annual` | Période par défaut |
| `footerLink` | `{ text, href }` | Lien bas (FAQ, contact) |
| `tallyFormId` | `string` | ID Tally (optionnel) |

`price: "custom"` pour les plans Enterprise / sur devis.

```json
"pricing": {
  "title": "Tarifs clairs et sans surprise",
  "plans": [
    {
      "name": "Diagnostic",
      "price": 89,
      "description": "Pour identifier le problème avant d'agir.",
      "features": ["Visite diagnostic complète", "Rapport écrit", "Devis de réparation gratuit"],
      "cta": { "text": "Réserver", "href": "/contact" }
    },
    {
      "name": "Intervention Standard",
      "price": 189,
      "description": "La plupart des dépannages courants.",
      "features": ["Diagnostic inclus", "1h de main d'œuvre", "Garantie 1 an"],
      "cta": { "text": "Réserver", "href": "/contact" },
      "popular": true
    },
    {
      "name": "Contrat Annuel",
      "price": "custom",
      "description": "Pour les propriétaires et gestionnaires.",
      "features": ["Visites préventives x2/an", "Priorité d'intervention", "Remise 15% sur pièces"],
      "cta": { "text": "Nous contacter", "href": "/contact" }
    }
  ],
  "footerLink": { "text": "Tous les tarifs et conditions", "href": "/tarifs" }
}
```

---

### `ComparisonTable.astro`
**Rôle** : Tableau comparatif de features par plan.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre |
| `subtitle` | `string` | Sous-titre |
| `plans` | `string[]` | Noms des plans |
| `categories` | `Array<{ name, features[] }>` | Catégories et features |
| `highlightedPlan` | `string` | Plan à mettre en avant |

```json
{
  "title": "Comparez nos formules",
  "plans": ["Diagnostic", "Standard", "Annuel"],
  "highlightedPlan": "Standard",
  "categories": [
    {
      "name": "Inclus",
      "features": [
        { "name": "Déplacement", "values": [true, true, true] },
        { "name": "Garantie pièces", "values": [false, "1 an", "2 ans"] }
      ]
    }
  ]
}
```

---

## 6. Composants CTA (`src/components/sections/marketing/`)

### `CTA.astro`
**Rôle** : Bloc d'appel à l'action avec fond coloré.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre CTA |
| `description` | `string` | Texte descriptif |
| `action` | `{ text, href }` | Bouton principal |
| `secondaryAction` | `{ text, href }` | Bouton secondaire |
| `tallyFormId` | `string` | ID Tally (popup au clic) |

```json
"cta": {
  "title": "Une urgence ? On est là.",
  "description": "Fuite, canalisation bouchée, chauffe-eau HS — appelez-nous maintenant.",
  "action": { "text": "01 23 45 67 89", "href": "tel:0123456789" },
  "secondaryAction": { "text": "Envoyer un message", "href": "/contact" }
}
```

---

## 7. Composants Contenu (`src/components/sections/content/`)

### `FAQSection.astro`
**Rôle** : Accordéon de questions fréquentes.

| Prop | Type | Description |
|---|---|---|
| `title` | `string` | Titre |
| `subtitle` | `string` | Sous-titre |
| `faqs` | `Array<{ question, answer, category? }>` | Questions/réponses |
| `variant` | `accordion\|simple` | Style d'affichage |

```json
"faq": {
  "title": "Questions fréquentes",
  "faqs": [
    {
      "question": "Intervenez-vous la nuit et le week-end ?",
      "answer": "Oui, 24h/24 et 7j/7. Un supplément de 30€ s'applique entre 20h et 8h."
    },
    {
      "question": "Quelle est la zone d'intervention ?",
      "answer": "Tout Paris (75) et la petite couronne (92, 93, 94)."
    }
  ],
  "variant": "accordion"
}
```

---

## 8. Composants Formulaires (`src/components/forms/`)

### `ContactForm.astro`
**Rôle** : Formulaire de contact.

| Champ | Type | Options |
|---|---|---|
| `firstName` | text | — |
| `lastName` | text | — |
| `email` | email | — |
| `subject` | select | General inquiry, Sales & pricing, Technical support, Enterprise solutions, Partnership opportunities |
| `message` | textarea | — |

**Props** : `action` (URL endpoint), mode Netlify Forms supporté.

**Note Tally** : Remplacer par `<tally-widget formId="XXXX" />` pour intégrer un formulaire Tally.

---

### `DemoRequestForm.astro`
**Rôle** : Formulaire de demande de devis / démo.

| Champ | Type | Options |
|---|---|---|
| `firstName` | text | — |
| `lastName` | text | — |
| `email` | email | — |
| `company` | text | — |
| `teamSize` | select | 1-10, 11-50, 51-200, 200+ |
| `message` | textarea | Optionnel |

---

### `LoginForm.astro` / `RegisterForm.astro` / `ForgotPasswordForm.astro`
**Rôle** : Authentification utilisateur.
Tous supportent : mode démo, Netlify Identity, endpoint custom via prop `action`.

---

## 9. Composants Layout (`src/components/layout/`)

### `Header.astro`
- Navigation générée depuis `src/config/navigation.ts`
- Theme toggle intégré
- Menu mobile hamburger
- Feature flags pour masquer/afficher des liens

### `Footer.astro`
- Colonnes générées depuis `src/config/navigation.ts`
- Copyright calculé dynamiquement (année courante)
- Liens sociaux depuis `src/config/site.ts`

```json
"footer": {
  "description": "Artisan plombier certifié Qualibat à Paris depuis 1998. Urgence 24h/24.",
  "columns": [
    {
      "title": "Services",
      "links": [
        { "label": "Urgence plomberie", "href": "/urgence" },
        { "label": "Chauffe-eau", "href": "/chauffe-eau" }
      ]
    }
  ],
  "legal": {
    "privacyUrl": "/confidentialite",
    "termsUrl": "/mentions-legales",
    "copyright": "© 2026 Dupont Plomberie. Tous droits réservés."
  }
}
```

---

## 10. Note sur Tally

**Aucun formulaire Tally détecté** dans le projet actuel.
Tous les formulaires sont des composants Astro natifs.

Pour intégrer Tally, les points d'entrée sont :
- `ContactForm.astro` → remplacer par embed Tally ou popup
- `DemoRequestForm.astro` → idem
- `Newsletter.astro` → prop `tallyFormId` prévue dans `SiteConfig`
- `CTA.astro` → prop `tallyFormId` pour popup au clic du bouton

Ajouter `tallyFormId: string` dans la section concernée de `src/data/config.json`.

---

## 11. Carte des Pages (`src/pages/`)

| Route | Layout | Composants principaux |
|---|---|---|
| `/` | MarketingLayout | Hero, FeaturesSection, PricingTable, TestimonialsSection, CTA |
| `/features` | MarketingLayout | PageHeader, FeatureHighlight, BentoGrid |
| `/pricing` | MarketingLayout | PageHeader, PricingTable, ComparisonTable, FAQ |
| `/contact` | MarketingLayout | PageHeader, ContactForm |
| `/demo` | MarketingLayout | PageHeader, DemoRequestForm |
| `/blog` | MarketingLayout | PageHeader, article list |
| `/blog/[slug]` | BlogLayout | Article content |
| `/login` | MarketingLayout | LoginForm |
| `/register` | MarketingLayout | RegisterForm |
| `/dashboard` | DashboardLayout | DashboardShell + Dashboard UI |

---

## 12. Résumé : Variables Prioritaires à Personnaliser

Pour adapter ce template à un produit spécifique, modifier dans l'ordre :

1. `src/data/config.json` → toutes les sections (objet `SiteConfig`)
2. `src/config/site.ts` → nom, description, URL, réseaux sociaux (fallback env vars)
3. `src/config/navigation.ts` → liens de navigation
4. `src/config/contact.ts` → emails, adresse
5. Assets → `/public/logo.svg`, `/public/images/og-image.png`

**Interface TypeScript** : `src/types/config.ts` → `SiteConfig`
**Exemple complet** : `src/data/config.json` (plombier Dupont Plomberie)
