# Nyan’s Finnish Notes

My Finnish learning notebook about daily class notes, grammar, vocabulary, phrases, and mistakes, with full-text search. Built with Astro, Markdown, and Pagefind; hosted on GitHub Pages.

A personal Finnish notebook for **https://nyanlintun.me/finnish/**. Write one Markdown file per study day; Astro builds the pages and Pagefind indexes their full text. Everything in `dist/` is static. No database, backend, paid search service, or account system.

## Run locally

### 1. Install dependencies

Use Node.js **24.20.0 LTS** and npm. The version is pinned in `.nvmrc`, which GitHub Actions also uses. From the directory containing your cloned repository, run:

```sh
cd finnish
npm ci
```

If you use nvm, run `nvm install` and `nvm use` inside the repository before `npm ci`. Both commands read `.nvmrc`. Otherwise, install Node.js 24.20.0 directly and confirm it with `node --version`.

Run `npm ci` again when the lockfile changes after pulling updates.

### 2. Run the complete site with search

```sh
npm start
```

This builds the pages and search index, then starts the local preview. Open [http://localhost:4321/finnish/](http://localhost:4321/finnish/) (or the port printed in the terminal). Search for `Helsinki` to find the sample Day 1 lesson.

Press **Ctrl+C** to stop. After editing notes, run `npm start` again to rebuild the site and search index.

### Development with live updates

```sh
npm run dev
```

Open [http://localhost:4321/finnish/](http://localhost:4321/finnish/). If that port is already in use, use the address printed in the terminal and make sure the path ends with `/finnish/`.

Edit a lesson in `src/content/lessons/` and save it; the development server updates the site automatically. Keep the terminal running while you work. Press **Ctrl+C** to stop the server.

### 3. Preview the complete site, including search

Pagefind generates its search index during the production build. Full-text search is available in the built preview, not the development server.

Stop the development server, then run:

```sh
npm run build
npm run preview
```

Open the address printed in the terminal with the `/finnish/` path (normally [http://localhost:4321/finnish/](http://localhost:4321/finnish/)). Try searching for `minun` or `Espoossa` in the sample lesson.

The preview serves the last build and does not update automatically. After changing notes, stop the preview, run `npm run build` again, and restart `npm run preview` to refresh both pages and search results.

### Optional checks before pushing

```sh
npm run build
npm test
```

The build checks the content and Astro files, generates the site, and indexes lessons. The test checks generated pages, internal links, and search index assets, so run it after a successful build.

## Local linting before commits

`npm ci` installs the local Husky pre-commit hook automatically. On each commit, lint-staged runs ESLint on staged JavaScript, TypeScript, and Astro files. Lint errors or warnings block the commit; fix them, stage the changes, and commit again.

The hook checks files without automatically fixing or formatting them. Partially staged files are checked using their staged content. Markdown, CSS, and JSON are outside this ESLint configuration; lesson metadata is still validated by the build.

To check all code manually:

```sh
npm run lint
```

Linting runs locally only; GitHub Actions still runs the existing build and output checks. Use the Node version in `.nvmrc`. If committing through a Git GUI, make sure it can find Node and npm on its PATH.

## Daily workflow

1. Copy `templates/lesson.md` to `src/content/lessons/YYYY-MM-DD-short-title.md`.
2. Update the metadata and write your notes. Keep only the topic categories covered that day. Delete unused headings.
3. Commit the file and push to `main`. GitHub Actions validates, builds, indexes, and deploys it.

You can also create or edit the Markdown file directly on GitHub. There is no separate index or menu to maintain.

```yaml
title: "Food and the partitive"
date: "2026-09-08"
day: 2
summary: "Food words and the forms I practiced today."
topics: [grammar, vocabulary]
tags: [food, partitive, partitiivi]
draft: false
```

Quote dates. Day numbers must be positive and unique among published lessons. Required fields are title, date, day, summary, and at least one topic. Topics are `grammar`, `vocabulary`, `phrases`, and `mistakes`. Tags are optional searchable words or aliases. `draft: true` excludes a lesson from published pages, browse lists, and search; a public Git repository still exposes its source. The sample lesson is explicitly illustrative and can be replaced.

## Project map

```text
src/content/lessons/      Daily Markdown notes (the normal editing surface)
src/content.config.ts    Validated lesson schema
src/layouts/Layout.astro Shared navigation and search form
src/pages/index.astro    Recent days and topic browsing
src/pages/days/          All days and generated lesson pages
src/pages/topics/        Four generated topic pages
src/pages/search.astro   Browser-only Pagefind search
src/styles/global.css   Responsive notebook styling
scripts/verify.mjs       Production-output checks
.github/workflows/      PR checks and GitHub Pages deployment
```

Architecture: Markdown → validated Astro collection → static HTML → Pagefind index → GitHub Pages. Only the search page loads the search engine. Reading lessons and browsing work without JavaScript.

## Publish to GitHub Pages

The project is installed in the local `finnish` repository. Domain settings have not been changed.

1. Create a **public repository named `finnish`** under the GitHub account that owns your personal site. Put the contents of this directory at the repository root, including the lockfile and `.github` folder.
2. Push to `main`.
3. In repository **Settings → Pages**, select **GitHub Actions** as the build source. Re-run the workflow if the initial deployment ran before Pages was enabled.
4. Configure `nyanlintun.me` on the account’s user-site repository (`<username>.github.io`) if it is not already configured there. Project sites can inherit that user-site custom domain, making this project available at `/finnish/`.
5. Verify the deployed homepage, a lesson, and a search result. Enable HTTPS once available.

**Domain prerequisite:** this setup assumes the root personal site uses GitHub Pages. If `nyanlintun.me` is hosted elsewhere, DNS alone cannot send just `/finnish/` to GitHub Pages. Integrate the generated output into that site or configure path routing at its host. Verify your existing setup before changing anything.

Do not add a `CNAME` containing `nyanlintun.me/finnish`: custom domains cannot include paths. This project intentionally has no CNAME. `site` is `https://nyanlintun.me` and `base` is `/finnish` in `astro.config.mjs`. If using only the default GitHub URL, change `site` to `https://<username>.github.io`; retain `base` for a repository named `finnish`.

GitHub Pages is available for public repositories on GitHub Free, subject to its usage limits. Pull requests build and verify but never deploy. Failed builds prevent deployment of that revision; the last successful deployment remains available.

## Search behavior

Submit the navigation search form to search titles, lesson text, examples, tags, and headings. On the search page, narrow results by topic. Results link to lessons and show plain-text excerpts, ten at a time. Search terms and filters live in the URL so a search can be bookmarked.

All lesson pages use a single English document language because the notebook explanations are English with Finnish examples. Finnish words are indexed as text, but this is not a Finnish dictionary or guaranteed inflection-aware search. Add explicit forms and aliases you want to find, such as `Espoo`, `Espoossa`, `inessive`, and `-ssa/-ssä`.

Only articles marked `data-pagefind-body` are indexed, preventing repeated navigation and browse pages from cluttering results. Search has empty, loading, no-result, and load-error states. Its input remains in the navigation with fixed sizing regardless of focus. Each submitted query has a generation number; an older asynchronous result cannot replace the latest query. There are no focus deferrals, timing hacks, or animation-suppression workarounds. No previous website implementation was supplied, so there is no prior UI defect to diagnose.

See [PRD](docs/PRD.md) for scope and acceptance criteria.

## References

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)
- [Pagefind search API](https://pagefind.app/docs/api/)
- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
