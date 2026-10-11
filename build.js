#!/usr/bin/env node
/* build.js — renders src/site-data.json + templates into public/ (pure static, GitHub-Pages ready) */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/site-data.json'), 'utf8'));
const { meta, nav, social, heroStats, about, research, publications, projects, talks, teaching, advocacy, cv, contact } = data;

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

const navHtml = nav.map(n => `<a class="nav-link" href="#${n.id}">${esc(n.label)}</a>`).join('\n          ');

const statsHtml = heroStats.map(s => `<div class="stat"><span class="stat-value" data-count="${esc(s.value)}">${esc(s.value)}</span><span class="stat-label">${esc(s.label)}</span></div>`).join('\n            ');

const focusTags = about.focusTags.map(t => `<span class="chip">${esc(t)}</span>`).join('');

const highlights = about.highlights.map(h => `
        <div class="highlight-card reveal">
          <div class="highlight-icon">${ICONS[h.icon]}</div>
          <div><h3>${esc(h.title)}</h3><p>${esc(h.text)}</p></div>
        </div>`).join('');

const researchCards = research.areas.map(a => `
        <article class="research-card reveal" style="--accent:${a.accent}">
          <div class="research-index">${String(research.areas.indexOf(a) + 1).padStart(2, '0')}</div>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.desc)}</p>
          <div class="tag-row">${a.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        </article>`).join('');

const pubItems = publications.list.map(p => `
        <li class="pub reveal">
          <div class="pub-year">${p.year}</div>
          <div class="pub-body">
            <h3 class="pub-title">${esc(p.title)}</h3>
            <p class="pub-authors">${esc(p.authors)}</p>
            <p class="pub-venue"><em>${esc(p.venue)}</em>${p.doi ? ` · <a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">doi:${esc(p.doi)}</a>` : ''}</p>
            <div class="tag-row">
              ${p.tags.map(t => `<span class="tag tag-sm">${esc(t)}</span>`).join('')}
              <span class="cite-badge" title="Citations">▲ ${p.cite} citations</span>
            </div>
          </div>
        </li>`).join('');

const projectCards = projects.list.map(pr => `
        <a class="project-card reveal" href="${esc(pr.url)}" target="_blank" rel="noopener noreferrer">
          <div class="project-top"><h3>${esc(pr.name)}</h3><span class="badge">${esc(pr.badge)}</span></div>
          <p>${esc(pr.desc)}</p>
          <div class="project-meta"><span>${esc(pr.lang)}</span><span class="stars">${ICONS.star} ${esc(pr.stars)}</span></div>
        </a>`).join('');

const talkItems = talks.list.map(t => `
        <li class="talk reveal">
          <span class="talk-date">${esc(t.date)}</span>
          <div><strong>${esc(t.title)}</strong><span class="talk-where"> — ${esc(t.where)}</span></div>
          <span class="talk-type type-${t.type}">${esc(t.type)}</span>
        </li>`).join('');

const courseCards = teaching.courses.map(c => `
        <article class="course-card reveal">
          <div class="course-code">${esc(c.code)}</div>
          <h3>${esc(c.title)}</h3>
          <p class="course-term">${esc(c.term)} · ${esc(c.level)}</p>
          <p>${esc(c.desc)}</p>
          ${c.rating ? `<p class="course-rating">★ ${esc(c.rating)}</p>` : ''}
        </article>`).join('');

const advocacyItems = advocacy.items.map(a => `
        <div class="advocacy-item reveal">
          <div class="advocacy-icon">${ICONS[a.icon]}</div>
          <div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></div>
        </div>`).join('');

const positionItems = cv.positions.map(p => `
        <li class="timeline-item reveal">
          <div class="timeline-dot"></div>
          <div><h3>${esc(p.role)}</h3><p class="tl-org">${esc(p.org)} · <span class="tl-period">${esc(p.period)}</span></p><p class="tl-detail">${esc(p.detail)}</p></div>
        </li>`).join('');

const awardItems = cv.awards.map(a => `<li class="reveal"><span class="award-year">${esc(a.year)}</span> ${esc(a.name)}</li>`).join('');
const serviceItems = cv.service.map(s => `<li>${esc(s)}</li>`).join('');

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
          ${navHtml}
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

    <!-- ABOUT -->
    <section class="section" id="about">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> About</h2>
        <p class="about-lead">${esc(about.lead)}</p>
        ${about.paragraphs.map(p => `<p class="about-p">${p}</p>`).join('\n        ')}
        <div class="tag-row chip-row">${focusTags}</div>
        <div class="highlights-grid">${highlights}
        </div>
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
        <p class="section-intro">${esc(publications.note)} · <a href="https://scholar.google.com/" target="_blank" rel="noopener">Full list on Google Scholar →</a></p>
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

    <!-- TALKS -->
    <section class="section" id="talks">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> Talks &amp; Invited Lectures</h2>
        <ul class="talk-list">${talkItems}
        </ul>
      </div>
    </section>

    <!-- TEACHING -->
    <section class="section section-alt" id="teaching">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> Teaching &amp; Mentoring</h2>
        <p class="section-intro">${esc(teaching.intro)}</p>
        <div class="course-grid">${courseCards}
        </div>
        <p class="mentoring-note reveal">🎓 ${esc(teaching.mentoring)}</p>
      </div>
    </section>

    <!-- ADVOCACY -->
    <section class="section advocacy" id="advocacy">
      <div class="section-inner">
        <h2 class="section-title rainbow-text"><span class="hash">#</span> LGBTQ+ Advocacy &amp; Community</h2>
        <p class="section-intro advocacy-lead">${esc(advocacy.lead)}</p>
        <div class="advocacy-grid">${advocacyItems}
        </div>
        <blockquote class="pull-quote reveal">${ICONS.quote}<p>${esc(advocacy.quote)}</p></blockquote>
      </div>
    </section>

    <!-- CV -->
    <section class="section section-alt" id="cv">
      <div class="section-inner">
        <h2 class="section-title"><span class="hash">#</span> Curriculum Vitae</h2>
        <div class="cv-grid">
          <div>
            <h3 class="cv-subtitle">Appointments</h3>
            <ul class="timeline">${positionItems}
            </ul>
          </div>
          <div class="cv-side">
            <h3 class="cv-subtitle">Honors &amp; Awards</h3>
            <ul class="award-list">${awardItems}</ul>
            <h3 class="cv-subtitle">Professional Service</h3>
            <ul class="service-list">${serviceItems}</ul>
            <a class="btn btn-ghost btn-block" href="#" onclick="alert('PDF download placeholder — drop cv.pdf into /public and point this link at it.');return false;">⬇ Download full CV (PDF)</a>
          </div>
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

  <script src="js/app.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'public/index.html'), html);
console.log('✓ public/index.html written (' + html.length + ' bytes)');
