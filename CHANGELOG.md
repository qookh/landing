# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Versionnage Sémantique](https://semver.org/lang/fr/).

---

## [1.4.0] — 2026-06-03

### Fixed

- **`Unable to locate "lucide:zap" icon!`** au rendu de `index.astro` : l'icône `lucide:zap` (feature "Urgence 24h/24" dans `config.json` ligne 108) n'avait pas été ajoutée au filtre `include.lucide` lors de sa création en session précédente. Correction : `'zap'` ajouté à la liste dans `astro.config.mjs`. L'icône est conservée — elle est sémantiquement correcte (éclair = urgence).

### Audited (no change needed)

- **`tsconfig.json`** : valide — `extends: "astro/tsconfigs/strict"`, paths `@/*` cohérents, aucune boucle de build.
- **`.env`** : valide — `SITE_URL=https://rizset.com` présent, aucune variable manquante ou malformée.
- **`BaseLayout.astro`** : valide — CSS chargé via import statique Astro, aucun `await` bloquant dans le frontmatter.
- Les erreurs "transport disconnected" des logs précédents étaient des cascades des boucles de reload (corrigées en v1.2.0), pas des causes `.env` ou `tsconfig`.

---

## [1.3.0] — 2026-06-03

### Fixed

- **Timeout Vite module runner à 60 s** (`transport invoke timed out after 60000ms`) : `astro-icon` chargeait en entier `@iconify-json/lucide` (1 300+ icônes) et `@iconify-json/simple-icons` (3 000+), soit ~15 Mo de JSON parsé dans le thread SSR à chaque démarrage — suffisant pour saturer le module runner et bloquer les imports CSS/layout en cascade.
- **Ajout de l'option `include`** dans `icon()` dans `astro.config.mjs` : restreint le chargement aux 22 icônes Lucide et 4 icônes Simple-icons réellement utilisées dans le code. Le scan du codebase a été effectué exhaustivement (`grep -rn '<Icon'`) pour garantir l'absence de régression visuelle.

### Not applied (justification)

- `server.headers: { 'Connection': 'keep-alive' }` — agit sur les réponses HTTP du dev server, pas sur le transport interne du module runner. Sans effet sur le timeout.
- `ssr.noExternal: ['astro-icon']` — forcerait Vite à **bundler** astro-icon au lieu de le charger nativement via Node, ajoutant du travail de transformation sur un module déjà lent. Contre-productif.

---

## [1.2.0] — 2026-06-03

### Fixed

- **Boucle infinie du serveur de développement** : trois causes en cascade identifiées et corrigées.
  1. `astro.config.mjs` importait `siteConfig` depuis `./src/config`, rendant l'ensemble de `src/config/` (features, navigation, config.json) une dépendance surveillée par Astro — tout touch (VS Code TypeScript server, git, auto-formatter) déclenchait "Configuration file updated. Restarting...".
  2. Le plugin `astro-icon` (`vite-plugin-astro-icon.js`) écoute l'événement `watcher.on("all")` et se déclenche sur tout fichier nommé `astro.config` — chaque redémarrage de cause 1 cascadait en "Local icons changed, reloading".
  3. La double restart rapide corrompait le module virtuel Vite → "Failed to load url astro:server-app.js".
- **`astro.config.mjs`** : suppression de `import { siteConfig }` ; filtre sitemap remplacé par une condition statique équivalente (`!page.includes('/docs') && !page.includes('/changelog')`).
- **Collections fantômes `docs` et `changelog`** dans `src/content.config.ts` : suppression des deux `defineCollection` pointant vers des dossiers inexistants (`./src/content/docs`, `./src/content/changelog`) — Astro bouclait indéfiniment en cherchant à synchroniser leurs schémas.
- **`src/config/features.ts`** : `docs` et `changelog` passés à `false` pour aligner les feature flags sur l'état réel du projet.
- **`.git/index.lock`** : fichier de verrouillage fantôme supprimé (processus git ou VS Code git extension laissé sans nettoyage).
- **Watcher chokidar instable sur `src/icons/`** : le répertoire n'existait pas — chokidar pollingait un path inexistant. Création de `src/icons/.gitkeep` pour stabiliser la surveillance.

### Changed

- **`astro.config.mjs`** : `icon()` → `icon({ iconDir: 'src/icons' })` — path local explicite au lieu de la valeur par défaut implicite.
- **`vite.server.watch.ignored`** étendu avec `**/public/icons/**` et `**/.github/**` pour exclure les assets statiques et les métadonnées CI du watcher Vite.
- **Cache `.astro/`** supprimé manuellement pour forcer la régénération des types de collections sans les entrées `changelog` et `docs` orphelines dans `DataEntryMap`.

---

## [1.1.0] — 2026-06-03

### Added

- **`GalleryCarousel.astro`** (`src/components/sections/marketing/`) : composant carrousel horizontal scroll-snap, entièrement piloté par `config.json`. Prev/Next buttons avec SVG inline, `loading="eager"` sur la première image, `loading="lazy"` sur les suivantes. Scrollbar masquée (CSS `scrollbar-width: none`).
- **Interface TypeScript `GalleryConfig` + `GalleryItem`** dans `src/types/config.ts` : `{ src: string; alt: string; caption?: string }[]`.
- **Section `gallery`** dans `src/data/config.json` : 5 items de réalisations (chemins `/images/realisations/`). Extensible — ajouter un objet `{ src, alt, caption }` dans le tableau pour insérer une photo.
- **Convention de nommage des images** documentée dans `SITE_CONTENT_MAP.md` : patterns `hero-*.jpg`, `header-*.jpg`, `og-*.jpg`, `realisations/<intervention>-<état>.jpg`; chemins toujours absolus (`/images/…`).
- **Règle de contraste `backgroundType`** documentée dans `TECH_ARCHITECTURE.md` : `backgroundType="gradient"` force automatiquement `text-white` — à n'utiliser que sur des gradients sombres.

### Changed

- **Grille tarifaire réaliste** (`pricing` dans `config.json`) :
  - ~~Diagnostic 89 €~~ → **Dépannage Urgence 140 €** (déplacement 60 € + 1re heure MO 80 €)
  - ~~Intervention Standard 159 €~~ → **Forfait Chauffe-Eau / Sanitaire 250 €** (déplacement + MO inclus)
  - ~~Contrat Entretien~~ → **Installation & Rénovation — Sur devis** (devis 100 % gratuit)
  - Sous-titre mis à jour : transparence sur la majoration +50 % nuit/week-end
- **Parcours de conversion exclusif vers `/contact`** : suppression de la pop-up Tally intermédiaire ; tous les CTAs (Hero, Pricing, CTA final, Header) pointent directement vers la page dédiée.
- **`contact.astro`** : `backgroundType="gradient"` remplacé par `backgroundType="solid" background="muted"` — texte sombre sur fond clair, conforme WCAG AA.
- **`sectionOrder`** dans `config.json` : ajout de `"gallery"` entre `"testimonials"` et `"faq"`.
- **`NavigationCTA`** (`src/lib/types.ts`) : suppression des champs `tallyFormId?`, `tallyEmojiText?`, `tallyEmojiAnimation?` — interface allégée.
- **`PricingConfig`, `CTAConfig`, `NewsletterConfig`** (`src/types/config.ts`) : suppression des champs `tallyFormId?` orphelins.
- **Chemins logoCloud** normalisés de relatifs (`images/logos/…`) vers absolus (`/images/logos/…`) dans `config.json`.

### Fixed

- **Texte illisible sur `/contact`** : `backgroundType="gradient"` avec `from-primary/10 via-background to-background` forçait `text-white` sur fond quasi-blanc → texte totalement invisible. Résolu par `backgroundType="solid"`.
- **Tally popup non-fonctionnelle supprimée** : retrait de tous les `data-tally-open`, `data-tally-emoji-text`, `data-tally-emoji-animation` dans `Header.astro`.
- **`Header.astro`** : CTA primary simplifié — `<button data-tally-*>` conditionnel remplacé par un `<a href="/contact">` standard (desktop + mobile). Fermeture automatique du menu mobile incluse.
- **`AnnouncementBar.astro`** : `bg-gradient-to-r` (syntaxe Tailwind CSS 3, silencieusement ignorée) remplacé par `bg-linear-to-r` (Tailwind CSS 4).

### Removed

- Champs `tallyFormId`, `tallyEmojiText`, `tallyEmojiAnimation` de l'interface `NavigationCTA` (`src/lib/types.ts`).
- Champ `tallyFormId` de la section `cta` dans `config.json`.
- Rendu conditionnel `<button data-tally-*> / <a>` dans `Header.astro` (desktop + mobile).

---

## [1.0.0] — 2026-06-01

### Added

- **Architecture one-page** pilotée par `sectionOrder[]` dans `config.json` : l'ordre et l'activation des sections sont entièrement configurables sans modifier le code.
- **`PricingTable`** intégrée à `index.astro` (était commentée dans le template de base).
- **Ancres de navigation** dans le header : `#features`, `#pricing`, `#testimonials`, `#faq`. Wrappers `<div id="…" class="scroll-mt-20">` sur les sections cibles pour compenser le header sticky.
- **Script Tally `embed.js`** global dans `MarketingLayout.astro` (`is:inline async`) : requis pour le redimensionnement automatique de l'iframe `dynamicHeight=1` sur `/contact`.
- **`SITE_CONTENT_MAP.md`** et **`TECH_ARCHITECTURE.md`** : documentation technique et éditoriale complète (remplacent `STRUCTURE_PROJET.md`).

### Changed

- **Rebrand complet** : template SaaS générique → **Rizset Plomberie** Montpellier (34). Tous les textes, SEO, coordonnées et copywriting réécrits en français.
- **`config.json`** : réécriture intégrale — hero (layout split), features (6 services plomberie), pricing, testimonials (3 clients Montpellier), faq (5 questions), cta, footer.
- **`navigation.ts`** : 4 ancres internes en `header.main` + CTA "Demander un devis" → `/contact`.
- **`contact.astro`** : page réhumanisée — layout `split`, image artisan (`/images/header-contact.jpg`), sous-titre à la 1re personne avec numéro de téléphone visible.
- **`src/config/index.ts`** : cast `(configJson as Record<string, unknown>).newsletter ?? {}` pour la clé `newsletter` absente de `config.json` (évite l'erreur TypeScript sur propriété inexistante).

### Fixed

- **Attributs iframe HTML dépréciés** (`frameborder`, `marginheight`, `marginwidth`) remplacés par `style="border: none; margin: 0;"`.
- **`<script async src="…">` sans `is:inline`** dans `MarketingLayout.astro` : ajout de `is:inline` requis par Astro lorsqu'un tag `<script>` contient des attributs.

### Removed

- **6 pages secondaires** supprimées : `about.astro`, `faq.astro`, `features.astro`, `pricing.astro`, `customers.astro`, `testimonials.astro`.
- **7 fichiers JSON de pages** supprimés : `about.json`, `faq.json`, `features.json`, `pricing.json`, `customers.json`, `testimonials.json`, `contact.json`.
- **`STRUCTURE_PROJET.md`** remplacé par `SITE_CONTENT_MAP.md` + `TECH_ARCHITECTURE.md`.
- Sections non utilisées supprimées de `config.json` : `howItWorks`, `featureHighlight`, `bentoGrid`, `newsletter`, `integrations`, `stats`, `comparisonTable`.
