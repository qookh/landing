# TECH_ARCHITECTURE.md — Architecture Technique

> Projet : Landing Page One-Page Astro 6 + Tailwind CSS 4 — Rizset Plomberie
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

> **Règle critique** : `astro.config.mjs` ne doit **jamais** importer depuis `src/config/`. Astro surveille toutes les dépendances transitives du fichier de config — un import de `siteConfig` rend `features.ts`, `navigation.ts` et `config.json` des déclencheurs de redémarrage complet du serveur. Voir section 11.

---

## 2. Navigation avec Ancres Internes

Le header utilise des ancres **absolues** pointant vers les sections de la landing page. Les ancres relatives (`#section`) fonctionnent depuis `/` mais sont brisées depuis toute page secondaire comme `/contact`.

**`src/config/navigation.ts`** :
```typescript
header: {
  main: [
    { label: 'Nos Services',  href: '/#features'    },
    { label: 'Tarifs',        href: '/#pricing'      },
    { label: 'Avis Clients',  href: '/#testimonials' },
    { label: 'FAQ',           href: '/#faq'          },
    { label: 'Contact',       href: '/contact'       },
  ],
  cta: [{ label: 'Demander un devis', href: '/contact', variant: 'primary' }],
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

## 3. Intégration Tally — Embed `/contact`

### Script global (MarketingLayout.astro)

```astro
<script is:inline async src="https://tally.so/widgets/embed.js"></script>
```

Ajouté avant `</BaseLayout>` dans `src/layouts/MarketingLayout.astro`. Chargé sur toutes les pages marketing (index, contact, privacy, terms). `is:inline` requis car le tag `<script>` contient l'attribut `async`.

### Embed natif — page `/contact`

Sur `/contact`, le formulaire est intégré en iframe native :

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

Pour changer le formulaire : modifier l'ID `2E7d7V` dans l'URL embed de `contact.astro`.

> La pop-up Tally (`data-tally-open`) a été supprimée. Tous les CTAs pointent directement vers `/contact`. Si besoin de réactiver une pop-up, ajouter `data-tally-open="<ID>"` sur n'importe quel élément HTML — le script `embed.js` scanne le DOM automatiquement.

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
- CTA primary : `<a href="/contact">` simple — rendu conditionnel Tally supprimé
- Menu mobile : même logique, fermeture automatique au clic sur un lien

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
| `NavigationCTA` | `src/lib/types.ts` | `label`, `href`, `variant` — champs Tally supprimés |
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
| `href="#section"` dans les liens nav | `href="/#section"` | Ancre relative brisée depuis `/contact` ou toute page secondaire |
| `backgroundType="gradient"` avec gradient clair (`from-primary/10…`) | `backgroundType="solid" background="muted"` | PageHeader — texte blanc sur fond blanc = illisible |
| `bg-gradient-to-r` / `bg-gradient-to-br` | `bg-linear-to-r` / `bg-linear-to-br` | Tailwind CSS 4 — ancienne syntaxe silencieusement ignorée |
| `import { siteConfig } from './src/config'` dans `astro.config.mjs` | Filtre sitemap statique sans import | Rend `src/config/**` + `config.json` des déclencheurs de redémarrage — voir section 11 |
| `icon()` sans `include` dans `astro.config.mjs` | `icon({ include: { lucide: [...], 'simple-icons': [...] } })` | Charge les packs entiers (~15 Mo JSON) → timeout module runner Vite à 60 s |

---

## 9. Thème — Light Mode Strict

Le dark mode a été définitivement supprimé. Le site est exclusivement en light mode.

| Composant | Action effectuée |
|---|---|
| `src/components/ui/ThemeToggle.astro` | **Supprimé** — fichier effacé |
| `src/components/layout/Header.astro` | Import et 2 usages `<ThemeToggle />` retirés |
| `src/layouts/BaseLayout.astro` | Bloc `localStorage.theme` + `matchMedia('prefers-color-scheme')` retiré du script inline |
| `src/styles/global.css` | Bloc `.dark { --color-* }` supprimé (18 lignes) |

**Script BaseLayout après nettoyage** — ne conserve que le dismiss annonce :
```javascript
(function () {
  const keys = Object.keys(localStorage).filter((k) =>
    k.startsWith('announcement-dismissed-')
  );
  keys.forEach((key) => {
    if (localStorage.getItem(key) === 'true') {
      const id = key.replace('announcement-dismissed-', '');
      document.documentElement.classList.add(`announcement-${id}-dismissed`);
    }
  });
})();
```

> Si le dark mode doit être réactivé, il faut : 1) recréer `ThemeToggle.astro`, 2) restaurer le bloc `.dark` dans `global.css`, 3) restaurer le script de détection dans `BaseLayout.astro`.

---

## 10. Serveur de Développement — Stabilité

### Causes de boucle de rechargement (résolues)

| Symptôme | Cause | Fix appliqué |
|---|---|---|
| `"Configuration file updated. Restarting..."` en boucle | `astro.config.mjs` importait `siteConfig` → tout `src/config/` surveillé | Import supprimé, filtre sitemap statique |
| `"Local icons changed, reloading"` à chaque restart | `astro-icon` vite plugin écoute `watcher.on("all")` ET se déclenche sur tout fichier nommé `astro.config` | Cascade brisée en supprimant la cause précédente |
| `"transport invoke timed out after 60000ms"` | `@iconify-json/lucide` (1 300+ icônes) + `@iconify-json/simple-icons` (3 000+) chargés en entier → ~15 Mo de JSON parsé dans le thread SSR | Option `include` dans `icon()` — seules les 26 icônes utilisées sont chargées |
| `"Failed to load url astro:server-app.js"` | Cascade des deux points ci-dessus : restart trop rapide, module virtuel Vite non régénéré | Résolu en corrigeant les causes amont |
| Collections `docs`/`changelog` fantômes | `src/content.config.ts` déclarait `glob()` vers des dossiers supprimés | Déclarations retirées de `content.config.ts` |

### `astro.config.mjs` — règles à respecter

1. **Ne jamais importer depuis `src/config/`** — utiliser des valeurs statiques ou lire un JSON avec `readFileSync` si nécessaire.
2. **Toujours déclarer `icon({ include: { ... } })`** après avoir listé les icônes réellement utilisées (`grep -rn '<Icon' src --include="*.astro"`).
3. **`ssr.noExternal: ['astro-icon']`** — contre-productif : force Vite à bundler un module chargé de gros JSON, ralentit le démarrage.

### `astro-icon` — icônes actuellement déclarées dans `include`

```javascript
// astro.config.mjs
icon({
  iconDir: 'src/icons',
  include: {
    lucide: [
      'arrow-right', 'bell', 'calendar', 'check', 'chevron-down',
      'chevron-right', 'chevrons-left', 'chevrons-right', 'clock',
      'help-circle', 'image', 'layout-dashboard', 'menu', 'minus',
      'play', 'quote', 'search', 'shield-check', 'sparkles',
      'twitter', 'user', 'x',
    ],
    'simple-icons': ['facebook', 'github', 'google', 'instagram'],
  },
})
```

> Ajouter un `<Icon name="lucide:new-icon" />` dans un composant **sans** ajouter `'new-icon'` à cette liste → l'icône ne s'affiche pas en production. Toujours mettre à jour `include` en parallèle.
> Même règle pour les icônes définies dans `src/data/config.json` (champ `"icon"`) — elles passent par le même pipeline astro-icon au rendu.

### Collections de contenu actives (`src/content.config.ts`)

| Collection | Dossier | Statut |
|---|---|---|
| `blog` | `src/content/blog/` | Actif |
| `testimonials` | `src/content/testimonials/` | Actif |
| ~~`docs`~~ | ~~`src/content/docs/`~~ | Supprimé |
| ~~`changelog`~~ | ~~`src/content/changelog/`~~ | Supprimé |

---

## 11. Vérification

```bash
npx astro check   # 0 erreurs, 0 warnings
```

**Serveur de développement** : `npm run dev` démarre sans boucle de rechargement. Aucun "Configuration file updated" intempestif. Le log doit afficher `[astro-icon] Loaded icons from src/icons, lucide, simple-icons` une seule fois.
**Ancres inter-pages** : depuis `/contact`, cliquer "Nos Services" → navigation vers `/#features` (retour sur `/` + scroll vers la section).
**Light mode strict** : vérifier que ThemeToggle n'apparaît plus en desktop ni en mobile. Vérifier que `localStorage.theme = 'dark'` ne déclenche plus de mode sombre.
**Tally embed** : ouvrir `/contact` avec JS activé → l'iframe se redimensionne automatiquement via `dynamicHeight=1`.
**Bandeau** : le nouveau texte d'urgence s'affiche. Fermer → ne réapparaît pas (dismiss stocké sous la clé `urgence-contact-2026`).
**Icônes** : après ajout d'un `<Icon name="lucide:X" />`, vérifier que `'X'` est bien présent dans `include.lucide` de `astro.config.mjs`.
