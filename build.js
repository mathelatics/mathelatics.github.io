#!/usr/bin/env node
/* build.js — renders src/site-data.json + templates into public/ (pure static, GitHub-Pages ready) */
const fs = require('fs');
const path = require('path');

const { renderMarkdown, parseFrontMatter } = require('./src/md');

const ROOT = __dirname;
const CONTENT = path.join(ROOT, 'src/content');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/site-data.json'), 'utf8'));
const { meta, nav, social, heroStats, research, publications, projects, talks, cv, contact, blog } = data;

/* ---- Markdown content loaders ---- */
function loadDir(sub) {
  const dir = path.join(CONTENT, sub);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const { fm, body } = parseFrontMatter(raw);
    return { slug: f.replace(/\.md$/, ''), fm, html: renderMarkdown(body.trim()), body };
  });
}
const aboutDoc = loadDir('about')[0] || { fm: {}, html: '<p>Add src/content/about/about.md</p>' };
const posts = loadDir('blog').sort((a, b) => String(b.fm.date).localeCompare(String(a.fm.date)));
const pubs = loadDir('publications').sort((a, b) => Number(b.fm.year) - Number(a.fm.year));
const projs = loadDir('projects');
const cvDoc = loadDir('cv')[0] || { fm: {}, html: '', body: '' };
const fmtDate = (d) => { try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return d; } };
const readTime = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 200)) + ' min read';

const ICONS = {
  github: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.14v3.17c0 .31.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>',
  scholar: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 3 1 9l11 6 9-4.91V17h2v-8L12 3zM5 13.18v3.82c0 1.66 3.13 3 7 3s7-1.34 7-3v-3.82l-7 3.82-7-3.82z"/></svg>',
  orcid: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.3 7.6a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm-.7 2.9h1.4v6H7.6v-6zm3.6 0h2.2c2.2 0 3.4 1.5 3.4 3s-1.2 3-3.4 3h-2.2v-6zm1.4 1.3v3.4h.9c1.4 0 2-.7 2-1.7s-.6-1.7-2-1.7h-.9z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3V9.5zm6.5 0h3.8v1.6h.05c.53-1 1.83-2.06 3.77-2.06 4 0 4.88 2.6 4.88 6V21h-4v-5.1c0-1.22-.02-2.8-1.7-2.8-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.5z"/></svg>',
  mastodon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M21.3 8.2c0-4.4-2.9-5.7-2.9-5.7C17 1.9 14.7 1.7 12.3 1.7h-.1c-2.4 0-4.7.2-6.1.8 0 0-2.9 1.3-2.9 5.7v3.5c.1 4.7.6 6.9 3.1 7.8 2 .8 3.7.9 5.6.7 1.7-.1 3.2-.5 4.8-1.1v2.3c-1.3.5-2.8.8-4.6.9-3.1.2-5.8-.4-8-1.6-3.8-2.1-4.4-7.5-4.5-9.5v-.5l-.1-1.6c0-5.5 3.6-6.4 3.6-6.4C5.6 1.1 8.7.9 9.8.9h.1c3.4.1 6.4.9 6.4.9 3.9 1 4 5.1 4 7.1v3.9h-3.6V8.5c0-2.4-.5-3.2-1.9-3.2-1.4 0-1.9.9-1.9 3.1v2.7h-3.5V8.4c0-2.2-.5-3.1-1.9-3.1-1.4 0-1.9.8-1.9 3.2v5.9H5.5c.1 2.4.7 6.4 6.5 6.6 2.6.1 4.4-.7 6.1-1.6v-4.7h.1c1.5-.3 3.1-.9 3.1-3.6z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6L22 7"/></svg>',
  lab: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 3h6M10 3v6L4.5 18a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 9V3"/><path d="M7 15h10"/></svg>',
  award: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/></svg>',
  globe: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c3 3.5 3 16.5 0 20-3-3.5-3-16.5 0-20z"/></svg>',
  flag: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 22V4a1 1 0 0 1 1-1c4 0 6 2 10 2 2 0 4-1 4-1v11s-2 1-4 1c-4 0-6-2-10-2"/></svg>',
  shield: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.5 9.3 8 11 4.5-1.7 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></svg>',
  book: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6.3a5 5 0 1 1 7.5 6.3z"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m3 11 18-7v16L3 13v-2z"/><path d="M7 13v6a2 2 0 0 0 4 0v-4"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z"/></svg>',
  quote: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M10 8H6a4 4 0 0 0-4 4v6h8v-6H6a2 2 0 0 1 2-2h2V8zm10 0h-4a4 4 0 0 0-4 4v6h8v-6h-2a2 2 0 0 1 2-2h2V8z"/></svg>'
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const socialLinks = social.map(s => `<a class="social-btn" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(s.name)}" title="${esc(s.name)}">${ICONS[s.icon] || ''}</a>`).join('\n          ');

const navHtml = nav.map(n => `<a class="nav-link" href="${esc(n.href || '#' + n.id)}"${(n.href||'').startsWith(n.id) ? '' : ''}>${esc(n.label)}</a>`).join('\n          ');

const statsHtml = heroStats.map(s => `<div class="stat"><span class="stat-value" data-count="${esc(s.value)}">${esc(s.value)}</span><span class="stat-label">${esc(s.label)}</span></div>`).join('\n            ');

const researchCards = research.areas.map(a => `
        <article class="research-card reveal" style="--accent:${a.accent}">
          <div class="research-index">${String(research.areas.indexOf(a) + 1).padStart(2, '0')}</div>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.desc)}</p>
          <div class="tag-row">${a.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </article>`).join('');

const pubItems = pubs.map(p => `
        <li class="pub reveal">
          <details>
            <summary>
              <span class="pub-year">${esc(p.fm.year)}</span>
              <div class="pub-body">
                <h3 class="pub-title">${esc(p.fm.title)}</h3>
                <p class="pub-authors">${esc(p.fm.authors)}</p>
                <p class="pub-venue"><em>${esc(p.fm.venue)}</em>${p.fm.doi ? ` · <a href=\"https://doi.org/${esc(p.fm.doi)}\" target=\"_blank\" rel=\"noopener\" onclick=\"event.stopPropagation();\">doi:${esc(p.fm.doi)}</a>` : ''}</p>
                <div class="tag-row">
                  ${String(p.fm.tags || '').split(',').filter(Boolean).map(t => `<span class="tag tag-sm">${esc(t.trim())}</span>`).join('')}
                  <span class="cite-badge" title="Citations">▲ ${esc(p.fm.citations)} citations</span>
                  <span class="pub-toggle">▾ abstract</span>
                </div>
              </div>
            </summary>
            <div class="md-body pub-abstract">${p.html}</div>
          </details>
        </li>`).join('');

const projectCards = projs.map(pr => `
        <article class="project-card reveal">
          <a class="project-link" href="${esc(pr.fm.url)}" target="_blank" rel="noopener noreferrer"><h3>${esc(pr.fm.name)}</h3></a>
          <div class="project-top"><span class="badge">${esc(pr.fm.badge)}</span></div>
          <p class="project-tagline">${esc(pr.fm.tagline)}</p>
          <div class="md-body project-desc">${pr.html}</div>
          <div class="project-meta"><span>${esc(pr.fm.lang)}</span><span class="stars">${ICONS.star} ${esc(pr.fm.stars)}</span></div>
        </article>`).join('');

const talkItems = talks.list.map(t => `
        <li class="talk reveal">
          <span class="talk-date">${esc(t.date)}</span>
          <div><strong>${esc(t.title)}</strong><span class="talk-where"> — ${esc(t.where)}</span></div>
          <span class="talk-type type-${t.type}">${esc(t.type)}</span>
        </li>`).join('');

const positionItems = cv.positions.map(p => `
        <li class="timeline-item reveal">
          <div class="timeline-dot"></div>
          <div><h3>${esc(p.role)}</h3><p class="tl-org">${esc(p.org)} · <span class="tl-period">${esc(p.period)}</span></p><p class="tl-detail">${esc(p.detail)}</p></div>
        </li>`).join('');

const awardItems = cv.awards.map(a => `<li class="reveal"><span class="award-year">${esc(a.year)}</span> ${esc(a.name)}</li>`).join('');
const serviceItems = cv.service.map(s => `<li>${esc(s)}</li>`).join('');

/* Homepage nav uses in-page anchors; sub-pages use full hrefs via pageShell */
const pageLinks = { about: 'about.html', blog: 'blog.html', cv: 'cv.html' };
const navHtmlHome = nav.map(n => `<a class="nav-link" href="${pageLinks[n.id] || '#' + n.id}">${esc(n.label)}</a>`).join('\n          ');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(meta.title)} — Quantum Research & Academic Portfolio</title>
  <meta name="description" content="${esc(meta.description)}" />
  <meta property="og:title" content="${esc(meta.title)}" />
  <meta property="og:description" content="${esc(meta.description)}" />
  <meta property="og:type" content="website" />
  <meta name="theme-color" content="#0b0e1a" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚛️</text></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles/main.css" />
</head>
<body>
  <canvas id="quantum-canvas" aria-hidden="true"></canvas>
  <div class="rainbow-bar" aria-hidden="true"></div>

  <header class="site-header">
    <nav class="nav-container" aria-label="Primary">
      <a class="brand" href="#top"><span class="brand-atom" aria-hidden="true">⚛</span> <span class="brand-name">${esc(meta.title)}</span></a>
      <div class="nav-links" id="nav-links">
          ${navHtmlHome}
      </div>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>
    </nav>
  </header>

  <main id="top">
    <!-- HERO -->
    <section class="hero" id="hero">
      <div class="hero-inner">
        <div class="avatar-ring" aria-hidden="true"><div class="avatar">${esc(meta.avatarInitials)}</div></div>
        <p class="hero-kicker">Academic &amp; Research Portfolio · <span class="pronoun-chip">${esc(meta.pronouns)}</span></p>
        <h1 class="hero-title gradient-text">${esc(meta.title)}</h1>
        <p class="hero-tagline">${esc(meta.tagline)}</p>
        <p class="hero-location">📍 ${esc(meta.location)}</p>
        <div class="social-row">
          ${socialLinks}
        </div>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#contact">Get in touch</a>
          <a class="btn btn-ghost" href="#publications">Read the papers</a>
        </div>
        <div class="stats-row">
            ${statsHtml}
        </div>
      </div>
      <div class="scroll-hint" aria-hidden="true">▾</div>
    </section>

    <!-- ABOUT (teaser — full text lives in src/content/about/about.md) -->
    <section class="section" id="about">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> About</h2>
        <p class="about-lead">${esc(aboutDoc.fm.lead || '')}</p>
        <a class="btn btn-ghost" href="about.html">Read my full story →</a>
      </div>
    </section>

    <!-- RESEARCH -->
    <section class="section section-alt" id="research">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> Research Areas</h2>
        <p class="section-intro">${esc(research.intro)}</p>
        <div class="research-grid">${researchCards}
        </div>
      </div>
    </section>

    <!-- PUBLICATIONS -->
    <section class="section" id="publications">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> Selected Publications</h2>
        <p class="section-intro">${publications.intro} · <a href="${esc(publications.scholarUrl)}" target="_blank" rel="noopener">Full list on Google Scholar →</a></p>
        <ol class="pub-list">${pubItems}
        </ol>
      </div>
    </section>

    <!-- PROJECTS -->
    <section class="section section-alt" id="projects">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> Open-Source Projects</h2>
        <p class="section-intro">${esc(projects.intro)}</p>
        <div class="project-grid">${projectCards}
        </div>
      </div>
    </section>

    <!-- BLOG (preview cards — posts live in src/content/blog/*.md) -->
    <section class="section" id="blog">
      <div class="section-inner">
        <h2 class="section-title rainbow-text"><span class="hash">#</span> Latest Writing</h2>
        <p class="section-intro">${blog.intro}</p>
        <div class="blog-grid">${posts.slice(0, 3).map(p => `
          <article class="blog-card reveal">
            <a class="blog-card-link" href="blog/${p.slug}.html"><h3>${esc(p.fm.title)}</h3></a>
            <p class="blog-meta">${fmtDate(p.fm.date)} · ${readTime(p.body)}</p>
            <p class="blog-summary">${esc(p.fm.summary || '')}</p>
            <div class="tag-row">${String(p.fm.tags || '').split(',').filter(Boolean).map(t => `<span class="tag tag-sm">${esc(t.trim())}</span>`).join('')}</div>
          </article>`).join('')}
        </div>
        <p class="see-all"><a class="btn btn-ghost" href="blog.html">All blog posts →</a></p>
      </div>
    </section>

    <!-- TALKS -->
    <section class="section" id="talks">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> Talks &amp; Invited Lectures</h2>
        <ul class="talk-list">${talkItems}
        </ul>
      </div>
    </section>

    <!-- CV (teaser — full CV lives on cv.html, generated from src/content/cv/cv.md) -->
    <section class="section section-alt" id="cv">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> Curriculum Vitae</h2>
        <p class="section-intro">Appointments, education, honors, invited teaching &amp; mentoring, and professional service — all on one page. Written in Markdown at <code>src/content/cv/cv.md</code>.</p>
        <div class="cv-teaser reveal">
          <div class="cv-teaser-item"><span class="cv-num">${String(cvDoc.fm.years || '15+')}</span><span class="cv-cap">years in research &amp; teaching</span></div>
          <div class="cv-teaser-item"><span class="cv-num">${String(cvDoc.fm.students || '30+')}</span><span class="cv-cap">students mentored</span></div>
          <div class="cv-teaser-item"><span class="cv-num">${String(cvDoc.fm.awards || cv.awards.length)}</span><span class="cv-cap">major honors &amp; awards</span></div>
        </div>
        <div class="cv-actions">
          <a class="btn btn-primary" href="cv.html">View full CV →</a>
          <a class="btn btn-ghost" href="${esc(cv.pdf)}" download>⬇ Download PDF</a>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="section" id="contact">
      <div class="section-inner narrow">
        <h2 class="section-title"><span class="hash">#</span> Contact</h2>
        <p class="section-intro">${esc(contact.blurb)}</p>
        <form class="contact-form reveal" action="mailto:${esc(meta.email)}" method="get" enctype="text/plain">
          <label>Name<input type="text" name="name" required placeholder="Your name" /></label>
          <label>Email<input type="email" name="from" required placeholder="you@institution.edu" /></label>
          <label>Message<textarea name="body" rows="5" required placeholder="Collaboration, mentoring, speaking…"></textarea></label>
          <button class="btn btn-primary" type="submit">Send ✉</button>
        </form>
        <div class="contact-meta reveal">
          <p>✉ <a href="mailto:${esc(meta.email)}">${esc(meta.email)}</a></p>
          <p>🏛 ORCID: ${esc(meta.orcid)} · 🎓 Scholar: ${esc(meta.scholarId)}</p>
          <p>🚪 ${esc(contact.office)}</p>
          <p>🕑 Office hours: ${esc(contact.officeHours)}</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-rainbow" aria-hidden="true"></div>
    <p>© 2026 ${esc(meta.title)} · Built with ♥ and open science · Last updated ${esc(meta.updated)}</p>
    <p class="footer-sub">Inspired by <a href="https://gitlab.com/ian-s-mcb/smigle-hugo-theme" target="_blank" rel="noopener">Smigle</a> · Deployed on GitHub Pages</p>
  </footer>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]})"></script>
  <script src="js/app.js"></script>
</body>
</html>
`;

fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'public/index.html'), html);
console.log('✓ public/index.html written (' + html.length + ' bytes)');

/* ================= Sub-pages (Markdown-driven) ================= */
const BASE = ''; // adjust if serving from project subdir; relative paths used instead

function pageShell({ title, desc, contentClass, main, prefix }) {
  const p = prefix || '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} — ${esc(meta.title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta name="theme-color" content="#0b0e1a" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚛️</text></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${p}styles/main.css" />
</head>
<body class="subpage">
  <canvas id="quantum-canvas" aria-hidden="true"></canvas>
  <div class="rainbow-bar" aria-hidden="true"></div>
  <header class="site-header">
    <nav class="nav-container" aria-label="Primary">
      <a class="brand" href="${p}index.html"><span class="brand-atom" aria-hidden="true">⚛</span> <span class="brand-name">${esc(meta.title)}</span></a>
      <div class="nav-links" id="nav-links">
          ${nav.map(n => `<a class="nav-link" href="${esc(p + (n.href || '#' + n.id))}">${esc(n.label)}</a>`).join('\n          ')}
      </div>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>
    </nav>
  </header>
  <main class="${contentClass}">
${main}
  </main>
  <footer class="site-footer">
    <div class="footer-rainbow" aria-hidden="true"></div>
    <p>© 2026 ${esc(meta.title)} · Built with ♥ and open science</p>
    <p class="footer-sub"><a href="${p}index.html">← Home</a> · Inspired by <a href="https://gitlab.com/ian-s-mcb/smigle-hugo-theme" target="_blank" rel="noopener">Smigle</a> · Deployed on GitHub Pages</p>
  </footer>
  <script src="${p}js/app.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]})"></script>
</body>
</html>
`;
}

function writePage(rel, str) {
  const file = path.join(ROOT, 'public', rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, str);
  console.log('✓ public/' + rel + ' written (' + str.length + ' bytes)');
}

/* ---- About page ---- */
writePage('about.html', pageShell({
  title: aboutDoc.fm.title || 'About',
  desc: aboutDoc.fm.lead || meta.description,
  contentClass: 'page-main',
  main: `    <section class="page-section">
      <div class="section-inner narrow">
        <h1 class="page-title gradient-text">${esc(aboutDoc.fm.title || 'About')}</h1>
        <p class="about-lead">${esc(aboutDoc.fm.lead || '')}</p>
        <div class="md-body">${aboutDoc.html}
          <p class="page-crosslinks"><a class="btn btn-ghost" href="cv.html">📄 Curriculum Vitae (full CV page) →</a></p>
        </div>
      </div>
    </section>`
}));

/* ---- CV page (Markdown-driven: src/content/cv/cv.md + structured data) ---- */
writePage('cv.html', pageShell({
  title: cvDoc.fm.title || 'Curriculum Vitae',
  desc: cvDoc.fm.lead || 'Full academic CV — appointments, education, teaching, mentoring, honors, and service.',
  contentClass: 'page-main',
  main: `    <section class="page-section">
      <div class="section-inner">
        <h1 class="page-title gradient-text">${esc(cvDoc.fm.title || 'Curriculum Vitae')}</h1>
        <p class="about-lead">${esc(cvDoc.fm.lead || '')}</p>
        <div class="cv-actions">
          <a class="btn btn-primary" href="${esc(cv.pdf)}" download>⬇ Download PDF</a>
          <span class="cv-updated">Updated ${esc(meta.updated)}</span>
        </div>

        <div class="cv-grid">
          <div>
            <h2 class="cv-subtitle"><span class="hash">#</span> Appointments</h2>
            <ul class="timeline">${positionItems}
            </ul>
          </div>
          <div class="cv-side">
            <h2 class="cv-subtitle"><span class="hash">#</span> Honors &amp; Awards</h2>
            <ul class="award-list">${awardItems}</ul>
            <h2 class="cv-subtitle"><span class="hash">#</span> Professional Service</h2>
            <ul class="service-list">${serviceItems}</ul>
          </div>
        </div>

        ${cvDoc.html ? `<div class="cv-md md-body">${cvDoc.html}</div>` : ''}
      </div>
    </section>`
}));

/* ---- Blog index ---- */
writePage('blog.html', pageShell({
  title: 'Blog',
  desc: 'Writing on quantum science, queer academia, and open research.',
  contentClass: 'page-main',
  main: `    <section class="page-section">
      <div class="section-inner">
        <h1 class="page-title rainbow-text">Blog</h1>
        <p class="section-intro">${blog.intro}</p>
        <div class="blog-grid">
${posts.map(p => `          <article class="blog-card reveal">
            <a class="blog-card-link" href="blog/${p.slug}.html"><h3>${esc(p.fm.title)}</h3></a>
            <p class="blog-meta">📅 ${fmtDate(p.fm.date)} · ⏱ ${readTime(p.body)}</p>
            <p class="blog-summary">${esc(p.fm.summary || '')}</p>
            <div class="tag-row">${String(p.fm.tags || '').split(',').filter(Boolean).map(t => `<span class="tag tag-sm">${esc(t.trim())}</span>`).join('')}</div>
          </article>`).join('\n')}
        </div>
      </div>
    </section>`
}));

/* ---- Individual blog posts ---- */
for (const p of posts) {
  const idx = posts.indexOf(p);
  const prev = posts[idx + 1], next = posts[idx - 1];
  writePage(`blog/${p.slug}.html`, pageShell({
    title: p.fm.title,
    desc: p.fm.summary || p.fm.title,
    prefix: '../',
    contentClass: 'page-main post-page',
    main: `    <article class="post">
      <div class="section-inner narrow">
        <p class="blog-meta">📅 ${fmtDate(p.fm.date)} · ⏱ ${readTime(p.body)}
          ${String(p.fm.tags || '').split(',').filter(Boolean).map(t => `<span class="tag tag-sm">${esc(t.trim())}</span>`).join(' ')}</p>
        <h1 class="page-title">${esc(p.fm.title)}</h1>
        <div class="md-body post-body katex">${p.html}</div>
        <hr />
        <nav class="post-nav" aria-label="Post navigation">
          ${next ? `<a class="btn btn-ghost" href="../blog/${next.slug}.html">← ${esc(next.fm.title)}</a>` : '<span></span>'}
          ${prev ? `<a class="btn btn-ghost" href="../blog/${prev.slug}.html">${esc(prev.fm.title)} →</a>` : '<a class="btn btn-ghost" href="../blog.html">All posts</a>'}
        </nav>
      </div>
    </article>`
  }));
}
