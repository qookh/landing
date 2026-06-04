# Guide de déploiement — Rizset Plomberie Landing

## Stack

| Outil | Version requise | Raison |
|---|---|---|
| Node.js | `>=22.12.0` | Astro 6 minimum |
| npm | `10.x` (via Cloudflare) | npm 11 a des bugs de déduplication |
| Astro | `^6.4.2` | — |
| Vite | `^7.3.2` (override) | Vite 8 + rolldown 1.0.3 casse `@tailwindcss/vite` |

---

## Fichiers de configuration critiques

### `.nvmrc`
```
22
```
Cloudflare lit ce fichier pour choisir la version Node. Ne pas mettre `20` (trop vieux pour Astro 6) ni `25` (trop récent, bugs npm v11).

### `.npmrc`
```
install-strategy=hoisted
```
Force npm v11 à hoisser les dépendances comme npm v10. Sans ça, npm v11 omet des paquets transitifs (`micromark-util-html-tag-name`, etc.).

### `package.json` — override vite
```json
"overrides": { "vite": "^7.3.2" }
```
Empêche npm de résoudre vers vite 8 (qui casse `@tailwindcss/vite` 4.3.0 via rolldown 1.0.3).

### `scripts/patch-unist.mjs` + `postinstall`
Crée les fichiers `color.node.js` et `color.js` manquants dans `unist-util-visit-parents` v6.0.x. Tourne automatiquement après chaque `npm install`.

### `wrangler.jsonc`
```json
{
  "name": "landing",
  "compatibility_date": "2026-06-03",
  "assets": { "directory": "./dist" }
}
```
Sans ce fichier, wrangler relance son wizard à chaque déploiement et tente de créer un KV Namespace qui existe déjà → erreur 10014.

---

## Checklist avant chaque push

```bash
# 1. Vérifier la version de vite installée (doit être 7.x)
cat node_modules/vite/package.json | grep '"version"'

# 2. Build local complet
npm run build

# 3. Vérifier que les 7 pages sont générées sans erreur
#    Attendu dans les logs :
#    [build] 7 page(s) built in Xs
#    [build] Complete!
```

**Si une nouvelle icône est ajoutée dans `config.json` ou un composant `.astro` :**
→ L'ajouter impérativement dans la liste `include.lucide` ou `include.simple-icons` de `astro.config.mjs`.
Sans ça : `Unable to locate 'lucide:xxx' icon!` au build.

---

## Configuration Cloudflare Pages

| Paramètre | Valeur |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Deploy command | `npx wrangler deploy` |
| Node.js version | `22` (lu depuis `.nvmrc`) |
| Variable d'env | `SITE_URL=https://rizset-plomberie.fr` |

**Important** : définir `SITE_URL` dans le dashboard Cloudflare → Workers & Pages → landing → Settings → Environment variables. Sans ça le sitemap pointe vers `http://localhost:4321`.

### `.env` local — seules 2 variables nécessaires

```bash
SITE_URL=https://rizset-plomberie.fr   # override URL canonique (sitemap, OG)
SITE_AUTHOR=Quoc-Khai TRINH            # auteur meta tags
```

`SITE_NAME` et `SITE_DESCRIPTION` **ne doivent pas être présents** — `config.json` est la source de vérité unique pour ces valeurs. Les renseigner dans `.env` les écraserait silencieusement.

---

## Problèmes connus

### Git crash SIGBUS sur macOS 26 Tahoe
`git commit` peut terminer avec `bus error` (exit 138) ou `zsh: bus error`. Le commit est **quand même créé** — git écrit les objets avant de crasher.

```bash
# Vérifier que le commit existe
git log --oneline -3

# S'il est là mais que master ne pointe pas dessus :
# Éditer .git/packed-refs et mettre le bon hash pour refs/heads/master
# Puis supprimer le lock s'il existe :
rm -f .git/index.lock

# Ensuite pousser normalement
git push origin master
```

### npm v11 omet des paquets (Node 25 local)
Si `npm run dev` échoue avec `Cannot find package 'micromark-*'` ou similaire :
```bash
rm -rf node_modules package-lock.json
npm install
```
Le `.npmrc` + l'override vite résolvent le problème au réinstall.

### Vite 8 installé malgré l'override
Si `cat node_modules/vite/package.json | grep version` retourne `8.x` :
```bash
rm -rf node_modules package-lock.json
npm install
# Vérifier à nouveau — doit être 7.3.x
```

---

## Flux de déploiement complet

```
git add <fichiers>
git commit -m "message"
# → Si bus error : vérifier git log, le commit existe probablement

git push origin master
# → Cloudflare Pages détecte le push
# → npm clean-install (554 packages, postinstall patch)
# → npm run build → 7 pages générées dans dist/
# → npx wrangler deploy → upload vers Workers Assets
# → Site live
```
