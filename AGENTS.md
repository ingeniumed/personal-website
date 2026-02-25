# Agent Instructions — Gopal Krishnan's Personal Website

## Overview

This is the source for [gkrishnan.blog](https://gkrishnan.blog/), Gopal Krishnan's personal blog. It is built with [Astro](https://astro.build/) using the [AstroPaper](https://github.com/satnaing/astro-paper) theme (v5), styled with Tailwind CSS v4, and deployed to Cloudflare Pages as a fully static site (no SSR).

## Tech Stack

- **Framework:** Astro 5
- **Styling:** Tailwind CSS 4
- **Search:** Pagefind (client-side static search, indexed at build time)
- **OG Images:** Auto-generated at build time via Satori + resvg (requires internet access to fetch Google Fonts)
- **Package Manager:** pnpm (see `pnpm-lock.yaml`), though npm also works
- **Deployment:** Cloudflare Pages (static output)

## Project Structure

```
src/
├── assets/
│   ├── icons/          # SVG icons for socials, UI
│   └── images/         # Blog post images (optimized by Astro)
├── components/         # Astro components (Header, Footer, Card, etc.)
├── config.ts           # Site-wide config (title, author, URL, etc.)
├── constants.ts        # Social links, share links
├── content.config.ts   # Content collection schema (blog post frontmatter)
├── data/
│   └── blog/           # Blog posts as Markdown files
├── layouts/            # Page layouts
├── pages/              # Routes (index, about, posts, RSS, search)
├── styles/             # Global CSS + typography
└── utils/              # Helpers (sorting, filtering, OG generation, etc.)
public/
├── favicon.svg
├── resume.pdf          # Gopal's resume (static file, linked from About page)
└── og.png              # Generated dynamically by Satori at build time
```

## Blog Posts

### Location
All blog posts live in `src/data/blog/` as Markdown (`.md`) files.

### Frontmatter Schema
Every post requires this frontmatter:

```yaml
---
author: Gopal Krishnan           # Required
pubDatetime: 2025-01-14T03:48:50Z # Required, ISO 8601 UTC (always use Z suffix, never timezone offsets)
title: My Post Title               # Required
slug: my-post-title                # Optional (auto-derived from filename)
featured: false                    # Optional, not currently used but kept in schema
draft: false                       # Optional, hides post when true
tags:                              # Optional, defaults to ["others"]
  - personal
  - lists
description: A short description   # Required, used for SEO meta + post excerpts
ogImage: ./path-to-image.png       # Optional, auto-generated if omitted
canonicalURL: https://...          # Optional, for cross-posted content
timezone: Australia/Sydney          # Optional, overrides site default
---
```

### Adding a New Post
1. Create a new `.md` file in `src/data/blog/`
2. Add the required frontmatter (author, pubDatetime, title, description)
3. Write content in standard Markdown below the frontmatter
4. Images should go in `src/assets/images/` and be referenced as `@/assets/images/filename.png` or with a relative path

### Images in Posts
- Place images in `src/assets/images/` for Astro's image optimization
- Reference them in Markdown: `![alt text](@/assets/images/my-image.png)`
- For unoptimized static assets, use `public/` and reference with absolute paths: `![alt text](/my-image.png)`

### Draft & Scheduled Posts
- `draft: true` hides a post entirely
- A future `pubDatetime` hides the post in production until 15 minutes before the publish time
- In dev mode (`npm run dev`), all non-draft posts are visible regardless of date

## Key Configuration Files

### `src/config.ts`
Site metadata: title, author, description, URL, timezone, OG image settings, posts per page. This is the main file to edit for site-wide changes.

### `src/constants.ts`
Social media links displayed in the footer and share buttons on posts. Currently configured with GitHub and LinkedIn only. No email link (Gopal prefers to keep it private).

### `src/pages/about.astro`
The About page. Uses Astro's `<Image>` component for the profile photo (auto-optimized). Includes bio, hobbies, link to the Automattic post, and resume link.

### `src/pages/index.astro`
The homepage. Has a short hero section with social links, followed by a single chronological "Posts" section (showing `postPerIndex` most recent posts) and an "All Posts" link.

### Removed pages
Tags (`/tags`) and Archives (`/archives`) have been intentionally removed. Tags are still stored in post frontmatter but are not displayed or linked anywhere on the site.

## Build & Development

```bash
# Install dependencies
pnpm install    # or npm install

# Local dev server
pnpm dev        # or npm run dev

# Production build (includes type-check, Astro build, and Pagefind indexing)
pnpm build      # or npm run build

# Preview production build
pnpm preview    # or npm run preview
```

The build command runs: `astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/`

## CI/CD

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs automatically on every pull request. It:

1. Installs dependencies with pnpm
2. Runs linting (`pnpm run lint`)
3. Checks code formatting (`pnpm run format:check`)
4. Runs a full production build (`pnpm run build`)

The site is deployed to Cloudflare Pages. Pushes to `main` trigger a deploy automatically.

## Writing Style & Content Preferences

When creating or editing blog posts on Gopal's behalf, follow these guidelines inferred from his existing writing:

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

**Common grammar habits to watch for when reviewing drafts:**
- Tends to add unnecessary commas before "and" in compound predicates (e.g. "I signed up for X, and realized" → "I signed up for X and realized"). A comma before "and" is only needed when joining two independent clauses (each with its own subject)
- Occasionally places commas after introductory subjects rather than after introductory clauses (e.g. "after you apply, is" → "after you apply is")
- Watch for "it's" vs "its" — possessive "its" has no apostrophe
- "how it's like" should be "what it's like"
- Preposition choices: "from the lens" → "through the lens", "information around" → "information on/about"
- Compound adjectives before nouns should be hyphenated (e.g. "hand-wavy", "front-end", "back-end")
- Uses hyphens where em dashes (—) are more appropriate for parenthetical asides
- Long sentences can sometimes be broken into two for readability, especially when listing many items

**Privacy:**
- Never include Gopal's email address anywhere on the site
- No last names for family members (refers to "my wife", "my son", "my parents", "my brother")

**Tags:**
- Lowercase
- Common tags: `personal`, `lists`, `work`, `automattic`
- Year tags (e.g. `2024`) used for annual list posts

## Important Notes

- **No SSR:** This is a fully static site. Do not add the `@astrojs/cloudflare` adapter unless switching to SSR.
- **No email on site:** Gopal has explicitly requested that his email not appear anywhere on the site.
- **OG image generation requires internet:** The build fetches Google Fonts (Google Sans Code) for dynamic OG images. If building offline, set `dynamicOgImage: false` in `config.ts`.
- **Legacy draft posts:** There are some old AstroPaper sample posts still in `src/data/blog/` marked with `draft: true`. These are invisible on the site and can be safely deleted.
- **Existing blog:** This site was migrated from a WordPress blog at gkrishnan.blog in February 2026. The WordPress export XML is not included in the repo.
- **Tag quoting in frontmatter:** Numeric tag values (e.g. `2024`) must be quoted as strings (`"2024"`) in YAML frontmatter — the Zod content schema validates tags as `string[]`, and unquoted YAML numbers will fail the build.
- **OG image:** The site-level OG image is dynamically generated at `/og.png` via Satori. The `ogImage` field in `config.ts` points to `og.png`. There is no static fallback image in `public/` — if `dynamicOgImage` is set to `false`, you would need to add a static OG image manually.
- **External links in posts:** Blog posts link to external sites (Goodreads, Automattic, YouTube, etc.). These should be periodically verified — job listing URLs and third-party blog posts can go stale over time.

## Upgrading from Upstream AstroPaper

The upstream AstroPaper theme lives at `/Users/gopalkrishnan/Documents/git-repos/astro-paper` (clone of https://github.com/satnaing/astro-paper). When upgrading, compare theme files between the two repos and apply changes selectively.

### What to compare

Focus on structural/code/styling files. Diff these directories and files between the two repos:
- `src/components/**`
- `src/layouts/**`
- `src/pages/**` (excluding content-only differences)
- `src/utils/**`, `src/lib/**`
- `src/styles/**`
- `src/content.config.ts`
- `src/scripts/**`
- `package.json` (dependencies and scripts only — name/version will differ)
- `astro.config.ts`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.mjs`
- `.github/workflows/ci.yml`
- `public/` (favicon, icons — not personal assets)

### What to skip (personal customizations to preserve)

These files have intentional customizations that should NOT be overwritten with upstream versions:
- `src/config.ts` — personal site metadata (title, URL, author, timezone, etc.)
- `src/constants.ts` — personal social links
- `src/pages/index.astro` — custom avatar hero layout, single posts section (no featured/recent split)
- `src/pages/about.astro` — custom Astro component (upstream uses `about.md`)
- `src/layouts/Layout.astro` — enhanced SEO structured data (BlogPosting vs Person schema, og:type, og:site_name, article:author)
- `src/components/Socials.astro` — has `rel="me"` for IndieWeb/Mastodon verification
- `src/components/Footer.astro` — includes personal name in copyright
- `src/components/Header.astro` — hardcodes site title as "Gopal Krishnan"
- `src/pages/posts/[...page].astro` — custom description meta

### Intentionally removed upstream features

These upstream features have been deliberately excluded and should NOT be re-added during upgrades:
- **Tags pages** (`src/pages/tags/`) — Gopal does not want tag browsing; search and all-posts are the discovery mechanisms
- **Tags nav link** in Header — removed along with tags pages
- **Tags display in PostDetails** — not shown at bottom of posts
- **Archives page** (`src/pages/archives/`) — `showArchives` is set to `false` in config
- **Featured/recent post split** on homepage — uses a single flat "Posts" section instead

### Upstream-only files to ignore

These exist in the upstream repo but are not needed in the personal site:
- `.dockerignore`, `Dockerfile`, `docker-compose.yml`
- `.github/CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `FUNDING.yml`, issue/PR templates
- `.vscode/` workspace settings
- `AstroPaper-lighthouse-score.svg`, `CHANGELOG.md`, `cz.yaml`
- `public/astropaper-og.jpg` and demo images in `src/assets/images/AstroPaper-v*.png`
- Demo blog posts in `src/data/blog/`

### Upgrade process

1. Pull the latest upstream: `cd /Users/gopalkrishnan/Documents/git-repos/astro-paper && git pull`
2. Diff shared theme files between the two repos (exclude files listed in "skip" and "removed" sections above)
3. For each difference, determine if it's a theme improvement to adopt or a personal customization to keep
4. Apply theme improvements to the personal website
5. Run `pnpm build` to verify nothing is broken

## Pre-Launch / Pre-Deploy Checklist

Before deploying, always run:

```bash
pnpm format        # Fix formatting
pnpm lint          # Check for lint errors
pnpm build         # Full production build (type-check + Astro build + Pagefind)
```

All three must pass cleanly before pushing.
