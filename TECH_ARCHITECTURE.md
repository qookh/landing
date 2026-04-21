# TECH_ARCHITECTURE.md — Architecture Technique

> Projet : Landing Page Astro 5 + Tailwind CSS 4 — Dupont Plomberie
> Dernière mise à jour : 2026-04-21
> Audience : développeur, IA technique

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

| Fichier | Rôle | Source de données |
|---|---|---|
| `site.ts` | Nom, URL, logo, ogImage, réseaux sociaux | Lit `config.json → global` + env var `SITE_NAME` |
| `navigation.ts` | Liens Header + Footer | Statique (éditer ce fichier) |
| `index.ts` | Ré-exporte `contact`, `contactMethods`, `contactFAQs`, `announcement`, `content` | Source unique : `config.json` |

> `contact.ts` et `content.ts` ont été supprimés — toutes ces données viennent de `src/data/config.json`. `Header.astro` et `Footer.astro` lisent depuis `src/config/` — ils ne reçoivent **pas** de props depuis `config.json`. Pour changer navigation ou logo : `src/config/site.ts` et `src/config/navigation.ts`.

---

## 2. SEO de la Page d'Accueil

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

Par défaut : `hero` → `logoCloud` → `features` → `howItWorks` → `featureHighlight` → `bentoGrid` → `integrations` → `stats` → `testimonials` → `pricing` → `comparisonTable` → `faq` → `cta` → `newsletter`

Pour personnaliser, ajouter `sectionOrder` à la racine de `config.json` :

```json
"sectionOrder": ["hero", "features", "stats", "testimonials", "pricing", "faq", "cta"]
```

Sections omises de `sectionOrder` ne s'affichent pas même si leur clé existe. Sections dont la clé est absente de config.json sont ignorées silencieusement.

---

## 4. Composants Marketing (`src/components/sections/marketing/`)

### `Hero.astro`

| Prop composant | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `hero.title` | ✅ |
| `subtitle` | `string` | `hero.subtitle` | ✅ (fallback `''`) |
| `primaryCTA` | `{ label: string; href: string }` | `hero.primaryCTA` | ✅ (fallback Contact) |
| `secondaryCTA` | `{ label: string; href: string }` | `hero.secondaryCTA` | — |
| `badge` | `string` | `hero.badge` | — |
| `layout` | `'centered' \| 'split'` | `hero.layout` | — |
| `foregroundImage` | `string` | `hero.foregroundImage` | — |
| `foregroundImageAlt` | `string` | `hero.foregroundImageAlt` | — |
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

#### Modes d'affichage (`layout`)

Disponible sur **Hero** et **PageHeader**. Le fond fonctionne **identiquement dans les deux modes**.

| Valeur | Desktop | Mobile | Fallback |
|---|---|---|---|
| `'centered'` *(défaut)* | Texte centré, fond plein écran | Identique | — |
| `'split'` | Grille 2 colonnes (texte gauche, image droite) | **Texte en haut** (ordre DOM naturel), image réduite en bas | Si `foregroundImage` absent → bascule sur `'centered'` |

**Contraintes d'image responsives :**

| Composant | Mobile | Desktop |
|---|---|---|
| `Hero` | `h-56` (224 px), `w-full`, `object-cover` | auto, `max-h-[480px]`, `object-cover`, `rounded-2xl shadow-2xl` |
| `PageHeader` | `h-40` (160 px), `w-full`, `object-cover` | auto, `max-h-[340px]`, `object-cover`, `rounded-xl shadow-lg` |

---

### `AnnouncementBar.astro`

> Alimenté par `MarketingLayout` depuis `src/config/index.ts → announcement`. Modifier directement la clé `announcement` de `config.json`.

| Clé JSON | Type | Description |
|---|---|---|
| `announcement.enabled` | `boolean` | Afficher ou masquer |
| `announcement.id` | `string` | ID unique — changer pour reset dismiss localStorage |
| `announcement.text` | `string` | Texte de l'annonce |
| `announcement.href` | `string` | URL du lien optionnel |
| `announcement.linkText` | `string` | Texte du lien |
| `announcement.variant` | `'primary' \| 'secondary' \| 'gradient'` | Style visuel |
| `announcement.dismissible` | `boolean` | Afficher bouton de fermeture |

---

### `LogoCloud.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `logoCloud.title` |
| `logos` | `Array<{ name, src, href? }>` | `logoCloud.logos` ✅ |
| `variant` | `'default' \| 'marquee' \| 'grid'` | `logoCloud.variant` |
| `grayscale` | `boolean` | `logoCloud.grayscale` |
| `pauseOnHover` | `boolean` | `logoCloud.pauseOnHover` |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `logoCloud.speed` |
| `columns` | `2 \| 3 \| 4 \| 5 \| 6` | `logoCloud.columns` |
| `logoSize` | `'sm' \| 'md' \| 'lg'` | `logoCloud.logoSize` |

---

### `FeaturesSection.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `features.title` |
| `subtitle` | `string` | `features.subtitle` |
| `features` | `Array<{ icon: string; title; description }>` | `features.features` ✅ |
| `footerLink` | `{ label; href }` | `features.footerLink` |

> Le composant exige `icon: string` (non optionnel). Fallback `'lucide:check'` appliqué par index.astro si absent.

---

### `HowItWorks.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `howItWorks.title` |
| `subtitle` | `string` | `howItWorks.subtitle` |
| `steps` | `Array<{ icon?, title, description, image? }>` | `howItWorks.steps` ✅ |
| `variant` | `'horizontal' \| 'vertical' \| 'alternating'` | `howItWorks.variant` |
| `showNumbers` | `boolean` | `howItWorks.showNumbers` |

---

### `FeatureHighlight.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `featureHighlight.title` |
| `subtitle` | `string` | `featureHighlight.subtitle` |
| `features` | `Array<{ badge?, title, description, highlights?, image?, icon?, cta? }>` | `featureHighlight.features` ✅ |
| `startImageLeft` | `boolean` | `featureHighlight.startImageLeft` |

---

### `BentoGrid.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `bentoGrid.title` |
| `subtitle` | `string` | `bentoGrid.subtitle` |
| `items` | `Array<{ size?, title, description, icon?, image?, accent?, href? }>` | `bentoGrid.items` ✅ |

Valeurs `size` : `'small' | 'medium' | 'large'`
Valeurs `accent` : `'primary' | 'blue' | 'green' | 'purple' | 'orange'`

---

### `IntegrationsGrid.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `integrations.title` |
| `integrations` | `Array<{ name, logo, category, description?, href?, featured? }>` | `integrations.integrations` ✅ |
| `showFilter` | `boolean` | `integrations.showFilter` |
| `variant` | `'grid' \| 'compact' \| 'detailed'` | `integrations.variant` |
| `columns` | `3 \| 4 \| 5 \| 6` | `integrations.columns` |
| `invertOnDark` | `boolean` | `integrations.invertOnDark` |
| `footerLink` | `{ label; href }` | `integrations.footerLink` |

---

### `CTA.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `cta.title` ✅ |
| `description` | `string` | `cta.description` ✅ (fallback `''`) |
| `action` | `{ label; href }` | `cta.action` ✅ (fallback Contact) |
| `secondaryAction` | `{ label; href }` | `cta.secondaryAction` |

> `tallyFormId` prévu en config pour future intégration Tally (non utilisé actuellement).

---

### `Newsletter.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `newsletter.title` |
| `description` | `string` | `newsletter.description` |
| `placeholder` | `string` | `newsletter.placeholder` |
| `buttonText` | `string` | `newsletter.buttonText` |
| `successMessage` | `string` | `newsletter.successMessage` |
| `errorMessage` | `string` | `newsletter.errorMessage` |
| `privacyNote` | `string` | `newsletter.privacyNote` |
| `action` | `string` | `newsletter.action` |
| `variant` | `'default' \| 'compact' \| 'card'` | `newsletter.variant` |

---

## 5. Composants Social Proof (`src/components/sections/social-proof/`)

### `StatsSection.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `stats.title` |
| `subtitle` | `string` | `stats.subtitle` |
| `stats` | `Array<{ value: string; label; description? }>` | `stats.stats` ✅ |
| `columns` | `2 \| 3 \| 4` | `stats.columns` |

> `value` est une chaîne — inclure le suffixe directement (`"25 ans"`, `"98%"`, `"< 1h"`). Pas de champ `suffix` séparé.

---

### `TestimonialsSection.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `testimonials.title` |
| `subtitle` | `string` | `testimonials.subtitle` |
| `testimonials` | `Array<{ author, role, company, avatar?, quote }>` | `testimonials.testimonials` ✅ |
| `limit` | `number` | `testimonials.limit` |
| `footerLink` | `{ label; href }` | `testimonials.footerLink` |

> `role: string` et `company: string` sont requis par le composant. Fallbacks `''` appliqués par index.astro. Le champ s'appelle **`author`**, pas `name`.

---

## 6. Composants Pricing (`src/components/sections/pricing/`)

### `PricingTable.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `pricing.title` |
| `plans` | `Array<PricingPlan>` | `pricing.plans` ✅ |
| `annualDiscount` | `number` | `pricing.annualDiscount` |
| `defaultPeriod` | `'monthly' \| 'annual'` | `pricing.defaultPeriod` |
| `footerLink` | `{ label; href }` | `pricing.footerLink` |

**Structure PricingPlan :** `name`, `monthlyPrice: number | null` (null = sur devis), `customPrice?: string`, `description`, `features: string[]`, `cta: { label, href }`, `highlighted?: boolean`, `badge?: string`

> Champs : `monthlyPrice` (pas `price`) et `highlighted` (pas `popular`).

---

### `ComparisonTable.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `comparisonTable.title` |
| `plans` | `string[]` | `comparisonTable.plans` ✅ |
| `categories` | `Array<{ name, features[] }>` | `comparisonTable.categories` ✅ |
| `highlightedPlan` | `number` | `comparisonTable.highlightedPlan` |

> `highlightedPlan` est un **index numérique** 0-based, pas un nom. `values` accepte `boolean | string`.

---

## 7. Composants UI partagés

### `BackgroundWrapper.astro` (`src/components/ui/`)

Encapsule la logique de fond commune à `Hero` et `PageHeader`. **Ne pas instancier directement dans les pages.**

| Prop | Type | Description |
|---|---|---|
| `backgroundType` | `'solid' \| 'gradient' \| 'image' \| 'video'` | Discriminant de fond |
| `background` | `'default' \| 'muted' \| 'accent'` | Couleur thématique (fallback CSS pendant chargement image) |
| `backgroundSrc` | `string` | URL image de fond |
| `backgroundVideo` | `string` | URL vidéo |
| `backgroundVideoPoster` | `string` | Poster vidéo |
| `gradient` | `string` | Classes Tailwind de dégradé |
| `overlay` | `boolean` | Overlay sombre sur image/vidéo |
| `overlayOpacity` | `number` | Opacité overlay (0–100) |
| `class` | `string` | Classes supplémentaires pour le `<section>` |

Rend un `<section>` + couches background/overlay + `<slot />` sans wrapper. Les consumers ajoutent `relative z-10` sur leur contenu.

Calcul interne :
```typescript
const solidBgClass = { default: 'bg-background', muted: 'bg-surface', accent: 'bg-primary/5' }[background];
const bgClass = backgroundType === 'gradient' ? `bg-linear-to-br ${gradient}` : solidBgClass;
```

---

### `PageHeader.astro` (`src/components/sections/content/`)

En-tête réutilisable pour toutes les pages secondaires. Partage le **même système de background que `Hero.astro`**.

| Prop | Type | Défaut |
|---|---|---|
| `title` | `string` | ✅ requis |
| `subtitle` | `string` | — |
| `align` | `'center' \| 'left'` | `'center'` |
| `size` | `'default' \| 'large'` | `'default'` |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'lg'` |
| `layout` | `'centered' \| 'split'` | `'centered'` |
| `foregroundImage` | `string` | — |
| `foregroundImageAlt` | `string` | `''` |
| `backgroundType` | `'solid' \| 'gradient' \| 'image'` | `'solid'` |
| `background` | `'default' \| 'muted' \| 'accent'` | `'default'` |
| `backgroundSrc` | `string` | — |
| `gradient` | `string` | — |
| `overlay` | `boolean` | `true` |

> `background` sert aussi de **fallback CSS** pendant le chargement de l'image. Toujours le définir quand `backgroundType: 'image'`.
> **Ancien nom supprimé** : `bgImage` n'existe plus — utiliser `backgroundSrc`.

---

### `FAQSection.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `faq.title` |
| `faqs` | `Array<{ question; answer }>` | `faq.faqs` |
| `categories` | `Array<{ name, faqs[] }>` | `faq.categories` |
| `variant` | `'accordion' \| 'simple'` | `faq.variant` |

Utiliser soit `faqs` (liste plate) soit `categories` (groupées) — les deux sont optionnels.

---

## 8. Layout (`src/components/layout/`)

`Header.astro` et `Footer.astro` **ne reçoivent pas de props** — ils lisent directement depuis `src/config/`.
La clé `footer` de `config.json` n'est pas encore branchée au composant `Footer.astro`.

---

## 9. Composants Formulaires (`src/components/forms/`)

Hors du flux config.json — utilisés sur des pages dédiées.

| Composant | Rôle |
|---|---|
| `ContactForm.astro` | Formulaire de contact 5 champs |
| `DemoRequestForm.astro` | Demande de devis / démo |
| `LoginForm.astro` | Authentification |
| `RegisterForm.astro` | Inscription |
| `ForgotPasswordForm.astro` | Réinitialisation mdp |

**Intégration Tally future :** ajouter `tallyFormId` dans `cta`, `newsletter`, ou `pricing` de config.json. Champs déjà définis dans `SiteConfig`.

---

## 10. Pièges à Éviter (Champs renommés)

| ❌ Ancien nom | ✅ Nom correct | Affecte |
|---|---|---|
| `cta.text` / `action.text` | `label` | Tous les CTALink |
| `testimonials[].name` | `testimonials[].author` | TestimonialsSection |
| `pricing.plans[].price` | `pricing.plans[].monthlyPrice` | PricingTable |
| `pricing.plans[].popular` | `pricing.plans[].highlighted` | PricingTable |
| `stats[].suffix` | *(inclure dans `value`)* | StatsSection |
| `bentoGrid.items[].accentColor` | `bentoGrid.items[].accent` | BentoGrid |
| `comparisonTable.highlightedPlan: string` | `comparisonTable.highlightedPlan: number` | ComparisonTable |
| `header.bgImage` | `header.backgroundSrc` (+ `backgroundType: "image"`) | PageHeader |
| `hero.backgroundImage` *(dans config.json)* | `hero.backgroundSrc` (index.astro splitte) | Hero |
| `header.background: "accent"` *(seul)* | `header.backgroundType: "solid", background: "accent"` | PageHeader |

---

## 11. Audit QA Final (2026-04-21)

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
| `background` prop (tous) | ✅ | Pattern architectural intentionnel — piloté par index.astro |
| `tallyFormId` (config uniquement) | ℹ️ | Conservé dans CTAConfig, NewsletterConfig, PricingConfig pour future intégration |
| **`PageHeader` background system** | ✅ *(2026-04-21)* | `bgImage`/`overlay` → `backgroundType`/`backgroundSrc`/`background`/`gradient`/`overlay` |
| **`BackgroundWrapper` refactoring** | ✅ *(2026-04-21)* | Logique fond/overlay extraite dans `@ui/BackgroundWrapper.astro` |
| **`BackgroundConfig` interface** | ✅ *(2026-04-21)* | Props communes mutualisées — `HeroConfig` et `PageHeaderConfig` étendent cette base |
| **Hero + PageHeader layout split** | ✅ *(2026-04-21)* | Mode centered/split avec fallback automatique et contraintes responsive mobile |

---

## 12. Interfaces TypeScript Partagées

Fichiers : `src/types/config.ts` et `src/types/pages.ts`

| Interface | Fichier source | Utilisée par | Description |
|---|---|---|---|
| `BackgroundConfig` | `src/types/config.ts` | `HeroConfig`, `PageHeaderConfig` | `background`, `backgroundSrc`, `gradient`, `overlay`, `overlayOpacity` |
| `SiteConfig` | `src/types/config.ts` | `src/pages/index.astro` | Objet racine — toutes les sections optionnelles |
| `HeroConfig` | `src/types/config.ts` | index.astro | Étend `BackgroundConfig` + `backgroundType` (video inclus), layout, foreground |
| `PageSEO` | `src/types/pages.ts` | Toutes les pages | `title`, `description`, `image`, `keywords` |
| `PageHeaderConfig` | `src/types/pages.ts` | Toutes sauf pricing | Étend `BackgroundConfig` + `title`, `subtitle`, `paragraphs?`, layout/split props |
| `CTABlockConfig` | `src/types/pages.ts` | Toutes les pages | `title`, `description?`, `action?`, `secondaryAction?` |
| `ValueItem` | `src/types/pages.ts` | About, Features | Icône + titre + description |
| `TeamMember` | `src/types/pages.ts` | About | Membre avec avatar, bio, réseaux sociaux |
| `CaseStudyItem` | `src/types/pages.ts` | Customers | Témoignage client avec métriques |
| `FeatureHighlightItem` | `src/types/pages.ts` | Features | Feature avec badge, highlights, CTA |
| `BentoItem` | `src/types/pages.ts` | Features | Item grille bento |

---

## 13. Patron de Chaque Page Data-Driven

```astro
---
import pageJson from '@/data/pages/<name>.json';
import type { <Name>PageConfig } from '@/types/pages';
const cfg = pageJson as <Name>PageConfig;
const pageTitle = cfg.seo?.title ?? cfg.header?.title ?? '<Fallback>';
const pageDescription = cfg.seo?.description ?? '';
---
<MarketingLayout title={pageTitle} description={pageDescription} image={cfg.seo?.image} tags={cfg.seo?.keywords}>
  <!-- Sections conditionnelles : {cfg.section && <Composant {...cfg.section} />} -->
</MarketingLayout>
```

```
src/data/pages/<page>.json
          │
          ▼ (cast as <Page>Config depuis src/types/pages.ts)
src/pages/<page>.astro
          └── Props spread vers les composants + SEO passé à MarketingLayout
```
