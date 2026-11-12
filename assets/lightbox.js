/* Site-wide image lightbox: click any content photo/rendering/map to open it full size in a popup.
   Prev/next arrows, keyboard arrows, swipe. Skips logos, icons, avatars, images inside links/buttons. */
(function () {
  var lang = (document.documentElement.lang || 'he').slice(0, 2);
  var T = {
    he: ['תמונה מוגדלת', 'סגירה', 'התמונה הקודמת', 'התמונה הבאה'],
    en: ['Enlarged image', 'Close', 'Previous image', 'Next image'],
    ar: ['صورة مكبّرة', 'إغلاق', 'الصورة السابقة', 'الصورة التالية']
  }[lang] || ['תמונה מוגדלת', 'סגירה', 'התמונה הקודמת', 'התמונה הבאה'];
  var css = '#sitelb{border:0;padding:0;background:transparent;max-width:96vw;max-height:94vh;overflow:visible}' +
    '#sitelb::backdrop{background:rgba(20,8,4,.88)}' +
    '#sitelb img{display:block;max-width:min(92vw,1100px);max-height:78vh;width:auto;height:auto;border-radius:10px;margin:0 auto}' +
    '#sitelb .cap{color:#fff;text-align:center;font-size:15px;line-height:1.4;padding:10px 12px 0;max-width:900px;margin:0 auto}' +
    '#sitelb .cnt{color:#F3E2B8;text-align:center;font-size:13px;padding-top:4px}' +
    '#sitelb .x{position:absolute;top:-14px;inset-inline-end:-6px;width:42px;height:42px;border-radius:50%;border:0;background:#FFF4D6;color:#3B1D12;font-size:26px;line-height:42px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.4)}' +
    '#sitelb .nav{position:fixed;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;border:0;background:rgba(255,244,214,.95);color:#3B1D12;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.4)}' +
    '#sitelb .nav[hidden]{display:none}#sitelb .nav.l{left:max(10px,env(safe-area-inset-left,0px))}#sitelb .nav.r{right:max(10px,env(safe-area-inset-right,0px))}' +
    '@media(max-width:700px){#sitelb .nav{width:40px;height:40px;top:42%}}img.lbz{cursor:zoom-in}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var ar = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var d = document.createElement('dialog'); d.id = 'sitelb'; d.setAttribute('aria-label', T[0]);
  d.innerHTML = '<button type="button" class="x" aria-label="' + T[1] + '">×</button>' +
    '<button type="button" class="nav l">' + ar + '<path d="M15 5l-7 7 7 7"/></svg></button>' +
    '<button type="button" class="nav r">' + ar + '<path d="M9 5l7 7-7 7"/></svg></button>' +
    '<img src="" alt=""><div class="cap"></div><div class="cnt" aria-hidden="true"></div>';
  document.body.appendChild(d);
  if (!d.showModal) return;
  var im = d.querySelector('img'), cp = d.querySelector('.cap'), ct = d.querySelector('.cnt'),
    L = d.querySelector('.nav.l'), R = d.querySelector('.nav.r');
  var rtl = getComputedStyle(document.documentElement).direction === 'rtl', list = [], idx = 0;
  L.setAttribute('aria-label', rtl ? T[3] : T[2]); R.setAttribute('aria-label', rtl ? T[2] : T[3]);
  function ok(i) {
    if (i.closest('a,button,nav,header,footer,dialog,[data-nozoom],.nifwrap,#donors')) return false;
    var cs = getComputedStyle(i);
    if (cs.position === 'absolute' || cs.position === 'fixed') return false;
    var r = i.getBoundingClientRect();
    return r.width >= 150 && r.height >= 100;
  }
  function mark() { document.querySelectorAll('img').forEach(function (i) { if (ok(i)) i.classList.add('lbz'); }); }
  function show(n) {
    idx = (n + list.length) % list.length;
    var g = list[idx], f = g.closest('figure'), c = f && f.querySelector('figcaption');
    im.src = g.getAttribute('data-big') || g.currentSrc || g.src; im.alt = g.alt || '';
    cp.textContent = c ? c.textContent.trim() : ''; ct.textContent = (idx + 1) + ' / ' + list.length;
  }
  function goLeft() { show(idx + (rtl ? 1 : -1)); } function goRight() { show(idx + (rtl ? -1 : 1)); }
  document.addEventListener('click', function (e) {
    var i = e.target.closest && e.target.closest('img');
    if (!i || !ok(i)) return;
    list = Array.prototype.filter.call(document.querySelectorAll('img'), ok);
    var n = list.indexOf(i); if (n < 0) return;
    show(n); L.hidden = R.hidden = list.length < 2; d.showModal();
  });
  L.addEventListener('click', goLeft); R.addEventListener('click', goRight);
  d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('.x')) d.close(); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goLeft(); } else if (e.key === 'ArrowRight') { e.preventDefault(); goRight(); }
  });
  var sx = null;
  d.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  d.addEventListener('touchend', function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) { dx < 0 ? goRight() : goLeft(); }
  }, { passive: true });
  window.addEventListener('load', function () { mark(); setTimeout(mark, 700); });
  mark();
})();
