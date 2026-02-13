# Agent Instructions — Gopal Krishnan's Personal Website

## Overview

This is the source for [personal-website.pages.dev](https://personal-website.pages.dev/), Gopal Krishnan's personal blog. It is built with [Astro](https://astro.build/) using the [AstroPaper](https://github.com/satnaing/astro-paper) theme (v5), styled with Tailwind CSS v4, and deployed to Cloudflare Pages as a fully static site (no SSR).

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
├── pages/              # Routes (index, about, posts, tags, archives, RSS, etc.)
├── styles/             # Global CSS + typography
└── utils/              # Helpers (sorting, filtering, OG generation, etc.)
public/
├── favicon.svg
├── resume.pdf          # Gopal's resume (static file, linked from About page)
└── astropaper-og.jpg   # Fallback OG image
```

## Blog Posts

### Location
All blog posts live in `src/data/blog/` as Markdown (`.md`) files.

### Frontmatter Schema
Every post requires this frontmatter:

```yaml
---
author: Gopal Krishnan           # Required
pubDatetime: 2025-01-14T03:48:50Z # Required, ISO 8601
title: My Post Title               # Required
slug: my-post-title                # Optional (auto-derived from filename)
featured: false                    # Optional, shows in Featured section on homepage
draft: false                       # Optional, hides post when true
tags:                              # Optional, defaults to ["others"]
  - personal
  - lists
description: A short description   # Required, used for SEO meta + post excerpts
ogImage: ./path-to-image.png       # Optional, auto-generated if omitted
canonicalURL: https://...          # Optional, for cross-posted content
timezone: America/Toronto          # Optional, overrides site default
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

### `src/pages/about.md`
The About page content, written in Markdown. Includes a link to `/resume.pdf`.

### `src/pages/index.astro`
The homepage. Has a personalized hero section with Gopal's intro and social links, followed by Featured and Recent Posts sections.

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
