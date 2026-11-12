/* כפתור נגישות לאתר negevvillages.org
   קובץ אחד, בלי תלות בשירות חיצוני. נטען בכל עמוד:
   <script src="/assets/a11y.js" defer></script>
   השפה נקבעת לפי <html lang>, וההעדפות נשמרות בדפדפן של הגולש. */
(function () {
  'use strict';
  if (window.__a11yLoaded) return;
  window.__a11yLoaded = true;

  var lang = (document.documentElement.lang || 'he').slice(0, 2);
  if (lang !== 'en' && lang !== 'ar') lang = 'he';

  var T = {
    he: {
      open: 'תפריט נגישות', title: 'נגישות', close: 'סגירת תפריט הנגישות',
      size: 'גודל טקסט', smaller: 'הקטנת טקסט', bigger: 'הגדלת טקסט',
      contrast: 'ניגודיות גבוהה', mono: 'שחור־לבן', links: 'הדגשת קישורים',
      font: 'גופן קריא', motion: 'עצירת אנימציות', cursor: 'סמן גדול',
      reset: 'איפוס הגדרות', statement: 'הצהרת נגישות', href: '/accessibility/'
    },
    en: {
      open: 'Accessibility menu', title: 'Accessibility', close: 'Close accessibility menu',
      size: 'Text size', smaller: 'Smaller text', bigger: 'Larger text',
      contrast: 'High contrast', mono: 'Grayscale', links: 'Highlight links',
      font: 'Readable font', motion: 'Stop animations', cursor: 'Large cursor',
      reset: 'Reset settings', statement: 'Accessibility statement', href: '/en/accessibility/'
    },
    ar: {
      open: 'قائمة إمكانية الوصول', title: 'إمكانية الوصول', close: 'إغلاق قائمة إمكانية الوصول',
      size: 'حجم النص', smaller: 'تصغير النص', bigger: 'تكبير النص',
      contrast: 'تباين عالٍ', mono: 'أبيض وأسود', links: 'إبراز الروابط',
      font: 'خط سهل القراءة', motion: 'إيقاف الحركة', cursor: 'مؤشر كبير',
      reset: 'إعادة الضبط', statement: 'بيان إمكانية الوصول', href: '/ar/accessibility/'
    }
  }[lang];

  var SIZES = [1, 1.15, 1.3, 1.5];
  var TOGGLES = ['contrast', 'mono', 'links', 'font', 'motion', 'cursor'];
  var KEY = 'nv-a11y';

  var state = { size: 0 };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || '{}'); if (saved && typeof saved === 'object') state = saved; } catch (e) {}
  if (typeof state.size !== 'number' || state.size < 0 || state.size >= SIZES.length) state.size = 0;

  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var root = document.documentElement;
  var NOT = ':not(#a11y-root):not(#a11y-root *)';
  var cursorSvg = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Cpath d='M4 2l15 11-7 1-3 7z' fill='%23000' stroke='%23fff' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E\") 4 2, auto";

  var css = [
    '#a11y-root{position:fixed;bottom:16px;inset-inline-end:16px;z-index:99;font-family:Heebo,"Noto Sans Arabic",Arial,sans-serif;font-size:16px;line-height:1.4;direction:' + (lang === 'en' ? 'ltr' : 'rtl') + '}',
    '#a11y-root *{box-sizing:border-box}',
    '#a11y-btn{width:52px;height:52px;border-radius:50%;border:3px solid #FFFFFF;background:#3B1D12;color:#FFFFFF;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,.35);padding:0}',
    '#a11y-btn:hover{background:#5A2E1D}',
    '#a11y-root button:focus-visible,#a11y-root a:focus-visible{outline:3px solid #F5B321;outline-offset:2px}',
    '#a11y-panel{position:absolute;bottom:64px;inset-inline-end:0;width:min(300px,calc(100vw - 32px));max-height:calc(100vh - 100px);overflow:auto;background:#FFFFFF;color:#3B1D12;border:2px solid #3B1D12;border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,.3);padding:14px}',
    '#a11y-panel[hidden]{display:none}',
    '#a11y-head{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px}',
    '#a11y-head h2{margin:0;font-size:19px;font-weight:800;color:#3B1D12}',
    '#a11y-x{width:44px;height:44px;border:0;background:transparent;color:#3B1D12;font-size:26px;line-height:1;cursor:pointer;border-radius:8px}',
    '#a11y-size{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:8px;background:#FFF4D6;border-radius:10px}',
    '#a11y-size span{flex:1;font-weight:700}',
    '#a11y-size button{width:44px;height:44px;border-radius:8px;border:2px solid #3B1D12;background:#FFFFFF;color:#3B1D12;font-weight:800;font-size:18px;cursor:pointer}',
    '#a11y-size button:disabled{opacity:.4;cursor:default}',
    '#a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '#a11y-grid button{min-height:52px;padding:8px;border-radius:10px;border:2px solid #EBD3A0;background:#FFFFFF;color:#3B1D12;font:inherit;font-weight:700;font-size:15px;cursor:pointer;text-align:center}',
    '#a11y-grid button[aria-pressed="true"]{background:#2F6B2A;border-color:#2F6B2A;color:#FFFFFF}',
    '#a11y-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:12px;flex-wrap:wrap}',
    '#a11y-reset{min-height:44px;padding:6px 14px;border-radius:10px;border:2px solid #B8451F;background:#FFFFFF;color:#B8451F;font:inherit;font-weight:700;cursor:pointer}',
    '#a11y-foot a{color:#3B1D12;font-weight:700;padding:10px 0}',
    '@media print{#a11y-root{display:none}}',

    /* המצבים עצמם — לא חלים על הכפתור והתפריט */
    'html.a11y-size body>' + NOT + '{zoom:var(--a11y-zoom,1)}',
    'html.a11y-contrast body,html.a11y-contrast body *' + NOT + '{background-color:#000000!important;background-image:none!important;color:#FFFFFF!important;border-color:#FFFFFF!important;text-shadow:none!important;box-shadow:none!important}',
    'html.a11y-contrast body a' + NOT + ',html.a11y-contrast body a *' + NOT + '{color:#FFE14D!important}',
    'html.a11y-contrast img' + NOT + '{background-color:transparent!important}',
    'html.a11y-mono body>' + NOT + '{filter:grayscale(1)}',
    'html.a11y-links body a' + NOT + '{text-decoration:underline!important;text-decoration-thickness:2px!important;outline:2px solid #F5B321!important;outline-offset:2px}',
    'html.a11y-font body *' + NOT + '{font-family:Arial,"Noto Sans Arabic",sans-serif!important;letter-spacing:.02em!important;word-spacing:.06em!important}',
    'html.a11y-motion,html.a11y-motion *' + NOT + '{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
    'html.a11y-cursor,html.a11y-cursor *' + NOT + '{cursor:' + cursorSvg + '!important}'
  ].join('\n');

  function apply() {
    root.classList.toggle('a11y-size', state.size > 0);
    root.style.setProperty('--a11y-zoom', String(SIZES[state.size]));
    TOGGLES.forEach(function (k) { root.classList.toggle('a11y-' + k, !!state[k]); });
    if (panel) {
      TOGGLES.forEach(function (k) {
        var b = panel.querySelector('[data-k="' + k + '"]');
        if (b) b.setAttribute('aria-pressed', state[k] ? 'true' : 'false');
      });
      minus.disabled = state.size === 0;
      plus.disabled = state.size === SIZES.length - 1;
      sizeOut.textContent = Math.round(SIZES[state.size] * 100) + '%';
    }
    if (state.motion) document.querySelectorAll('video').forEach(function (v) { try { v.pause(); } catch (e) {} });
  }

  var panel, minus, plus, sizeOut, btn;

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var a in attrs) e.setAttribute(a, attrs[a]);
    if (text) e.textContent = text;
    return e;
  }

  function build() {
    var style = el('style', { id: 'a11y-style' });
    style.textContent = css;
    document.head.appendChild(style);

    var wrap = el('div', { id: 'a11y-root', lang: lang });

    btn = el('button', { id: 'a11y-btn', type: 'button', 'aria-label': T.open, 'aria-expanded': 'false', 'aria-controls': 'a11y-panel', title: T.open });
    btn.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="4" r="1.6" fill="currentColor"/><path d="M5 8l7 1.5L19 8"/><path d="M12 9.5v5"/><path d="M8.5 21l3.5-6.5 3.5 6.5"/></svg>';

    panel = el('div', { id: 'a11y-panel', role: 'dialog', 'aria-labelledby': 'a11y-title', hidden: '' });

    var head = el('div', { id: 'a11y-head' });
    head.appendChild(el('h2', { id: 'a11y-title' }, T.title));
    var x = el('button', { id: 'a11y-x', type: 'button', 'aria-label': T.close }, '×');
    head.appendChild(x);
    panel.appendChild(head);

    var size = el('div', { id: 'a11y-size', role: 'group', 'aria-label': T.size });
    size.appendChild(el('span', {}, T.size));
    minus = el('button', { type: 'button', 'aria-label': T.smaller }, 'א−');
    sizeOut = el('output', { 'aria-live': 'polite', style: 'min-width:48px;text-align:center;font-weight:700' });
    plus = el('button', { type: 'button', 'aria-label': T.bigger }, 'א+');
    if (lang !== 'he') { minus.textContent = lang === 'ar' ? 'أ−' : 'A−'; plus.textContent = lang === 'ar' ? 'أ+' : 'A+'; }
    size.appendChild(minus); size.appendChild(sizeOut); size.appendChild(plus);
    panel.appendChild(size);

    var grid = el('div', { id: 'a11y-grid' });
    TOGGLES.forEach(function (k) {
      var b = el('button', { type: 'button', 'data-k': k, 'aria-pressed': 'false' }, T[k]);
      b.addEventListener('click', function () { state[k] = !state[k]; save(); apply(); });
      grid.appendChild(b);
    });
    panel.appendChild(grid);

    var foot = el('div', { id: 'a11y-foot' });
    var reset = el('button', { id: 'a11y-reset', type: 'button' }, T.reset);
    foot.appendChild(reset);
    foot.appendChild(el('a', { href: T.href }, T.statement));
    panel.appendChild(foot);

    wrap.appendChild(panel);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    function open() { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); x.focus(); }
    function close(refocus) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (refocus) btn.focus(); }

    btn.addEventListener('click', function () { panel.hidden ? open() : close(false); });
    x.addEventListener('click', function () { close(true); });
    minus.addEventListener('click', function () { if (state.size > 0) { state.size--; save(); apply(); } });
    plus.addEventListener('click', function () { if (state.size < SIZES.length - 1) { state.size++; save(); apply(); } });
    reset.addEventListener('click', function () { state = { size: 0 }; save(); apply(); });
    wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); close(true); } });
    document.addEventListener('click', function (e) { if (!panel.hidden && !wrap.contains(e.target)) close(false); });

    apply();
  }

  /* מחילים את ההעדפות מיד, עוד לפני שהכפתור נבנה, כדי שלא יהבהב */
  apply();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
