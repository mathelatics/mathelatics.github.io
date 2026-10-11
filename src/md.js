/* md.js — tiny zero-dependency Markdown renderer for the portfolio build.
   Supports: ATX headings, bold/italic/strike/inline code, links, images,
   blockquotes, unordered/ordered lists (one nesting level), fenced code blocks,
   horizontal rules, GFM-style tables, task-list checkboxes, autolinks,
   $$display / $inline$ and \( \) / [ ] LaTeX delimiters (left intact for KaTeX). */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Protect math spans so inline formatting never touches them. */
function protectMath(src) {
  const store = [];
  const keep = (m) => { store.push(m); return '\u0000M' + (store.length - 1) + '\u0000'; };
  let s = src;
  s = s.replace(/\$\$[\s\S]+?\$\$/g, keep);                 // $$block$$
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (m) => keep('$$' + m.slice(2, -2) + '$$'));
  s = s.replace(/\\\(.*?\\\)/g, keep);                       // \(inline\)
  s = s.replace(/\[([^\]\n]*?)\]\(([^)\n]*?)\)/g, (m, t, u) =>
    /^\\\\(?:left|frac|sum|int)/.test(t) ? keep(m) : m);     // \[ ... \] display math
  s = s.replace(/\$([^$\n]+?)\$/g, keep);                    // $inline$
  return { s, restore: (out) => out.replace(/\u0000M(\d+)\u0000/g, (_, i) => esc(store[+i])) };
}

function inline(md) {
  let s = md;
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt, url, title) => `<img src="${url}" alt="${alt}"${title ? ` title="${title}"` : ''} loading="lazy" />`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, txt, url, title) => {
      const ext = /^[a-z][a-z0-9+.-]*:\/\//i.test(url) || url.startsWith('mailto:');
      return `<a href="${url}"${title ? ` title="${title}"` : ''}${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${txt}</a>`;
    });
  s = s.replace(/(^|[^"'>=\w])((?:https?:\/\/|www\.)[^\s<>"']+[^\s<>"'.,;:!?)\]])/g,
    (_, pre, url) => `${pre}<a href="${url.startsWith('http') ? url : 'https://' + url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^\w_])_([^_\s][^_]*?)_(?![\w_])/g, '$1<em>$2</em>');
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  return s;
}

function renderMarkdown(raw) {
  const { s: src, restore } = protectMath(esc(raw));
  const lines = src.split('\n');
  const out = [];
  let para = [], list = null;           // list = {type:'ul'|'ol', items:[], sub:null}
  let inCode = false, codeLang = '', codeBuf = [];
  let quote = [];

  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushList = () => {
    if (!list) return;
    const tag = list.type;
    out.push(`<${tag}>` + list.items.map((it) => {
      let html = inline(it.text);
      if (it.sub && it.sub.length) {
        html += `\n<${tag === 'ol' ? 'ul' : tag}>` + it.sub.map((s2) => `<li>${inline(s2)}</li>`).join('') + `</${tag === 'ol' ? 'ul' : tag}>`;
      }
      return `<li>${html}</li>`;
    }).join('') + `</${tag}>`);
    list = null;
  };
  const flushQuote = () => {
    if (quote.length) { out.push(`<blockquote>${quote.map((q) => `<p>${inline(q)}</p>`).join('')}</blockquote>`); quote = []; }
  };
  const flushAll = () => { flushPara(); flushList(); flushQuote(); };

  const TASK = /^\[( |x|X)\]\s+/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inCode) {
      if (/^\s*```\s*$/.test(line)) {
        out.push(`<pre><code class="language-${codeLang}">${codeBuf.join('\n')}</code></pre>`);
        inCode = false; codeBuf = [];
      } else codeBuf.push(line);
      continue;
    }
    if (/^\s*```(.*)$/.test(line)) { flushAll(); codeLang = line.match(/^\s*```(.*)$/)[1].trim() || 'text'; inCode = true; continue; }

    if (/^\s*$/.test(line)) { flushAll(); continue; }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { flushAll(); const lv = h[1].length; out.push(`<h${lv}>${inline(h[2])}</h${lv}>`); continue; }

    if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(line)) { flushAll(); out.push('<hr />'); continue; }

    const q = line.match(/^\s*&gt;\s?(.*)$/);   // escaped '>'
    if (q) { flushPara(); flushList(); quote.push(q[1]); continue; } else flushQuote();

    /* GFM table: header row followed by |---|---| separator */
    if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1]) && /-/.test(lines[i + 1])) {
      flushAll();
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(line);
      const aligns = cells(lines[i + 1]).map((c) => c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : '');
      i++;
      const rows = [];
      while (i + 1 < lines.length && /\|/.test(lines[i + 1]) && lines[i + 1].trim()) { rows.push(cells(lines[++i])); }
      out.push('<div class="table-wrap"><table><thead><tr>' +
        head.map((c, k) => `<th${aligns[k] ? ` style="text-align:${aligns[k]}"` : ''}>${inline(c)}</th>`).join('') +
        '</tr></thead><tbody>' +
        rows.map((r) => '<tr>' + r.map((c, k) => `<td${aligns[k] ? ` style="text-align:${aligns[k]}"` : ''}>${inline(c)}</td>`).join('') + '</tr>').join('') +
        '</tbody></table></div>');
      continue;
    }

    const li = line.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    if (li) {
      flushPara();
      const indent = li[1].length >= 2 ? 1 : 0;
      const type = /^\d/.test(li[2]) ? 'ol' : 'ul';
      let text = li[3];
      let checked = null;
      const tm = text.match(TASK);
      if (tm) { checked = /[xX]/.test(tm[1]); text = text.slice(tm[0].length); }
      if (checked !== null) text = `<span class="task ${checked ? 'done' : ''}">${checked ? '☑' : '☐'}</span> ` + text;
      if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
      const cur = list.items[list.items.length - 1];
      if (indent === 1 && cur) { (cur.sub = cur.sub || []).push(text); }
      else if (indent === 1 && !cur) { list.items.push({ text, sub: [] }); }
      else list.items.push({ text, sub: null });
      continue;
    } else flushList();

    para.push(line.trim());
  }
  if (inCode) out.push(`<pre><code>${codeBuf.join('\n')}</code></pre>`);
  flushAll();
  return restore(out.join('\n'));
}

/* Front matter parser: --- key: value blocks at top of file. Values may be
   scalars, quoted strings, or YAML-ish lists ("- item"). */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return { fm: {}, body: raw };
  const fm = {};
  let currentListKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && currentListKey) { fm[currentListKey].push(stripQuotes(item[1])); continue; }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) {
      const key = kv[1], val = kv[2];
      if (val === '') { fm[key] = []; currentListKey = key; }
      else { currentListKey = null; fm[key] = stripQuotes(val); }
    }
  }
  return { fm, body: raw.slice(m[0].length) };
}
function stripQuotes(v) {
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  return v;
}

module.exports = { renderMarkdown, parseFrontMatter, esc };
