/* שחזור מקום הגלילה ברענון. הדפדפן לא משחזר אמין כשהעמוד נטען בהדרגה, ולכן שומרים בעצמנו. */
(function () {
  var key = 'scroll:' + location.pathname, t;
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  function save() { try { sessionStorage.setItem(key, String(Math.round(window.pageYOffset))); } catch (e) {} }
  window.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(save, 120); }, { passive: true });
  window.addEventListener('pagehide', save);
  if (location.hash) return;
  var y = 0;
  try { y = parseInt(sessionStorage.getItem(key) || '0', 10) || 0; } catch (e) {}
  if (!y) return;
  function go() { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); }
  go();
  window.addEventListener('DOMContentLoaded', go);
  window.addEventListener('pageshow', function (e) { if (e.persisted) go(); });
  window.addEventListener('load', function () { go(); setTimeout(go, 300); setTimeout(go, 1000); });
})();
