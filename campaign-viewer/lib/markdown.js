import fs from 'node:fs';
import path from 'node:path';
import { Marked, Renderer } from 'marked';
import { ROOT } from './data.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const urlPath = (rel) => rel.split('/').map(encodeURIComponent).join('/');

const slugify = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);

// A doc-relative href → an in-app URL. Markdown goes to the viewer, anything else is served raw.
function resolveHref(href, docDir) {
  if (!href || /^([a-z]+:|#|\/)/i.test(href)) return href;
  const [p, hash = ''] = href.split('#');
  const rel = path.posix.normalize(path.posix.join(docDir, decodeURIComponent(p)));
  if (rel.startsWith('..')) return href;
  return `${rel.endsWith('.md') ? '/view/' : '/raw/'}${urlPath(rel)}${hash ? `#${hash}` : ''}`;
}

// Docs constantly mention sibling files in backticks (`world.md`, `sessions/.../recap.md`);
// turn those into links when the file actually exists.
function codespanLink(text, docDir, campaignDir) {
  if (!/^[\w./() -]+\.(md|html|json|txt|js)$/.test(text)) return null;
  for (const base of [docDir, campaignDir, '']) {
    if (base === null) continue;
    const rel = path.posix.normalize(path.posix.join(base, text));
    if (!rel.startsWith('..') && fs.existsSync(path.join(ROOT, rel))) {
      return `${rel.endsWith('.md') ? '/view/' : '/raw/'}${urlPath(rel)}`;
    }
  }
  return null;
}

export function renderMarkdown(src, rel) {
  const docDir = path.posix.dirname(rel) === '.' ? '' : path.posix.dirname(rel);
  const campaignDir = rel.includes('/') ? rel.split('/')[0] : null;
  const toc = [];
  const seen = new Map();
  const md = new Marked({
    gfm: true,
    walkTokens(token) {
      if (token.type === 'link' || token.type === 'image') token.href = resolveHref(token.href, docDir);
    },
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        let id = slugify(html) || `section-${toc.length}`;
        const n = seen.get(id) || 0;
        seen.set(id, n + 1);
        if (n) id += `-${n}`;
        if (depth >= 2 && depth <= 3) toc.push({ id, depth, text: html.replace(/<[^>]+>/g, '') });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true">#</a>${html}</h${depth}>\n`;
      },
      codespan({ text }) {
        const raw = text.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        const href = codespanLink(raw, docDir, campaignDir);
        return href ? `<a class="filelink" href="${href}"><code>${text}</code></a>` : `<code>${text}</code>`;
      },
      table(token) {
        return `<div class="table-wrap">${Renderer.prototype.table.call(this, token)}</div>`;
      },
      blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        const cls = /^<p>\s*(⚠️|<strong>(Warning|Caveat))/i.test(body) ? ' class="warn"' : '';
        return `<blockquote${cls}>${body}</blockquote>`;
      },
    },
  });
  return { html: md.parse(src), toc };
}
