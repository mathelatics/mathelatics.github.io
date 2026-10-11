# Personal Website : [https://mathelatics.github.io/](https://mathelatics.github.io/)

## ⚛️ Quantum Academic & Research Portfolio — Overview

A **modern, dark-themed, single-page portfolio** for a quantum scientist & LGBTQ+ advocate —
inspired by the minimal spirit of the [Smigle Hugo theme](https://gitlab.com/ian-s-mcb/smigle-hugo-theme),
rebuilt as a zero-dependency static site that deploys straight to **GitHub Pages**.

### ✨ What's inside

| Section | Highlights |
|---|---|
| **Hero** | Animated pride-gradient avatar ring, gradient name, pronoun chip, social buttons (GitHub / Scholar / ORCID / LinkedIn / Mastodon), count-up stats |
| **About** | Markdown-driven bio (`src/content/about/about.md`) with a link to the full CV page |
| **Research** | 5 color-accented research-thrust cards with hover glow |
| **Publications** | Year-tagged list with DOIs, venue, tags & citation badges |
| **Projects** | GitHub-style open-source cards (stars, language, badges) |
| **Talks** | Timeline list with keynote / invited / panel / tutorial pills |
| **CV** | Dedicated page (`cv.html`) — gradient timeline, awards/service, plus Markdown teaching table, mentoring & grants (`src/content/cv/cv.md`); downloadable PDF auto-generated at build; linked from About and homepage |
| **Contact** | Styled form + office-hours block |

**Visual system:** deep-space navy `#0b0e1a`, quantum violet/cyan/pink gradients, pride-rainbow bars,
Sora + Inter + JetBrains Mono type stack, glassmorphism cards, scroll-reveal animations,
and an interactive **quantum-entanglement particle canvas** (particles attract to your cursor — "observer effect" 🛰️).

**Quality:** fully responsive, keyboard-friendly, ARIA labels, semantic HTML, `prefers-reduced-motion` respected, no build frameworks.

### 🗂 Structure — **everything you write is Markdown** ✍️

```
src/content/
├── about/about.md            ← your About page (front matter: title, lead)
├── blog/*.md                 ← one file per blog post (title, date, tags, summary)
├── publications/*.md         ← one file per paper (authors, venue, year, doi, citations) + abstract body
└── projects/*.md             ← one file per project (name, badge, lang, stars, url) + README-style body
src/site-data.json            ← meta/nav/research/talks/cv/contact config
src/content/cv/cv.md            ← CV page body (teaching table, mentoring, grants)
src/md.js                     ← zero-dependency Markdown renderer (+ front-matter parser)
src/styles/main.css           ← theme incl. .md-body typography, tables, code blocks, task lists
src/js/app.js                 ← particles, reveal, nav-spy, count-ups
build.js                      ← renders md + data → public/ (index, about, blog index & posts)
public/                       ← deploy output
.github/workflows/deploy.yml  ← auto-deploy on push to main
```

### ✍️ Writing content in Markdown

Just create/edit a `.md` file and run `npm run build` (or just push — CI rebuilds? *no:* commit `public/` too, or add the build step to the workflow).

```markdown
---
title: My New Post
date: 2026-10-11
tags: [quantum, life]
summary: One-paragraph teaser shown on cards.
---

## Headings, **bold**, *italic*, `code`

- Task lists: - [x] done / - [ ] todo
- Tables, blockquotes, links, images — all supported
- Inline math $p \approx e^{-d}$ and display math:

$$P_{\text{logical}} \sim (p/p_{\text{th}})^{\lfloor (d+1)/2 \rfloor}$$
```

Supported: headings, emphasis, strikethrough, links/autolinks, images, nested lists, task lists, fenced code blocks, GFM tables with alignment, blockquotes, horizontal rules, and **LaTeX via KaTeX** ($…$, $$…$$). Blog posts get their own page at `blog/<slug>.html`, appear on the Blog index and in the homepage "Latest Writing" section automatically. Publications render as expandable abstracts; project bodies render inside their cards.

### 🚀 Local dev

```bash
npm run build   # regenerate public/
npm start       # build + serve at http://localhost:8080
```

### 🌐 Deploy to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` triggers `.github/workflows/deploy.yml` → publishes `public/`.

To customize: edit `src/site-data.json` (name, papers, links…), run `npm run build`, commit. Done. 🏳️‍🌈⚛️
