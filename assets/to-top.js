/* חץ "חזרה לראש העמוד": דסקטופ בלבד, מופיע אחרי גלילה, כמעט שקוף */
(function () {
  var lang = (document.documentElement.lang || 'he').slice(0, 2);
  var label = { he: 'חזרה לראש העמוד', ar: 'العودة إلى أعلى الصفحة', en: 'Back to top' }[lang] || 'Back to top';
  var css = '#totop{position:fixed;bottom:24px;inset-inline-start:24px;direction:' + (lang === 'en' ? 'ltr' : 'rtl') + ';z-index:40;width:40px;height:40px;padding:0;border:0;border-radius:50%;' +
    'background:#3B1D12;color:#FFF4D6;display:flex;align-items:center;justify-content:center;cursor:pointer;' +
    'opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}' +
    '#totop.show{opacity:.4;visibility:visible}#totop.show:hover,#totop.show:focus-visible{opacity:.9}' +
    '#totop:focus-visible{outline:3px solid #F5B321;outline-offset:2px}' +
    '@media (max-width:1000px){#totop{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var b = document.createElement('button');
  b.id = 'totop'; b.type = 'button'; b.setAttribute('aria-label', label); b.title = label;
  b.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 11.5 9 6l5.5 5.5"/></svg>';
  b.addEventListener('click', function () {
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  });
  function upd() { b.classList.toggle('show', window.scrollY > 600); }
  window.addEventListener('scroll', upd, { passive: true });
  document.body.appendChild(b); upd();
})();
