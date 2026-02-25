---
name: new-post
description: Interactively create a new blog post with proper frontmatter and structure
user-invocable: true
disable-model-invocation: true
---

# Create a New Blog Post

Guide the user through creating a new blog post for gkrishnan.blog.

## Step 1: Gather Information

Ask the user for the following, one question at a time using AskUserQuestion:

1. **Title** — the post title (free text)
2. **Description** — a short summary for SEO meta and post excerpts (free text)
3. **Tags** — pick from existing tags or suggest new ones. Check `src/data/blog/` for tags currently in use. Tags must be lowercase strings. Numeric tags like year tags must be quoted in YAML (e.g. `"2024"`)
4. **Draft?** — whether to publish immediately or save as draft (default: not a draft)
5. **OG Image** — whether they have a custom OG image or want it auto-generated (default: auto-generated)

## Step 2: Create the File

- **Location:** `src/data/blog/`
- **Filename:** kebab-case derived from the title, with `.md` extension
- **pubDatetime:** current time in ISO 8601 UTC format (ending with `Z`, e.g. `2025-01-14T03:48:50Z`). Do NOT use timezone offsets like `+11:00`
- **author:** `Gopal Krishnan`
- **slug:** same as filename without `.md`, unless the user wants something different

### Frontmatter Template

```yaml
---
author: Gopal Krishnan
pubDatetime: <current datetime ISO 8601>
title: <title>
slug: <kebab-case-slug>
featured: false
draft: <true or false>
tags:
  - <tag1>
  - <tag2>
description: <description>
---
```

Only include `ogImage` if the user provided a custom one. Omit it entirely for auto-generation.
Only include `canonicalURL` if the user mentions cross-posting.

## Step 3: Add Starter Content

After the frontmatter, add a brief placeholder to get them started:

```markdown

Write your post here.
```

Then tell the user the file has been created and they can start writing, or ask if they'd like help drafting content.

## Writing Style Reference

If the user asks for help drafting, follow the writing style guidelines in AGENTS.md — conversational, first-person, warm but not overly casual, no emojis. Use horizontal rules as section dividers in longer posts.

## Important Rules

- Tags are lowercase. Numeric tags must be quoted as strings in YAML.
- Never include an email address anywhere.
- The `featured` field should always be `false` (featured posts are not used on this site).
- Refer to family members without last names.
