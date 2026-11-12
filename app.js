// CodeDevHub — small progressive enhancements. The site works without JS.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // reveal on scroll
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' }) : null;
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 70, 350)}ms`; io ? io.observe(el) : el.classList.add('in'); });

  // "What do you need?" picker
  const needChips = $$('.needs .chip');
  needChips.forEach((c) => c.addEventListener('click', () => {
    needChips.forEach((x) => { x.classList.toggle('on', x === c); x.setAttribute('aria-selected', x === c); });
    $$('.need').forEach((p) => { p.hidden = p.dataset.need !== c.dataset.need; });
    c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }));

  // work filter (with ?cat= support)
  const fChips = $$('.filter .chip');
  const applyCat = (cat) => {
    fChips.forEach((x) => x.classList.toggle('on', x.dataset.cat === cat));
    $$('.work-all .card').forEach((c) => { c.hidden = !(cat === 'all' || c.dataset.cat === cat || (cat === 'ai' && c.dataset.needs.includes('ai') && c.dataset.cat !== 'website')); });
  };
  if (fChips.length) {
    fChips.forEach((c) => c.addEventListener('click', () => { applyCat(c.dataset.cat); history.replaceState(null, '', c.dataset.cat === 'all' ? location.pathname : `?cat=${c.dataset.cat}`); }));
    const q = new URLSearchParams(location.search).get('cat');
    if (q && fChips.some((c) => c.dataset.cat === q)) applyCat(q);
  }

  // lightbox
  const lb = $('.lightbox');
  if (lb && lb.showModal) {
    const img = $('img', lb), cap = $('p', lb);
    $$('.g-item').forEach((b) => b.addEventListener('click', () => {
      const i = $('img', b); img.src = i.dataset.full || i.currentSrc; img.alt = i.alt; cap.textContent = $('.g-cap', b)?.textContent || '';
      lb.showModal();
    }));
    $('.lb-close', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  }

  // contact message builder
  const f = $('#builder');
  if (f) {
    const PHONE = '+18032097750', MAIL = 'edgar@codedevhub.com';
    const build = () => {
      const d = new FormData(f);
      const needs = d.getAll('need');
      const lines = [`Hi Edgar${d.get('name') ? `, this is ${d.get('name')}` : ''}${d.get('biz') ? ` from ${d.get('biz')}` : ''}. I found you on CodeDevHub.`];
      if (needs.length) lines.push(`I need: ${needs.join(', ')}.`);
      if (d.get('details')) lines.push(String(d.get('details')).trim());
      if (d.get('budget')) lines.push(`Budget: ${d.get('budget')}.`);
      if (d.get('when')) lines.push(`Timeline: ${d.get('when')}.`);
      return lines.join('\n');
    };
    const update = () => {
      const m = build();
      $('#msgPreview').textContent = m;
      $('#sendSms').href = `sms:${PHONE}?&body=${encodeURIComponent(m)}`;
      $('#sendMail').href = `mailto:${MAIL}?subject=${encodeURIComponent('Project inquiry')}&body=${encodeURIComponent(m)}`;
    };
    f.addEventListener('input', update); f.addEventListener('change', update); update();
    $('#copyMsg').addEventListener('click', async (e) => {
      try { await navigator.clipboard.writeText(build()); e.currentTarget.lastChild.textContent = 'Copied'; } catch { /* clipboard blocked */ }
    });
  }
})();
