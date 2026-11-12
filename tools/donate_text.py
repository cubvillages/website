#!/usr/bin/env python3
"""Write the texts of content/donate.json into the static HTML of the donate pages.

The live pages already read content/donate.json in the browser, so editing that file changes the
site right away. This script keeps the HTML itself (what search engines and no-JS visitors see) in step.
After editing content/donate.json run:
    python3 tools/sync_donate_ar.py && python3 tools/donate_text.py
(sync_donate_ar.py uses bake() from this file, so the Arabic page always gets its texts from the file.)
"""
import re, os, json, html
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'
PAGES = (('he', 'donate/index.html'), ('en', 'en/donate/index.html'), ('ar', 'ar/donate/index.html'))


def load():
    return json.load(open(R + 'content/donate.json', encoding='utf-8'))


def _val(C, key, lang):
    e = C.get(key)
    v = e.get(lang) if isinstance(e, dict) else None
    return v if isinstance(v, str) and v != '' else None


def _attr_esc(v):
    return v.replace('&', '&amp;').replace('"', '&quot;')


def bake(s, lang, C=None):
    """Return page source s with every data-t / data-t-attr value replaced by C[key][lang]."""
    C = C or load()

    def text(m):
        v = _val(C, m.group(3), lang)
        if v is None:
            return m.group(0)
        return m.group(1) + (v if '<' in v else html.escape(v, quote=False)) + m.group(5)

    s = re.sub(r'(<(\w+)[^>]*?\sdata-t="([^"]+)"[^>]*>)(.*?)(</\2>)', text, s, flags=re.S)

    def attrs(m):
        tag = m.group(0)
        for pair in re.search(r'data-t-attr="([^"]+)"', tag).group(1).split(';'):
            a, k = pair.split(':')
            v = _val(C, k, lang)
            if v is None:
                continue
            if re.search(r'\s' + re.escape(a) + r'="', tag):
                tag = re.sub(r'(\s' + re.escape(a) + r'=")[^"]*"', lambda mm: mm.group(1) + _attr_esc(v) + '"', tag, count=1)
            else:
                tag = tag[:-1] + f' {a}="{_attr_esc(v)}">'
        return tag

    return re.sub(r'<[^>]*\sdata-t-attr="[^"]+"[^>]*>', attrs, s)


def main():
    C = load()
    for lang, path in PAGES:
        p = R + path
        if not os.path.exists(p):
            continue
        s = open(p, encoding='utf-8').read()
        t = bake(s, lang, C)
        if t != s:
            open(p, 'w', encoding='utf-8').write(t)
            print('updated', path)
        else:
            print('no change', path)


if __name__ == '__main__':
    main()
