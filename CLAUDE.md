# CLAUDE.md — Gopal Krishnan's Personal Website

## Project Overview

Personal blog at [gkrishnan.blog](https://gkrishnan.blog/) — a static site about software development, parenting, and books. Originally based on the [AstroPaper](https://github.com/satnaing/astro-paper) v5 theme, now significantly customized and upgraded to Astro v6.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6 (static output, no SSR) — upgraded ahead of upstream AstroPaper, which is still on Astro v5 |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` plugin |
| Content | Markdown files in `src/data/blog/` with Zod-validated frontmatter |
| Search | Pagefind (client-side, indexed at build time) |
| OG Images | Satori + resvg-js (auto-generated per post at build) |
| Font | Google Sans Code (loaded via Astro's font system) |
| Testing | Vitest |
| Linting | ESLint (flat config) + Prettier |
| Deployment | Cloudflare Pages (static, pushes to `main` auto-deploy) |
| Package Manager | **pnpm only** — never use npm or yarn |

## Directory Structure

```
src/
├── assets/
│   ├── icons/            # SVG icons (socials, UI elements)
│   └── images/           # Blog images (Astro-optimized)
├── components/           # Astro components (Header, Footer, Card, etc.)
├── config.ts             # Site metadata: title, author, URL, timezone, pagination
├── constants.ts          # Social links and share link definitions
├── content.config.ts     # Blog collection schema (Zod + glob loader)
├── data/blog/            # Blog posts as .md files
├── layouts/              # Layout components (Layout, Main, PostDetails)
├── pages/                # File-based routes
│   ├── index.astro       # Homepage with avatar hero + recent posts
│   ├── about.astro       # About page (custom, not markdown-based)
│   ├── search.astro      # Pagefind search UI
│   ├── posts/            # Blog post listing + individual post routes
│   ├── rss.xml.ts        # RSS feed endpoint
│   ├── robots.txt.ts     # Dynamic robots.txt
│   └── og.png.ts         # Site-level OG image (Satori)
├── scripts/theme.ts      # Dark/light theme toggle logic
├── styles/
│   ├── global.css         # Tailwind imports, CSS custom properties, theme colors
│   └── typography.css     # Prose/typography styles
└── utils/
    ├── getSortedPosts.ts  # Sort + filter posts for display
    ├── postFilter.ts      # Draft/scheduled post filtering
    ├── slugify.ts         # URL slug generation
    ├── getPath.ts         # Post path resolution
    ├── generateOgImages.ts# Satori OG image generation
    ├── loadGoogleFont.ts  # Font loading for OG images
    ├── remark/            # Custom remark plugins (TOC collapse)
    └── transformers/      # Shiki code block transformers (filename display)
public/
├── favicon.svg
├── resume.pdf            # Static resume file
└── pagefind/             # Built search index (generated, gitignored)
```

## Key Commands

```bash
pnpm dev              # Local dev server (drafts + future posts visible)
pnpm build            # Type-check + Astro build + Pagefind index
pnpm preview          # Preview production build locally
pnpm lint             # ESLint
pnpm format:check     # Prettier check
pnpm format           # Prettier fix
pnpm test             # Vitest (run once)
pnpm test:watch       # Vitest (watch mode)
pnpm build && pnpm test:e2e   # Playwright e2e tests (must build first — Pagefind search requires built index; tests live in e2e-tests/)
pnpm test:e2e:ui      # Playwright UI mode (interactive debugging)
```

Build runs: `astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/`

Pre-deploy checklist: `pnpm format && pnpm lint && pnpm test && pnpm build` — all must pass.

**e2e tests require a prior `pnpm build`** — they run against `pnpm preview` (the static build output). Pagefind search only works once the index is built.

**404 page behaviour note:** Astro's local preview server may redirect unknown URLs to `index.html` rather than `404.html`. The e2e tests navigate directly to `/404` to sidestep this. On Cloudflare Pages (current host), unknown paths correctly serve `404.html` automatically — but this behaviour is host-specific. If you ever switch providers, verify your host also serves `404.html` for unknown paths and update the test comment in `e2e-tests/404.spec.ts` accordingly.

## Blog Post Frontmatter

Posts live in `src/data/blog/*.md`. Schema defined in `src/content.config.ts`:

```yaml
---
author: Gopal Krishnan           # Required (defaults to SITE.author)
pubDatetime: 2025-01-14T03:48:50Z # Required, ISO 8601 UTC with Z suffix
title: My Post Title               # Required
description: A short description   # Required (SEO meta + excerpts)
modDatetime: 2025-02-01T00:00:00Z  # Optional
slug: my-post-title                # Optional (auto-derived from filename)
draft: false                       # Optional, hides post when true
featured: false                    # Optional
ogImage: ./path-to-image.png       # Optional (auto-generated if omitted)
canonicalURL: https://...          # Optional
timezone: Australia/Sydney          # Optional (overrides site default)
hideEditPost: false                # Optional
---
```

Files prefixed with `_` are excluded from the collection (glob pattern: `**/[^_]*.md`).

## Architecture Decisions

### Routing
File-based routing via Astro pages. Posts use `[...slug]/index.astro` with `getStaticPaths()`. No dynamic/SSR routes.

### Content Management
- Blog posts are Markdown in `src/data/blog/` using Astro's content collections with a glob loader
- Schema validated via Zod in `src/content.config.ts`
- Posts filtered by `postFilter.ts`: hides drafts and future-dated posts in production (with 15-min margin)
- In dev mode, all non-draft posts are visible regardless of publish date

### Theme System
- Light/dark mode via `data-theme` attribute on `<html>`
- CSS custom properties defined in `global.css` (e.g., `--background`, `--foreground`, `--accent`)
- Inline script in `Layout.astro` prevents FOUC by setting theme before paint
- Tailwind dark variant uses `@custom-variant dark` targeting `[data-theme=dark]`

### OG Images
- Per-post OG images generated at build time via Satori + resvg
- Site-level OG image at `/og.png` (also Satori-generated)
- Requires internet access during build to fetch Google Fonts
- Can be disabled via `dynamicOgImage: false` in `config.ts`

### Code Highlighting
- Shiki with dual themes (min-light / night-owl)
- Custom transformers: filename display, diff notation, line highlighting, word highlighting

### Removed Upstream Features
Tags, archives page, and featured/recent post split on homepage have been **intentionally removed**. Do not re-add them.

## Gotchas and Conventions

- **pnpm only** — the project has `pnpm-lock.yaml` and `pnpm.overrides` for security patches
- **No SSR** — fully static. Do not add `@astrojs/cloudflare` adapter
- **No email on site** — Gopal's email must never appear anywhere on the site (resume PDF is the exception)
- **No em dashes** — considered a tell of AI writing. Use commas, colons, periods, or parentheses instead
- **TypeScript** — always write `.ts` over `.js`. Project uses `astro/tsconfigs/strict`
- **Path alias** — `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- **Test files** live alongside source (e.g., `slugify.ts` / `slugify.test.ts`), not in a separate directory
- **`no-console` ESLint rule** is set to `error`
- **Vitest env override** — `test.env.DEV` is set to `""` so tests exercise production-like post filtering (date scheduling enforced, not bypassed)
- **Images in posts** go in `src/assets/images/` for optimization, referenced as `@/assets/images/filename.png`
- **Blog frontmatter dates** use ISO 8601 UTC with Z suffix (e.g., `2026-03-30T10:00:00Z`)
- **CI** runs on every PR via GitHub Actions: lint, format check, test, build (`.github/workflows/ci.yml`, Node 22, pnpm 10.11.1)

## Deployment

Cloudflare Pages. Pushes to `main` trigger automatic deployment. The site is fully static with no server-side rendering.

## Content Guidelines

When creating or editing blog posts on Gopal's behalf, follow these guidelines.

**Tone & Voice:**
- Conversational and personal — like talking to a friend, not writing an essay
- First person throughout
- Warm but not overly casual. No slang, no emojis
- Comfortable being vulnerable and reflective (sharing personal experiences, crediting family)

**Structure:**
- Use horizontal rules (`---`) as section dividers in longer posts
- Clear headings for structure, but don't over-structure short reflections
- Posts range from short personal reflections (~4 paragraphs) to longer walkthroughs with multiple sections — match the format to the content
- Bullet and numbered lists are used frequently, especially for book lists and step-by-step breakdowns

**Content habits:**
- Links generously to external references (Goodreads for books, company sites, other people's blog posts)
- Gives credit where it's due (colleagues, wife, parents, other bloggers)
- Recurring themes: books/reading, work/career at Automattic, parenting, personal growth
- Annual "Books I read in [year]" post is an ongoing tradition
- Blockquotes are used for notable quotes, with attribution

**Grammar habits to watch for when reviewing drafts:**
- Avoid unnecessary commas before "and" in compound predicates (e.g. "I signed up for X, and realized" → "I signed up for X and realized"). A comma before "and" is only needed when joining two independent clauses (each with its own subject)
- Watch for commas after introductory subjects rather than after introductory clauses (e.g. "after you apply, is" → "after you apply is")
- Watch for "it's" vs "its" — possessive "its" has no apostrophe
- "how it's like" should be "what it's like"
- Preposition choices: "from the lens" → "through the lens", "information around" → "information on/about"
- Compound adjectives before nouns should be hyphenated (e.g. "hand-wavy", "front-end", "back-end")
- **Never use em dashes (—)** — they are a classic tell of AI-generated writing. Use commas, colons, periods, or parentheses instead
- Long sentences can sometimes be broken into two for readability, especially when listing many items

**Privacy:**
- Never include Gopal's email address anywhere on the site (exception: the resume PDF in `public/resume.pdf` may contain it, since it is a static document intended for professional use)
- No last names for family members (refers to "my wife", "my son", "my parents", "my brother")

## Areas of Improvement

- **No automated link checking.** Blog posts link to external sites (Goodreads, job listings, YouTube) that can go stale over time.
- **Legacy draft posts.** Some old AstroPaper sample posts may still exist in `src/data/blog/` marked as `draft: true`. These are invisible but could be cleaned up.
- **Pagefind copy workaround.** The build copies `dist/pagefind` to `public/pagefind` as a post-build step. This is gitignored but adds complexity to the build pipeline.
- **`editPost` is disabled.** The config has `editPost.enabled: false` with a GitHub URL configured. Could be re-enabled for a "suggest edits" workflow.
- **No preview/staging documentation.** Cloudflare Pages likely provides preview deployments on PRs, but this is not documented in the repo.

## Relationship to AstroPaper

This project was originally based on the [AstroPaper](https://github.com/satnaing/astro-paper) v5 theme but has diverged significantly: upgraded to **Astro 6** (upstream is still on v5), removed features (tags, archives), added custom layouts, enhanced SEO, converted to TypeScript throughout, and upgraded to Tailwind CSS 4. It is independently maintained, not a fork that tracks upstream.

### Astro v5 to v6 version gap

This is the single largest divergence point. Upstream AstroPaper targets Astro v5; this project runs Astro v6. Upstream code may rely on v5 APIs that have changed or been removed in v6 (content collections, config helpers, image handling, routing, font loading). Any upstream code considered for adoption must be verified against v6 and adapted, never copied verbatim.

### Default stance: independent maintenance

Day-to-day work should not involve upstream at all. Keep dependencies current with `pnpm update`, apply security patches via `pnpm.overrides`, and evolve the codebase on its own terms.

- **Dependencies:** Security patches go in `pnpm.overrides` when transitive deps lag behind.
- **TypeScript:** All new code should be TypeScript. Convert remaining JS files to TS when touching them.
- **Unused dependencies:** Drop packages that are no longer needed rather than carrying dead weight.

### When upstream sync is worth considering

Occasionally, AstroPaper releases changes that are worth cherry-picking:
- **Security or accessibility fixes** in shared components
- **Bug fixes** in utilities this project still shares with upstream (e.g., `postFilter`, `slugify`, remark plugins)
- **Significant UX improvements** to layout or component patterns

Do NOT sync for: new features this project has removed (tags, archives, featured posts), cosmetic tweaks, dependency bumps (handle those independently), or Astro version migration (this project is already ahead of upstream).

### How to approach a selective sync

Never do a full merge or rebase from upstream. Always cherry-pick file by file. Because of the Astro v5-to-v6 gap, treat every cherry-pick as a port, not a copy:

1. **Clone or pull upstream** separately (do not add as a git remote to this repo).
2. **Diff only the relevant files.** Focus on structural/code/styling:
   - `src/components/**`, `src/layouts/**`, `src/pages/**` (excluding content)
   - `src/utils/**`, `src/styles/**`, `src/scripts/**`
   - `src/content.config.ts`
   - `astro.config.ts`, `tsconfig.json`, `eslint.config.js`
   - `package.json` (dependency versions only)
3. **For each diff, decide:** is this a theme improvement to adopt, or a divergence to keep? If adopting, check whether it uses Astro v5 APIs (content collections, config helpers, image components, routing) that need adapting to v6.
4. **Apply changes manually** to this repo, not via patch/merge tooling. Treat each change as a port.
5. **Run the full check suite** afterward: `pnpm format && pnpm lint && pnpm test && pnpm build`

### Files to protect (never overwrite with upstream)

These have intentional customizations:
- `src/config.ts` -- personal site metadata
- `src/constants.ts` -- personal social links
- `src/pages/index.astro` -- custom avatar hero layout, single posts section
- `src/pages/about.astro` -- custom Astro component (upstream uses `about.md`)
- `src/layouts/Layout.astro` -- enhanced SEO structured data (BlogPosting/Person schema, og:type, article:author)
- `src/components/Socials.astro` -- has `rel="me"` for IndieWeb/Mastodon verification
- `src/components/Footer.astro` -- personal name in copyright
- `src/components/Header.astro` -- hardcoded site title
- `src/pages/posts/[...page].astro` -- custom description meta

### Upstream-only files to ignore

These exist upstream but are not used here:
- Docker files, `.vscode/`, community templates (`CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, etc.)
- Demo images, `CHANGELOG.md`, `cz.yaml`, `AstroPaper-lighthouse-score.svg`
- Demo blog posts in `src/data/blog/`

### Intentionally removed upstream features

These were deliberately excluded and must NOT be re-added, even if upstream improves them:
- **Tags** -- entirely removed (pages, nav, schema, frontmatter, PostDetails display)
- **Archives page** -- `showArchives: false` in config
- **Featured/recent post split** on homepage -- uses a single flat "Posts" section
