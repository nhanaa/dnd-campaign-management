// Theme toggle, "/" to search, chart tooltips, and table-of-contents highlighting.
(() => {
  const root = document.documentElement;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('codex-theme', root.dataset.theme); } catch {}
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || /INPUT|TEXTAREA/.test(document.activeElement?.tagName)) return;
    e.preventDefault();
    document.getElementById('nav-open').checked = innerWidth <= 860;
    document.querySelector('.search input')?.focus();
  });

  // Tooltips: data-tip="Heading|detail"
  const tip = document.getElementById('tip');
  let active = null;
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest('[data-tip]');
    if (!el || el === active) return;
    active = el;
    const [head, ...rest] = el.dataset.tip.split('|');
    tip.innerHTML = '';
    const b = document.createElement('b'); b.textContent = head; tip.append(b);
    if (rest.length) tip.append(document.createTextNode(rest.join('|')));
    tip.classList.add('on');
  });
  document.addEventListener('pointermove', (e) => {
    if (!active) return;
    const pad = 14, w = tip.offsetWidth, h = tip.offsetHeight;
    let x = e.clientX + pad, y = e.clientY - h - pad;
    if (x + w > innerWidth - 8) x = e.clientX - w - pad;
    if (y < 8) y = e.clientY + pad;
    tip.style.left = `${x}px`; tip.style.top = `${y}px`;
  });
  document.addEventListener('pointerout', (e) => {
    if (active && !active.contains(e.relatedTarget)) { active = null; tip.classList.remove('on'); }
  });

  // Highlight the current section in the TOC.
  const links = [...document.querySelectorAll('.toc a')];
  if (links.length && 'IntersectionObserver' in window) {
    const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const heads = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(() => {
      const current = heads.filter((h) => h.getBoundingClientRect().top < 140).at(-1) || heads[0];
      links.forEach((a) => a.classList.toggle('on', byId.get(current.id) === a));
    }, { rootMargin: '0px 0px -70% 0px' });
    heads.forEach((h) => io.observe(h));
  }
})();
