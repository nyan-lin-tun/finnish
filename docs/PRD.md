# Finnish study notebook — initial PRD

## Purpose

Help Nyan retrieve anything learned in Finnish class months later. The primary task is searching a remembered word or grammar term; the secondary task is revisiting a study day or browsing a topic.

## First version

- Public, mostly static personal knowledge base at `/finnish/`.
- One Markdown file per day, validated metadata, chronological browsing by study-day number.
- Grammar, vocabulary, phrases, and mistakes as overlapping lesson categories.
- Full-text search across every published lesson, including examples and tags.
- A persistent navigation search form, stable sizing, keyboard-accessible controls, responsive topic cards, and readable lesson tables.
- Static GitHub Pages delivery with automatic validation and indexing on push.

No login, database, CMS, external search subscription, flashcards, automatic translation, semantic AI search, or teacher-site scraping in this version.

## Content contract

The schema in `src/content.config.ts` is authoritative. A file name supplies the stable URL identifier; renaming the file changes its URL. `date` is a quoted valid calendar date; `day` is a unique positive study-day number; `title` and `summary` are nonempty; `topics` is a nonempty list of the four supported categories. `tags` defaults to an empty list and `draft` defaults to false.

Dates and day numbers are visible on lesson pages and browse listings. Content headings are author-controlled. The template offers grammar, vocabulary, phrases, mistakes, and practice sections without making all sections mandatory.

## Search design

The form is in the navigation on all routes, including its wrapped mobile layout. Submission opens `/finnish/search/?q=...`; topic filtering is optional. Search uses Pagefind’s local generated index, relevance ordering, result titles, and text excerpts. Ten results load per batch. Blank input gives guidance, no matches suggests another term, failures retain normal browsing links, and a generation counter discards stale asynchronous responses. There is no speculative typeahead or custom scheduling.

Finnish and English text share one index. Exact written forms and useful aliases belong in the notes; morphological equivalence and typo correction are not acceptance promises. Search is a convenience layer over accessible static pages.

## Acceptance criteria

1. Adding one valid published Markdown lesson automatically creates its page and adds it to day/topic lists and the next search index.
2. Invalid metadata or duplicate published day numbers fails the build.
3. Drafts have neither generated lesson pages nor index entries.
4. The illustrative lesson is discoverable using `minun`, `Espoossa`, and `vocabulary`.
5. Lesson and search asset URLs remain under `/finnish/`.
6. Main navigation, topic pages, and lessons work without JavaScript; search explains its JavaScript requirement.
7. Changing search focus does not relocate or resize the search field. An older query never overwrites newer results.
8. Pull requests validate only; pushes to main deploy only after successful validation and index generation.

## Validation and release

`npm run build` performs Astro diagnostics, static generation, and indexing. `npm test` inspects published output, internal paths, and generated index assets. For release, manually submit `minun`, filter by grammar, try an unmatched query, clear the input, and inspect narrow-screen navigation with the keyboard. Confirm the custom-domain prerequisite in the README before enabling the production URL.

## Open deployment dependency

The existing root-domain hosting has not been inspected. Publication at the intended subpath requires either inherited GitHub Pages domain routing or integration at the root host. Initial delivery prepares the repository and workflow without changing that existing website.
