# Quantum Portfolio

Quantum computing and quantum algorithms portfolio — HHL, VQE, quantum error correction, and scientific computing research.

Built with [Jekyll](https://jekyllrb.com/) and deployed on [GitHub Pages](https://pages.github.com/).

## Development

```bash
bundle install
bundle exec jekyll serve
```

## Deployment

Pushes to the `main` branch trigger the GitHub Actions workflow (`.github/workflows/jekyll.yml`) that builds the site and deploys it to GitHub Pages.

Make sure GitHub Pages is enabled in repository settings with source **GitHub Actions**.
