# TECH_ARCHITECTURE.md — Architecture Technique

> Projet : Landing Page One-Page Astro 5 + Tailwind CSS 4 — Rizset Plomberie
> Dernière mise à jour : 2026-06-03
> Audience : développeur, IA technique

**Interface TypeScript** : `src/types/config.ts` → `SiteConfig`
**Fichier de données unique** : `src/data/config.json`
**Page principale** : `src/pages/index.astro`

---

## Architecture Data-Flow

```
src/data/config.json
       │
       ▼  (cast as SiteConfig)
src/pages/index.astro
       │
       ├── sectionOrder[] → ordre d'affichage
       ├── sections features/pricing/testimonials/faq → <div id="…" class="scroll-mt-20">
       ├── Props normalisés avec fallbacks
       └── bg(idx) → alternance 'default'/'muted' par index
```

`sectionOrder` actuel : `["hero", "logoCloud", "features", "pricing", "testimonials", "faq", "cta"]`

---

## 1. Configuration Interne (`src/config/`)

| Fichier | Rôle | Source |
|---|---|---|
| `site.ts` | Nom, URL, logo, ogImage, réseaux sociaux | Lit `config.json → global` |
| `navigation.ts` | Liens Header + Footer | Statique — éditer ce fichier |
| `index.ts` | Ré-exporte `contact`, `contactMethods`, `contactFAQs`, `announcement` | Source : `config.json` |

> `Header.astro` et `Footer.astro` lisent depuis `src/config/` — pas de props depuis `config.json`.

---

## 2. Navigation avec Ancres Internes

Le header utilise des ancres HTML standard pointant vers les sections de la landing page.

**`src/config/navigation.ts`** :
```typescript
header: {
  main: [
    { label: 'Nos Services',  href: '#features'    },
    { label: 'Tarifs',        href: '#pricing'      },
    { label: 'Avis Clients',  href: '#testimonials' },
    { label: 'FAQ',           href: '#faq'          },
  ],
  cta: [{ label: 'Demander un devis', href: '/contact', variant: 'primary',
          tallyFormId: '2E7d7V', tallyEmojiText: '👋', tallyEmojiAnimation: 'wave' }],
}
```

**IDs dans `index.astro`** : les sections cibles sont enveloppées d'un `<div id="…">` :
```astro
// Features, pricing, testimonials, faq :
<div id="features" class="scroll-mt-20"><FeaturesSection ... /></div>
<div id="pricing"  class="scroll-mt-20"><PricingTable   ... /></div>
```

`scroll-mt-20` = `scroll-margin-top: 5rem` — compense le header sticky h-16 (4rem) + marge visuelle.

---

## 3. Intégration Tally — Pop-up & Embed

### Script global (MarketingLayout.astro)

```astro
<script is:inline async src="https://tally.so/widgets/embed.js"></script>
```

Ajouté avant `</BaseLayout>` dans `src/layouts/MarketingLayout.astro`. Chargé sur toutes les pages marketing (index, contact, privacy, terms). `is:inline` requis car le tag `<script>` contient l'attribut `async`.

### Pop-up — attributs `data-tally-*`

Tout élément HTML portant `data-tally-open` déclenche la pop-up au clic sans JavaScript supplémentaire (le script `embed.js` scanne le DOM) :

```html
<button
  data-tally-open="2E7d7V"
  data-tally-emoji-text="👋"
  data-tally-emoji-animation="wave"
>
  Demander un devis
</button>
```

**Paramètres disponibles :**

| Attribut | Valeur | Rôle |
|---|---|---|
| `data-tally-open` | ID du formulaire | Ouvre ce formulaire en pop-up |
| `data-tally-emoji-text` | ex: `"👋"` | Emoji affiché sur le bouton Tally |
| `data-tally-emoji-animation` | `"wave"` \| `"spin"` \| `"pulse"` | Animation de l'emoji |
| `data-tally-layout` | `"modal"` (défaut) \| `"drawer"` | Style de la pop-up |
| `data-tally-width` | ex: `"600"` | Largeur de la pop-up (px) |
| `data-tally-auto-close` | ms | Ferme automatiquement après soumission |

### Embed natif — page `/contact`

Sur `/contact`, le formulaire est intégré en iframe native (fallback desktop/mobile) :

```html
<iframe
  data-tally-src="https://tally.so/embed/2E7d7V?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
  loading="lazy"
  width="100%"
  height="500"
  style="border: none; margin: 0;"
  title="Demande de devis Rizset Plomberie"
></iframe>
```

`dynamicHeight=1` → le script `embed.js` redimensionne l'iframe automatiquement selon le contenu. `data-tally-src` (et non `src`) est requis pour que le script de resize fonctionne.

### Type `NavigationCTA` étendu (`src/lib/types.ts`)

```typescript
export interface NavigationCTA {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'ghost';
  tallyFormId?: string;       // si défini → <button data-tally-open> au lieu de <a>
  tallyEmojiText?: string;
  tallyEmojiAnimation?: string;
}
```

### Rendu conditionnel dans `Header.astro`

```astro
{primaryCTA.tallyFormId ? (
  <button
    data-tally-open={primaryCTA.tallyFormId}
    data-tally-emoji-text={primaryCTA.tallyEmojiText}
    data-tally-emoji-animation={primaryCTA.tallyEmojiAnimation}
    class="px-4 py-2 rounded-md bg-primary text-white ..."
  >
    {primaryCTA.label}
  </button>
) : (
  <a href={primaryCTA.href} class="...">
    {primaryCTA.label}
  </a>
)}
```

Logique identique dans la branche mobile (menu hamburger).

---

## 4. Composants Marketing (`src/components/sections/marketing/`)

### `Hero.astro`

| Prop | Type | Clé JSON | Requis |
|---|---|---|---|
| `title` | `string` | `hero.title` | ✅ |
| `subtitle` | `string` | `hero.subtitle` | ✅ (fallback `''`) |
| `primaryCTA` | `{ label; href }` | `hero.primaryCTA` | ✅ |
| `secondaryCTA` | `{ label; href }` | `hero.secondaryCTA` | — |
| `badge` | `string` | `hero.badge` | — |
| `layout` | `'centered' \| 'split'` | `hero.layout` | — |
| `foregroundImage` | `string` | `hero.foregroundImage` | — |
| `backgroundType` | `'solid' \| 'gradient' \| 'image' \| 'video'` | `hero.backgroundType` | — |
| `gradient` | `string` | `hero.gradient` | — |

> `hero.backgroundSrc` est splitté en `backgroundImage` / `backgroundVideo` par index.astro.
> Layout `split` : fallback sur `centered` si `foregroundImage` absent.

**Contraintes responsive :**

| Composant | Mobile | Desktop |
|---|---|---|
| `Hero` | Texte haut (DOM order), image `h-56 object-cover` | Grille 2 col, `max-h-[480px]` |
| `PageHeader` | Idem, image `h-40` | Grille 2 col, `max-h-[340px]` |

---

### `AnnouncementBar.astro`

Lu depuis `src/config/index.ts → announcement`. Changer `announcement.id` pour reset dismiss localStorage.

---

### `PricingTable.astro`

| Prop | Type | Clé JSON |
|---|---|---|
| `title` | `string` | `pricing.title` |
| `plans` | `Array<PricingPlan>` | `pricing.plans` ✅ |
| `annualDiscount` | `number` | `pricing.annualDiscount` |
| `footerLink` | `{ label; href }` | `pricing.footerLink` |

**Structure PricingPlan :** `name`, `monthlyPrice: number | null`, `customPrice?: string`, `description`, `features: string[]`, `cta`, `highlighted?: boolean`, `badge?: string`

---

## 5. Composants UI partagés

### `BackgroundWrapper.astro` (`src/components/ui/`)

Encapsule `<section>` + couches background + overlay. Utilisé par Hero et PageHeader.

```typescript
const solidBgClass = { default: 'bg-background', muted: 'bg-surface', accent: 'bg-primary/5' }[background];
const bgClass = backgroundType === 'gradient' ? `bg-linear-to-br ${gradient}` : solidBgClass;
```

### `PageHeader.astro` (`src/components/sections/content/`)

| Prop | Défaut |
|---|---|
| `title` | ✅ requis |
| `backgroundType` | `'solid'` — `'solid' \| 'gradient' \| 'image'` (pas de vidéo) |
| `layout` | `'centered'` — `'centered' \| 'split'` |
| `foregroundImage` | — |
| `background` | `'default'` — `'default' \| 'muted' \| 'accent'` (actif si `backgroundType='solid'`) |
| `overlay` | `true` |

**Logique de couleur de texte automatique** (ligne 55 de `PageHeader.astro`) :

```typescript
const titleColor    = isImage || isGradient ? 'text-white'    : 'text-text';
const subtitleColor = isImage || isGradient ? 'text-white/80' : 'text-text-muted';
```

- `backgroundType="gradient"` → force `text-white` quel que soit le gradient
- `backgroundType="solid"` → `text-text` (couleur du thème, lisible sur fond clair/sombre)
- **Règle** : utiliser `backgroundType="gradient"` uniquement si le gradient est suffisamment sombre pour supporter du texte blanc (ex: `from-primary/70 …`). Pour un fond clair, toujours utiliser `backgroundType="solid"`.

---

## 6. Layout (`src/components/layout/`)

### `Header.astro`
- Lit `navigation.header` depuis `src/config/`
- CTA primary : `<button data-tally-*>` si `tallyFormId` présent, sinon `<a>`
- Menu mobile : même logique conditionnelle

### `Footer.astro`
Colonnes fixes lues depuis `navigation.footer` :
- `services` → "Notre métier"
- `resources` → "Nos resources" (masqué si array vide)
- `company` → "Notre société"
- `legal` → barre de bas de page

---

## 7. Interfaces TypeScript Partagées

| Interface | Fichier | Description |
|---|---|---|
| `BackgroundConfig` | `src/types/config.ts` | `background`, `backgroundSrc`, `gradient`, `overlay`, `overlayOpacity` |
| `HeroConfig` | `src/types/config.ts` | Étend `BackgroundConfig` + layout/foreground/video |
| `SiteConfig` | `src/types/config.ts` | Objet racine |
| `NavigationCTA` | `src/lib/types.ts` | Étend avec `tallyFormId?`, `tallyEmojiText?`, `tallyEmojiAnimation?` |
| `PageHeaderConfig` | `src/types/pages.ts` | Étend `BackgroundConfig` — `backgroundType` sans `'video'` |

---

## 8. Pièges à Éviter

| ❌ Incorrect | ✅ Correct | Affecte |
|---|---|---|
| `<script async src="tally">` sans `is:inline` | `<script is:inline async src="…">` | Astro warning |
| `src="…"` sur l'iframe Tally | `data-tally-src="…"` | `dynamicHeight` ne fonctionne pas |
| `hero.backgroundImage` dans config.json | `hero.backgroundSrc` | Hero (index.astro splitte) |
| `header.bgImage` | `header.backgroundSrc` + `backgroundType: "image"` | PageHeader |
| `testimonials[].name` | `testimonials[].author` | TestimonialsSection |
| `pricing.plans[].price` | `pricing.plans[].monthlyPrice` | PricingTable |
| Ancre sans id dans index.astro | `<div id="features" class="scroll-mt-20">` | Navigation header |
| `backgroundType="gradient"` avec gradient clair (`from-primary/10…`) | `backgroundType="solid" background="muted"` | PageHeader — texte blanc sur fond blanc = illisible |

---

## 9. Vérification

```bash
npx astro check   # 0 erreurs, 0 warnings
```

**Tally pop-up** : cliquer le bouton "Demander un devis" dans le header → la pop-up doit s'ouvrir avec l'emoji 👋.
**Tally embed** : ouvrir `/contact` avec JS activé → l'iframe se redimensionne automatiquement.
**Ancres** : cliquer "Nos Services" dans le header → scroll fluide vers `#features` avec décalage sticky header.
