# personal-website

Source code for my [my personal blog](https://gkrishnan.blog/).

## Tech Stack

- [Astro](https://astro.build/): static site generator
- [Tailwind CSS](https://tailwindcss.com/): styling
- [Pagefind](https://pagefind.app/): client-side static search
- [Satori](https://github.com/vercel/satori): dynamic OG image generation at build time
- [TypeScript](https://www.typescriptlang.org/)

Based on the [AstroPaper](https://github.com/satnaing/astro-paper) theme.

## Hosting

Deployed as a static site on [Cloudflare Pages](https://pages.cloudflare.com/). Pushes to `main` trigger a deploy automatically.

## Getting Started

**Prerequisites:** Node.js 22+ and pnpm.

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev

# Production build
pnpm build

# Preview the production build locally
pnpm preview
```

The build command runs type-checking, builds the site, generates the Pagefind search index, and copies it to the public directory.

## Adding a Blog Post

Create a new `.md` file in `src/data/blog/` with this frontmatter:

```yaml
---
author: Gopal Krishnan
pubDatetime: 2026-01-05T03:05:04Z
title: My Post Title
slug: my-post-title
featured: false
description: A short description for SEO and post excerpts.
---
Post content in Markdown goes here.
```

Images go in `src/assets/images/` and can be referenced as `![alt](@/assets/images/filename.png)`.

## Project Structure

```
src/
├── assets/images/    # Blog post and site images (optimized by Astro)
├── components/       # Astro UI components
├── config.ts         # Site-wide configuration
├── constants.ts      # Social links
├── data/blog/        # Blog posts (Markdown)
├── layouts/          # Page layouts
├── pages/            # Routes (index, about, posts, RSS, etc.)
├── styles/           # Global CSS and typography
└── utils/            # Helpers for sorting, filtering, OG generation
public/
├── favicon.svg
├── resume.pdf
└── og.png            # Generated dynamically by Satori at build time
```

## CI

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every pull request. It lints, checks formatting, and runs a full production build.

## License

The source code is licensed under the [MIT License](LICENSE). Blog content (`src/data/blog/`), images (`src/assets/images/`), and the resume (`public/resume.pdf`) are copyright Gopal Krishnan, all rights reserved.
