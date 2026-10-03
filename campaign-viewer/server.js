// Campaign Codex — a local, server-rendered browser for the campaign folders.
// Run: npm start   (then open http://localhost:4747)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadCampaigns, allDocs, rootDocs, safePath, read, stripMd } from './lib/data.js';
import { renderMarkdown } from './lib/markdown.js';
import * as V from './lib/views.js';

const PORT = Number(process.env.PORT) || 4747;
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC = path.join(import.meta.dirname, 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.woff2': 'font/woff2',
};

const send = (res, status, body, type = 'text/html; charset=utf-8') => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
};
const page = (res, campaigns, opts, status = 200) => send(res, status, V.layout({ campaigns, ...opts }));
const notFound = (res, campaigns, msg) => page(res, campaigns, { title: 'Not found', body: V.notFound(msg) }, 404);

function sendFile(res, file) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found', 'text/plain');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': st.size });
    fs.createReadStream(file).pipe(res);
  });
}

const campaignOf = (campaigns, rel) => campaigns.find((c) => rel === c.slug || rel.startsWith(`${c.slug}/`)) || null;

function search(docs, q) {
  const needle = q.toLowerCase();
  const results = [];
  for (const doc of docs) {
    const text = read(path.join(ROOT, doc.rel));
    if (!text || !text.toLowerCase().includes(needle)) continue;
    let count = 0, section = '', anchor = '';
    const snippets = [];
    for (const line of text.split('\n')) {
      const h = /^#{1,4}\s+(.+)/.exec(line);
      if (h) {
        section = stripMd(h[1]);
        anchor = section.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);
      }
      const lower = line.toLowerCase();
      let i = lower.indexOf(needle);
      if (i < 0) continue;
      while (i >= 0) { count++; i = lower.indexOf(needle, i + needle.length); }
      if (snippets.length < 3) {
        const plain = stripMd(line.replace(/^[#>|\-*\s]+/, ''));
        const at = plain.toLowerCase().indexOf(needle);
        const from = Math.max(0, at - 90);
        const snippet = (from > 0 ? '…' : '') + plain.slice(from, from + 240) + (plain.length > from + 240 ? '…' : '');
        snippets.push({ text: snippet, section: h ? '' : section, anchor: h ? anchor : anchor });
      }
    }
    // Filenames and campaign names that match rank above body-text hits.
    const nameHit = `${doc.label} ${doc.campaign?.name ?? ''}`.toLowerCase().includes(needle);
    results.push({ doc, count, snippets, score: count + (nameHit ? 1000 : 0) + doc.mtime / 1e13 });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 80);
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);

    if (parts[0] === 'static') {
      const f = path.resolve(PUBLIC, parts.slice(1).join('/'));
      return f.startsWith(PUBLIC + path.sep) ? sendFile(res, f) : send(res, 404, 'Not found', 'text/plain');
    }
    if (parts[0] === 'raw') {
      const f = safePath(parts.slice(1).join('/'));
      return f ? sendFile(res, f) : send(res, 403, 'Forbidden', 'text/plain');
    }

    const campaigns = loadCampaigns();

    if (parts.length === 0) {
      return page(res, campaigns, { title: 'Dashboard', current: '__home', body: V.dashboardPage(campaigns, allDocs(campaigns)) });
    }

    if (parts[0] === 'library') {
      return page(res, campaigns, { title: 'Library', current: '__library', body: V.libraryPage(rootDocs(), allDocs(campaigns)) });
    }

    if (parts[0] === 'search') {
      const q = (url.searchParams.get('q') || '').trim();
      const docs = allDocs(campaigns);
      const results = q.length >= 2 ? search(docs, q) : [];
      return page(res, campaigns, { title: q ? `“${q}”` : 'Search', body: V.searchPage(q, results, docs.length) });
    }

    if (parts[0] === 'c' && parts[1]) {
      const c = campaigns.find((x) => x.slug === parts[1]);
      if (!c) return notFound(res, campaigns, `No campaign called “${parts[1]}”.`);
      if (parts[2] === 's' && parts[3]) {
        const s = c.sessions.find((x) => x.slug === parts[3]);
        if (!s) return notFound(res, campaigns, 'That session isn’t recorded.');
        const wanted = url.searchParams.get('f');
        const file = wanted && s.files.includes(wanted) ? wanted : (s.hasRecap ? 'recap.md' : s.files.find((f) => /\.(md|html)$/.test(f)));
        if (!file) return notFound(res, campaigns, 'This session folder has no readable files yet.');
        const rel = `${c.slug}/sessions/${s.slug}/${file}`;
        const { html, toc } = file.endsWith('.md') ? renderMarkdown(read(path.join(ROOT, rel)) || '', rel) : { html: '', toc: [] };
        return page(res, campaigns, {
          title: `${c.name} · S${s.number}`, current: c.slug, accent: c.accent,
          body: V.sessionPage({ c, s, file, html, toc, absPath: path.join(ROOT, rel) }),
        });
      }
      return page(res, campaigns, { title: c.name, current: c.slug, accent: c.accent, body: V.campaignPage(c) });
    }

    if (parts[0] === 'view') {
      const rel = parts.slice(1).join('/');
      const abs = safePath(rel);
      if (!abs || !rel.endsWith('.md') || !fs.existsSync(abs)) return notFound(res, campaigns, `Can’t find ${rel}.`);
      // Session files get the session view, with its tabs and prev/next.
      const m = /^(.+?)\/sessions\/([^/]+)\/([^/]+)$/.exec(rel);
      if (m) {
        res.writeHead(302, { Location: `/c/${encodeURIComponent(m[1])}/s/${encodeURIComponent(m[2])}?f=${encodeURIComponent(m[3])}` });
        return res.end();
      }
      const c = campaignOf(campaigns, rel);
      const { html, toc } = renderMarkdown(read(abs), rel);
      return page(res, campaigns, {
        title: `${c ? `${c.name} · ` : ''}${rel.split('/').pop()}`, current: c?.slug ?? '__library', accent: c?.accent,
        body: V.docPage({ c, rel, html, toc, mtime: fs.statSync(abs).mtimeMs, absPath: abs }),
      });
    }

    return notFound(res, campaigns);
  } catch (err) {
    console.error(err);
    send(res, 500, `<pre>${String(err.stack || err).replace(/</g, '&lt;')}</pre>`);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Campaign Codex → http://localhost:${PORT}`);
});
