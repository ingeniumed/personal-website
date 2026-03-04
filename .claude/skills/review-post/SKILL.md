---
name: review-post
description: Review the latest blog post against writing style guidelines and update AGENTS.md with any new patterns
argument-hint: [optional-filename]
user-invocable: true
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Edit, AskUserQuestion
---

# Review a Blog Post

Review a blog post for style, grammar, and consistency with the site's writing conventions.

## Step 1: Find the Post

- If `$ARGUMENTS` is provided, find that specific post in `src/data/blog/`
- If no argument is given, find the most recently modified `.md` file in `src/data/blog/` (by file modification time, not pubDatetime)

Read the full post content.

## Step 2: Read the Style Guide

Read `AGENTS.md` and focus on the **Writing Style & Content Preferences** and **Blog Posts** sections. These are the rules to review against.

## Step 3: Review the Post

Check the post against the following categories and report findings grouped under each heading.

### Frontmatter

- All required fields present (author, pubDatetime, title, description)
- `author` is `Gopal Krishnan`
- `pubDatetime` is valid ISO 8601
- `featured` is `false`
- Tags are lowercase strings; numeric tags are quoted (e.g. `"2026"`)
- Description is concise and suitable for SEO
- No email address anywhere

### Grammar & Style

Apply the known grammar patterns from AGENTS.md:

- Unnecessary commas before "and" in compound predicates
- Misplaced commas after introductory subjects vs clauses
- "it's" vs "its"
- "how it's like" should be "what it's like"
- Preposition choices ("from the lens" → "through the lens", "information around" → "information on/about")
- Compound adjectives before nouns should be hyphenated
- Em dashes (—) should never be used (classic AI tell). Replace with commas, colons, periods, or parentheses
- Long sentences that could be broken up for readability

Also check for:
- Spelling errors
- Awkward phrasing
- Passive voice where active would be stronger
- Repeated words or phrases in close proximity

### Tone & Voice

- Conversational and personal, first person
- Warm but not overly casual — no slang, no emojis
- Comfortable being vulnerable and reflective where appropriate

### Structure

- Horizontal rules (`---`) as section dividers in longer posts
- Headings used for structure but not over-structured for short reflections
- Format matches content length (short reflection vs longer walkthrough)
- Bullet/numbered lists used where appropriate

### Content Conventions

- Links to external references where relevant
- Credit given where due
- Blockquotes used for notable quotes with attribution
- No family last names
- No email addresses

### Links

- Check that markdown links are well-formed (no broken syntax)
- Flag any links that look like they might be placeholders or incomplete

## Step 4: Present the Review

Present findings as a concise summary with specific line references and suggested fixes. Group by category. If a category has no issues, skip it — only report what needs attention.

Use this format:

```
## Review: <post title>

### <Category>
- **Line X:** <issue> → <suggested fix>
- **Line Y:** <issue> → <suggested fix>

### Summary
<1-2 sentence overall assessment>
```

## Step 5: Ask About Applying Fixes

After presenting the review, ask the user if they'd like you to apply any or all of the suggested fixes.

## Step 6: Update AGENTS.md if New Patterns Found

If during the review you notice **recurring patterns** not already documented in AGENTS.md — new grammar habits, stylistic tendencies, or content conventions — ask the user if they'd like to add them to the Writing Style section.

Only propose additions that are:
- Genuine patterns (seen in this post and consistent with the author's voice)
- Actionable for future reviews
- Not already covered by existing rules

If the user agrees, update the relevant section of AGENTS.md.
