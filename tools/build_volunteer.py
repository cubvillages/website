#!/usr/bin/env python3
"""Builds /volunteer/, /en/volunteer/, /ar/volunteer/ from the accessibility pages (shared header/footer)."""
import re, urllib.parse, html

WA = "972542550085"
MAIL = "ntiyft@gmail.com"

CSS = '''
.vol h1{margin:0 0 14px;font-size:44px;font-weight:800;line-height:1.15;color:#FFFFFF}
.vol h2{margin:0 0 18px;font-size:28px;font-weight:800;line-height:1.25;color:#3B1D12}
.vol p,.vol li{font-size:18px;line-height:1.7;color:#4F3226}
.vol p{margin:0 0 12px}
.hero{position:relative;background:#3B1D12 url(/assets/img/strip-village.jpg) center/cover no-repeat}
.hero:before{content:"";position:absolute;inset:0;background:rgba(59,29,18,.62)}
.hero .in{position:relative;max-width:860px;margin:0 auto;padding:64px 24px 56px}
.hero p{font-size:21px;color:#FFF4D6;max-width:680px;margin:0}
.wrap{max-width:860px;margin:0 auto;padding:44px 24px 56px}
.job{border:1px solid #EBD3A0;border-radius:12px;background:#FFFFFF;margin-bottom:14px;overflow:hidden}
.job[open]{border-color:#F5B321;box-shadow:0 4px 14px rgba(59,29,18,.08)}
.job summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:16px;padding:20px 22px;min-height:44px}
.job summary::-webkit-details-marker{display:none}
.job summary:focus-visible{outline:3px solid #F5B321;outline-offset:-3px}
.job .t{font-size:21px;font-weight:800;color:#3B1D12;line-height:1.3}
.job .m{display:block;margin-top:2px;font-size:15px;color:#6B4A3A;font-weight:500}
.job summary:after{content:"";margin-inline-start:auto;flex:none;width:10px;height:10px;border-right:3px solid #B8451F;border-bottom:3px solid #B8451F;transform:rotate(45deg);transition:transform .15s}
.job[open] summary:after{transform:rotate(-135deg)}
.job .b{padding:0 22px 22px;border-top:1px solid #F3E2B8;padding-top:18px}
.job ul{margin:0 0 14px;padding-inline-start:22px}.job li{margin-bottom:6px}
.cta{display:flex;flex-wrap:wrap;align-items:center;gap:8px 18px;margin-top:6px}
.btn{display:inline-flex;align-items:center;gap:8px;min-height:48px;box-sizing:border-box;padding:10px 24px;border-radius:999px;font-size:17px;font-weight:800;text-decoration:none;background:#B8451F;color:#FFFFFF}
.btn:hover{background:#963714;color:#FFFFFF}
.alt{font-size:16px;font-weight:700}
.more{margin-top:28px;padding:22px;background:#FFF4D6;border-radius:12px}
.vol .note{margin-top:22px;font-size:15px;color:#6B4A3A}
@media (max-width:700px){.vol h1{font-size:32px}.hero .in{padding:44px 20px 40px}.job summary{padding:16px}.job .t{font-size:19px}.job .b{padding:16px 16px 18px}}
</style>'''

ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1 1 21 11.5z"/></svg>'

# Each language: ui strings + jobs. First job is real; the rest are DUMMY examples.
L = {
 'he': dict(path='/volunteer/', title='התנדבות | המועצה למען הכפרים הבדואיים הלא מוכרים',
  h1='מתנדבים עם המועצה',
  hero='הצרכים שלנו רבים והידיים מעטות. יש לכם זמן, כישורים ורצון לסייע? נשמח להתחיל מיד',
  h2='מודעות דרושים', apply='הגשת מועמדות בוואטסאפ', email='או במייל',
  wa='שלום נתי, אני מעוניין/ת להתנדב: ', subj='התנדבות במועצה: ',
  more='לא מצאתם משרה שמתאימה? כתבו לנו מה אתם יודעים לעשות', morebtn='כתבו לנו',
  note='כל התפקידים בהתנדבות, ללא שכר',
  jobs=[
   ('צוות התקשורת: כתבים וכתבות מתנדבים','בשטח או מרחוק · מחצי שעה עד חצי יום בשבוע',
    'למדתם תקשורת, אוהבים לכתוב או נמצאים כבר בשטח? הצטרפו לצוות התקשורת של המועצה, בליווי והדרכה צמודים של נתי יפת, דובר המועצה',
    ['ראיון מוקלט קצר עם פונים למועצה (אפשר בערבית)','כתיבת אייטם מהתחלה ועד הסוף, כולל ויזואליה','ראיונות שטח עם מי שיש להם סיפור להוציא','סיוע בצילומי שטח ואירועים','איסוף מידע ממקורות שונים'],
    'חלק מהמשימות בכפרים, חלקן מרחוק מהטלפון או מהמחשב. כל מתנדב יופעל בדרך המתאימה לו'),
   ('מתנדבי גיוס כספים בארצות הברית','מרחוק · כשעתיים בשבוע',
    'עוזרים לנו לבנות בסיס של תומכים חודשיים בקהילה היהודית בארצות הברית',
    ['פנייה לחברים, לקהילות ולארגונים','ארגון מפגשי בית וערבי הסברה','הפצת הקמפיין ברשתות החברתיות'],''),
   ('מתרגמים ומתרגמות','מרחוק · לפי הזמינות',
    'מתרגמים את תוכני המועצה בין עברית, ערבית ואנגלית',
    ['תרגום פוסטים ועדכונים','הגהה של תרגומים קיימים','תרגום עמודים באתר'],''),
   ('צלמים ועורכי וידאו','בשטח · לפי אירועים',
    'מתעדים את החיים בכפרים ואת אירועי המועצה',
    ['צילום תושבים, כפרים ואירועים','עריכת סרטונים קצרים לרשתות','מיון והעלאה של חומרים לארכיון'],''),
  ]),
 'en': dict(path='/en/volunteer/', title='Volunteer | The Council for the Unrecognized Bedouin Villages',
  h1='Volunteer with the Council',
  hero='Our needs are many and the hands are few. Have the time, the skills and the will to help? We would love to start right away',
  h2='Open positions', apply='Apply on WhatsApp', email='or by email',
  wa="Hi Nati, I'd like to volunteer: ", subj='Volunteering with the Council: ',
  more="Don't see a fit? Tell us what you can do", morebtn='Write to us',
  note='All roles are voluntary and unpaid',
  jobs=[
   ('Media team: volunteer reporters','In the field or remote · half an hour to half a day a week',
    "Did you study media, love writing, or already work in the field? Join the council's media team, with close guidance from Nati Yafet, the council's spokesperson",
    ['A short recorded interview with people who contact the council (Arabic is fine)','Writing an item from start to finish, including visuals','Field interviews with people who have a story to tell','Helping with field photography and events','Gathering information from different sources'],
    'Some tasks are in the villages, some are remote from a phone or computer. Each volunteer is matched to what suits them'),
   ('Fundraising volunteers in the United States','Remote · about two hours a week',
    'Help us build a base of monthly supporters in the American Jewish community',
    ['Reaching out to friends, communities and organizations','Organizing house meetings and information evenings','Spreading the campaign on social media'],''),
   ('Translators','Remote · flexible hours',
    "Translate the council's content between Hebrew, Arabic and English",
    ['Translating posts and updates','Proofreading existing translations','Translating website pages'],''),
   ('Photographers and video editors','In the field · per event',
    "Document life in the villages and the council's events",
    ['Photographing residents, villages and events','Editing short videos for social media','Sorting and uploading material to the archive'],''),
  ]),
 'ar': dict(path='/ar/volunteer/', title='التطوع | المجلس من أجل القرى البدوية غير المعترف بها',
  h1='تطوّعوا مع المجلس',
  hero='احتياجاتنا كثيرة والأيدي قليلة. هل لديكم الوقت والمهارات والرغبة في المساعدة؟ يسعدنا أن نبدأ فورًا',
  h2='فرص التطوع المتاحة', apply='قدّموا عبر واتساب', email='أو عبر البريد الإلكتروني',
  wa='مرحبًا ناتي، أرغب في التطوع: ', subj='التطوع في المجلس: ',
  more='لم تجدوا ما يناسبكم؟ أخبرونا بما تجيدونه', morebtn='راسلونا',
  note='جميع المهام تطوعية وبلا أجر',
  jobs=[
   ('الطاقم الإعلامي: مراسلون ومراسلات متطوعون','في الميدان أو عن بُعد · من نصف ساعة إلى نصف يوم أسبوعيًا',
    'هل درستم الإعلام، أو تحبون الكتابة، أو تعملون أصلًا في الميدان؟ انضموا إلى الطاقم الإعلامي للمجلس بمرافقة وإرشاد مباشرين من ناتي يافت، الناطق باسم المجلس',
    ['مقابلة مسجّلة قصيرة مع من يتوجهون إلى المجلس (ويمكن أن تكون بالعربية)','كتابة مادة إعلامية من البداية حتى النهاية، بما في ذلك الجانب البصري','مقابلات ميدانية مع أصحاب القصص','المساعدة في التصوير الميداني وتغطية الفعاليات','جمع معلومات من مصادر مختلفة'],
    'بعض المهام في القرى وبعضها عن بُعد من الهاتف أو الحاسوب. يُكلَّف كل متطوع بما يناسبه'),
   ('متطوعو جمع التبرعات في الولايات المتحدة','عن بُعد · نحو ساعتين أسبوعيًا',
    'ساعدونا في بناء قاعدة من الداعمين الشهريين في الجالية اليهودية في الولايات المتحدة',
    ['التواصل مع الأصدقاء والجاليات والمنظمات','تنظيم لقاءات منزلية وأمسيات توعية','نشر الحملة في وسائل التواصل الاجتماعي'],''),
   ('مترجمون ومترجمات','عن بُعد · حسب التوفر',
    'ترجمة مضامين المجلس بين العبرية والعربية والإنجليزية',
    ['ترجمة المنشورات والتحديثات','تدقيق الترجمات الموجودة','ترجمة صفحات الموقع'],''),
   ('مصوّرون ومحرّرو فيديو','في الميدان · حسب الفعاليات',
    'توثيق الحياة في القرى وفعاليات المجلس',
    ['تصوير السكان والقرى والفعاليات','مونتاج فيديوهات قصيرة لوسائل التواصل','فرز المواد ورفعها إلى الأرشيف'],''),
  ]),
}
SRC = {'he':'accessibility/index.html','en':'en/accessibility/index.html','ar':'ar/accessibility/index.html'}
OUT = {'he':'volunteer/index.html','en':'en/volunteer/index.html','ar':'ar/volunteer/index.html'}
e = html.escape

def job(c, i, j):
    title, meta, intro, items, note = j
    wa = f"https://wa.me/{WA}?text=" + urllib.parse.quote(c['wa'] + title)
    mail = f"mailto:{MAIL}?subject=" + urllib.parse.quote(c['subj'] + title)
    lis = ''.join(f'<li>{e(x)}</li>' for x in items)
    extra = f'<p>{e(note)}</p>' if note else ''
    dummy = '' if i == 0 else '<!-- DUMMY posting: example only, replace or delete -->\n'
    return f'''{dummy}<details class="job">
<summary><span><span class="t">{e(title)}</span><span class="m">{e(meta)}</span></span></summary>
<div class="b">
<p>{e(intro)}</p>
<ul>{lis}</ul>
{extra}<div class="cta"><a class="btn" href="{wa}" target="_blank" rel="noopener">{ICON} {e(c['apply'])}</a><a class="alt" href="{mail}">{e(c['email'])}</a></div>
</div>
</details>'''

for lang, c in L.items():
    src = open(SRC[lang], encoding='utf-8').read()
    m = re.search(r'<main[^>]*>.*?</main>', src, re.S)
    head, tail = src[:m.start()], src[m.end():]
    head = re.sub(r'<title>.*?</title>', f'<title>{e(c["title"])}</title>\n<meta name="robots" content="noindex">', head, flags=re.S)
    head = head.replace('accessibility/', 'volunteer/')
    head = head.replace('</style>', CSS, 1)
    wa_more = f"https://wa.me/{WA}?text=" + urllib.parse.quote(c['wa'])
    jobs = '\n'.join(job(c, i, j) for i, j in enumerate(c['jobs']))
    main = f'''<main id="top" class="vol">
<section class="hero"><div class="in">
<h1>{e(c['h1'])}</h1>
<p>{e(c['hero'])}</p>
</div></section>
<div class="wrap">
<h2>{e(c['h2'])}</h2>
{jobs}
<div class="more"><p style="margin-bottom:12px"><strong>{e(c['more'])}</strong></p><a class="btn" href="{wa_more}" target="_blank" rel="noopener">{ICON} {e(c['morebtn'])}</a></div>
<p class="note">{e(c['note'])}</p>
</div>
</main>'''
    open(OUT[lang], 'w', encoding='utf-8').write(head + main + tail)
    print('wrote', OUT[lang])
