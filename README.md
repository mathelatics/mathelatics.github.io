# Personal Website : [https://mathelatics.github.io/](https://mathelatics.github.io/)

## ⚛️ Quantum Academic & Research Portfolio — Overview

A **modern, dark-themed, single-page portfolio** for a quantum scientist & LGBTQ+ advocate —
inspired by the minimal spirit of the [Smigle Hugo theme](https://gitlab.com/ian-s-mcb/smigle-hugo-theme),
rebuilt as a zero-dependency static site that deploys straight to **GitHub Pages**.

### ✨ What's inside

| Section | Highlights |
|---|---|
| **Hero** | Animated pride-gradient avatar ring, gradient name, pronoun chip, social buttons (GitHub / Scholar / ORCID / LinkedIn / Mastodon), count-up stats |
| **About** | Narrative bio tying quantum research to queer advocacy + focus chips |
| **Research** | 5 color-accented research-thrust cards with hover glow |
| **Publications** | Year-tagged list with DOIs, venue, tags & citation badges |
| **Projects** | GitHub-style open-source cards (stars, language, badges) |
| **Talks** | Timeline list with keynote / invited / panel / tutorial pills |
| **Teaching** | Course cards + mentoring stats |
| **Advocacy** | LGBTQ+ community work, rainbow accents & pull-quote |
| **CV** | Gradient timeline of appointments + awards/service sidebar |
| **Contact** | Styled form + office-hours block |

**Visual system:** deep-space navy `#0b0e1a`, quantum violet/cyan/pink gradients, pride-rainbow bars,
Sora + Inter + JetBrains Mono type stack, glassmorphism cards, scroll-reveal animations,
and an interactive **quantum-entanglement particle canvas** (particles attract to your cursor — "observer effect" 🛰️).

**Quality:** fully responsive, keyboard-friendly, ARIA labels, semantic HTML, `prefers-reduced-motion` respected, no build frameworks.

### 🗂 Structure

```
src/site-data.json            ← ALL content lives here (edit me!)
src/styles/main.css           ← theme
src/js/app.js                 ← particles, reveal, nav-spy, count-ups
build.js                      ← renders src → public/index.html
public/                       ← deploy output (index.html, styles/, js/)
.github/workflows/deploy.yml  ← auto-deploy on push to main
```

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
