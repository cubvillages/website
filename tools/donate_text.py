#!/usr/bin/env python3
"""Write the texts of content/donate.json into the static HTML of the donate pages.

The live pages already read content/donate.json in the browser, so editing that file changes the
site right away. This script keeps the HTML itself (what search engines and no-JS visitors see) in step.
Run after editing content/donate.json, BEFORE tools/sync_donate_ar.py:
    python3 tools/donate_text.py && python3 tools/sync_donate_ar.py
"""
import re, os, json, html
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'
PAGES = (('he', 'donate/index.html'), ('en', 'en/donate/index.html'), ('ar', 'ar/donate/index.html'))
C = json.load(open(R + 'content/donate.json', encoding='utf-8'))

def val(key, lang):
    v = C.get(key, {}).get(lang) if isinstance(C.get(key), dict) else None
    return v if isinstance(v, str) and v != '' else None

def attr_esc(v): return v.replace('&', '&amp;').replace('"', '&quot;')

for lang, path in PAGES:
    p = R + path
    if not os.path.exists(p): continue
    s = open(p, encoding='utf-8').read(); o = s
    def text(m):
        v = val(m.group(3), lang)
        if v is None: return m.group(0)
        return m.group(1) + (v if '<' in v else html.escape(v, quote=False)) + m.group(5)
    s = re.sub(r'(<(\w+)[^>]*?\sdata-t="([^"]+)"[^>]*>)(.*?)(</\2>)',
               lambda m: (lambda g: g[0] + (lambda v: v if v is not None else g[3])(
                   (lambda v: None if v is None else (v if '<' in v else html.escape(v, quote=False)))(val(g[2], lang))) + g[4])(
                   (m.group(1), m.group(2), m.group(3), m.group(4), m.group(5))), s, flags=re.S)
    def attrs(m):
        tag = m.group(0)
        for pair in re.search(r'data-t-attr="([^"]+)"', tag).group(1).split(';'):
            a, k = pair.split(':'); v = val(k, lang)
            if v is None: continue
            if re.search(r'\s' + re.escape(a) + r'="', tag):
                tag = re.sub(r'(\s' + re.escape(a) + r'=")[^"]*"', lambda mm: mm.group(1) + attr_esc(v) + '"', tag, count=1)
            else:
                tag = tag[:-1] + f' {a}="{attr_esc(v)}">'
        return tag
    s = re.sub(r'<[^>]*\sdata-t-attr="[^"]+"[^>]*>', attrs, s)
    if s != o:
        open(p, 'w', encoding='utf-8').write(s); print('updated', path)
    else:
        print('no change', path)
