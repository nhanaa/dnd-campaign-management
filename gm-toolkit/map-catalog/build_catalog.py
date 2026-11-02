"""Build the browsable catalogue for the Battle Maps Collection.

  python -I build_catalog.py "<collection dir>"     (Pillow needed; dnd-transcription/.venv has it)

Reads tags.tsv (hand-written after looking at every map). Writes:
  CATALOG.md here (names and tags only, safe for git)
  <collection>/_Catalog/index.html and thumbs/ (art stays out of the repo)
Run again after adding packs; new maps are listed as UNTAGGED so they can be looked at and added.
"""
import collections
import html
import json
import os
import re
import sys
from urllib.parse import quote

from PIL import Image

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
IMG = ('.jpg', '.jpeg', '.webp', '.png')
SKIP = re.compile(r'stat ?blocks?|monster art|scene art|asset pack|overview|_Catalog', re.I)
CATS = {
    'arena': 'Arenas', 'wilds': 'Wilderness', 'water': 'Rivers, Lakes & Coast', 'cave': 'Caves',
    'dungeon': 'Dungeons, Lairs & Temples', 'ruins': 'Shrines, Ruins & Graveyards', 'camp': 'Camps',
    'building': 'Homes, Taverns & Shops', 'fort': 'Forts & Manors', 'settlement': 'Villages & Towns (battle scale)',
    'vessel': 'Ships, Airships & Trains', 'city': 'City Maps (overview)', 'region': 'Region Maps', 'world': 'World & Continent Maps',
}
MOODS = ['day', 'dusk', 'night', 'fog', 'rain', 'storm', 'blood', 'bloodmoon', 'corrupt', 'ethereal', 'fey', 'slaughter', 'lava', 'light', 'dark', 'ancient drawing', 'handdrawn', 'no lighting']


def stem(f):
    s = re.sub(r'^\[?\d+x\d+\]?\s*', '', os.path.splitext(f)[0])
    s = re.sub(r'[_\-]+', ' ', s)
    tok = r'(?:day|dusk|dawn|night|fog|rain|snow|storm|blood|bloodmoon|corrupt|ethereal|fey|lava|light|dark|no lighting|nolighting|ancient drawing|hand ?drawn|slaughter|grid|gl|ng|b&w|bw|default|parchment|labelled|labeled|untitled|titled|framed|base map|unlabelled|empty|roof|noroof)'
    prev = None
    while prev != s:
        prev = s
        s = re.sub(r'\s+' + tok + r'\s*$', '', s, flags=re.I).strip()
    return re.sub(r'\s+(Day|Night|Light|Dark|Dusk|Fog|Rain)[A-Za-z]*$', '', s).strip()


def scan(root):
    groups, vtts = collections.defaultdict(list), []
    for d, _, fs in os.walk(root):
        rel = os.path.relpath(d, root)
        if SKIP.search(rel):
            continue
        for f in fs:
            if f.endswith('.dd2vtt'):
                vtts.append(os.path.join(rel, f))
        ims = [f for f in fs if f.lower().endswith(IMG) and not SKIP.search(f)]
        if not ims:
            continue
        parts = rel.split('/')
        if len(parts) >= 2:
            groups[(parts[0], '/'.join(parts[1:]))] += [os.path.join(rel, f) for f in ims]
        else:
            for f in ims:
                groups[(parts[0], stem(f))].append(os.path.join(rel, f))
    return groups, vtts


def vtt_info(path):
    with open(path, 'rb') as h:
        b = h.read(4_000_000)
    j = json.loads(b[:b.find(b'"image"')].rstrip().rstrip(b',') + b'}')
    return dict(ms=j['resolution']['map_size'], ppg=j['resolution']['pixels_per_grid'],
                walls=len(j.get('line_of_sight', [])) + len(j.get('objects_line_of_sight', [])),
                doors=len(j.get('portals', [])), lights=len(j.get('lights', [])))


def toks(s):
    s = re.sub(r"\[?\d+\s*x\s*\d+\]?", ' ', s.lower()).replace("'", '').replace('_s', 's')
    return set(re.findall(r'[a-z0-9]+', s)) - {'the', 'of', 'and', 'battle', 'maps', 'day', 'night', 'map', 'vtts', 'vtt'}


def thumb_rank(f):
    b = os.path.basename(f).lower()
    s = 0
    if re.search(r'grid|\bgl\b', b): s += 8
    if re.search(r'blood|corrupt|night|ethereal|drawing|handdrawn|fog|rain|dusk|slaughter|fey|b&w|bw\b|parchment|dark|noroof|empty', b): s += 4
    if re.search(r'\bday\b|default', b): s -= 3
    if re.search(r'no_?lighting|nolighting', b): s -= 2
    if re.search(r'dayno|noriver|nobridge|nohand|noship|no_', b): s += 2
    if re.search(r'label|titled', b): s += 1
    return s, len(b)


def variants(files):
    names = [os.path.basename(f).lower().replace('_', ' ') for f in files if not re.search(r'grid|\bgl\b', os.path.basename(f), re.I)]
    moods, off = set(), set()
    for n in names:
        n = os.path.splitext(n)[0]
        for m in MOODS:
            if re.search(r'\b' + m + r'\b', n) or (m == 'no lighting' and 'nolighting' in n):
                moods.add(m)
        for x in re.findall(r'(?:day|night|light|dark)\s?(no ?[a-z]+|empty|roof)', n):
            x = x.replace(' ', '')
            if x != 'nolighting':
                off.add(x)
    return sorted(moods), sorted(off)


def main(root):
    tags = {}
    with open(os.path.join(HERE, 'tags.tsv'), encoding='utf-8') as h:
        for line in h:
            if line.startswith('#') or not line.strip():
                continue
            pack, name, title, cat, biome, use, note = line.rstrip('\n').split('\t')
            tags[(pack, name)] = dict(title=title, cat=cat, biome=biome.split(), use=use.split(), note=note)
    MERGE = {('Commissions Pack 2', '25x27 The Weary Smokehouse/Night'): ('Commissions Pack 2', '25x27 The Weary Smokehouse/Day'),
             ('Commissions Pack 2', '45x46 Grey Hand of Old/Night'): ('Commissions Pack 2', '45x46 Grey Hand of Old/Day'),
             ('Scorched Deserts Pack 1', 'desert ruins evil'): ('Scorched Deserts Pack 1', 'desert ruins')}
    groups, vtts = scan(root)
    modules = {os.path.relpath(d, root).split('/')[0] for d, _, fs in os.walk(root) for f in fs if re.search(r'manif', f, re.I) and f.lower().endswith('.txt')}
    for a, b in MERGE.items():
        if a in groups:
            groups[b] += groups.pop(a)
    infos = {v: vtt_info(os.path.join(root, v)) for v in vtts}
    out = os.path.join(root, '_Catalog')
    os.makedirs(os.path.join(out, 'thumbs'), exist_ok=True)
    maps, untagged = [], []
    for i, (key, files) in enumerate(sorted(groups.items())):
        t = tags.get(key)
        if not t:
            untagged.append(key)
            t = dict(title=key[1].split('/')[-1], cat='UNTAGGED', biome=[], use=[], note='')
        pack, name = key
        src = sorted(files, key=thumb_rank)[0]
        dim = None
        for s in [name] + files:
            m = re.search(r'(\d+)\s*x\s*(\d+)', os.path.basename(s)) or re.search(r'(\d+)\s*x\s*(\d+)', s)
            if m:
                dim = (int(m[1]), int(m[2]))
                break
        slug = re.sub(r'[^a-z0-9]+', '-', f'{pack} {name}'.lower()).strip('-')
        tp = os.path.join(out, 'thumbs', slug + '.jpg')
        if not os.path.exists(tp):
            im = Image.open(os.path.join(root, src)).convert('RGB')
            im.thumbnail((520, 520))
            im.save(tp, quality=76)
        moods, off = variants(files)
        maps.append(dict(t, pack=pack, folder=os.path.dirname(src), full=src, thumb=f'thumbs/{slug}.jpg', dim=dim, moods=moods, off=off, nfiles=len(files), vtt=[], module=pack in modules))
    # attach VTT files to the map in the same pack whose name best matches
    unmatched = []
    # VTT files whose names don't resemble their map; rooftops is 72x48 at 150 px, Fort Myle's 108x72 at 100 px
    alias = {'Manor Basement 1': 'Victorian Tech Mansion: Basement', 'Manor Basement 2': 'Victorian Tech Mansion: Basement 2',
             'Manor F1': 'Victorian Tech Mansion: F1', 'Manor F2': 'Victorian Tech Mansion: F2',
             'safehouse': "The Quester's Safehouse V1", 'day rooftops': 'Fort Myle', 'night rooftops': 'Fort Myle',
             'The Ashen Emerald Basement': 'The Ashen Emerald: Bottom', "26x36 Olo_s SkyShip Lower Rooms": "Olo's Airship: Lower Rooms"}
    for v, inf in infos.items():
        pack = v.split('/')[0]
        vt = toks(os.path.basename(v))
        forced = alias.get(os.path.splitext(os.path.basename(v))[0].strip())
        best, score = None, 0
        for m in maps:
            if m['pack'] != pack:
                continue
            if forced:
                if m['title'] == forced:
                    best, score = m, 1
                continue
            mt = toks(m['title'])
            hit = len(mt & vt) / max(len(mt), 1)
            # a VTT sitting inside the map's own folder belongs to that map whatever its name says
            if '/' in m['folder'] and (v.startswith(m['folder'] + '/') or os.path.dirname(os.path.dirname(v)) == m['folder']):
                hit = 2
            if hit > score:
                best, score = m, hit
        if best is None or score < 0.5:
            unmatched.append(v)
        else:
            best['vtt'].append(dict(inf, file=v))
    for m in maps:
        vs = m.pop('vtt')
        m['nvtt'] = len(vs)
        m['walls'] = max((x['walls'] for x in vs), default=0)
        m['doors'] = max((x['doors'] for x in vs), default=0)
        m['lights'] = max((x['lights'] for x in vs), default=0)
        m['vttgrid'] = next(([x['ms']['x'], x['ms']['y']] for x in vs), None)
        if m['cat'] in ('city', 'region', 'world'):
            m['size'] = ''
        elif m['dim']:
            a = max(m['dim'])
            m['size'] = 'small' if a <= 25 else 'medium' if a <= 50 else 'large'
        else:
            m['size'] = ''
    order = list(CATS)
    maps.sort(key=lambda m: (order.index(m['cat']) if m['cat'] in order else 99, m['title'].lower()))
    write_md(maps)
    write_html(maps, out)
    print(f'{len(maps)} maps, {len(untagged)} untagged, {len(unmatched)} VTT files not matched to a map')
    for u in untagged:
        print('  UNTAGGED', u)
    print('  unmatched by pack:', collections.Counter(u.split('/')[0] for u in unmatched).most_common())
    for u in unmatched[:15]:
        print('   ', u)


def row(m):
    d = f"{m['dim'][0]}x{m['dim'][1]}" if m['dim'] else ''
    vt = f"{m['nvtt']} ({'walls' if m['walls'] else 'no walls'})" if m['nvtt'] else 'none'
    if m['module']:
        vt += ', pack has module'
    return f"| {m['title']} | {d} | {' '.join(m['biome'])} | {' '.join(m['use'])} | {m['note']}{' Off-switches: ' + ', '.join(m['off']) + '.' if m['off'] else ''} | {vt} | {m['pack']} |"


def write_md(maps):
    with open(os.path.join(HERE, 'CATALOG.md'), 'w', encoding='utf-8') as h:
        h.write('# Battle Maps Catalogue\n\nGenerated by `build_catalog.py` from `tags.tsv`. To see the art, open `_Catalog/index.html` inside the collection folder. "pack has module" means the pack includes a Foundry manifest link (a `*manif*.txt` file); it is not confirmed to cover that map.\n\n')
        h.write('**Tags.** Setting: temperate, autumn, snow, desert, jungle, swamp, coast, underground, underwater, lava, blood, candy, astral, sky. Genre: steampunk, western, pirate, modern, horror, eldritch, whimsical. `giant` = a colossal creature or remains is part of the art.\n')
        h.write('**Use.** hunt = room for a big-monster fight; boss = strong final-room set piece; ambush, travel, social, rest, investigation, heist, siege, exploration.\n\n')
        cats = collections.OrderedDict()
        for m in maps:
            cats.setdefault(m['cat'], []).append(m)
        hunts = [m for m in maps if 'hunt' in m['use']]
        h.write(f'## Monster-hunt shortlist ({len(hunts)})\n\n' + ', '.join(sorted(m['title'] for m in hunts)) + '\n\n')
        for c, ms in cats.items():
            h.write(f"## {CATS.get(c, c)} ({len(ms)})\n\n| Map | Size | Tags | Use | What's on it | VTT files | Pack |\n|---|---|---|---|---|---|---|\n")
            h.write('\n'.join(row(m) for m in ms) + '\n\n')


def write_html(maps, out):
    data = json.dumps([dict(t=m['title'], c=m['cat'], cn=CATS.get(m['cat'], m['cat']), b=m['biome'], u=m['use'], n=m['note'], p=m['pack'],
                            th=m['thumb'], full='../' + quote(m['full']), folder='../' + quote(m['folder']), dim=m['dim'], s=m['size'],
                            mo=m['moods'], of=m['off'], v=m['nvtt'], w=m['walls'], d=m['doors'], g=m['vttgrid'], mod=m['module']) for m in maps], ensure_ascii=False)
    page = TEMPLATE.replace('__DATA__', data.replace('</', '<\\/')).replace('__CATS__', json.dumps(CATS))
    with open(os.path.join(out, 'index.html'), 'w', encoding='utf-8') as h:
        h.write(page)


TEMPLATE = r'''<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Battle Maps Catalogue</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#16140f;color:#e9e3d3;font:15px/1.4 system-ui,Segoe UI,sans-serif}
header{position:sticky;top:0;z-index:2;background:#1f1c15;border-bottom:1px solid #3a3528;padding:10px 16px}
h1{font-size:18px;margin:0 8px 0 0;display:inline}#q{width:min(320px,100%);padding:6px 10px;background:#12100c;color:inherit;border:1px solid #4a4433;border-radius:6px}
#count{margin-left:10px;color:#a89f88}.row{margin-top:7px;display:flex;flex-wrap:wrap;gap:5px;align-items:center}.lab{font-size:12px;color:#a89f88;width:58px}
button{background:#2a261c;color:#d9d2bf;border:1px solid #4a4433;border-radius:999px;padding:3px 10px;font:inherit;font-size:13px;cursor:pointer}button.on{background:#c8ad62;color:#1b170e;border-color:#c8ad62}
main{padding:16px}h2{font-size:17px;margin:22px 0 10px;color:#c8ad62}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.card{background:#211e16;border:1px solid #3a3528;border-radius:8px;overflow:hidden;display:flex;flex-direction:column}.card img{width:100%;height:210px;object-fit:contain;background:#0d0c09;display:block}
.b{padding:8px 10px}.t{font-weight:600}.m{font-size:12.5px;color:#a89f88}.n{font-size:13px;margin:4px 0}.k{display:inline-block;font-size:11px;padding:1px 6px;border-radius:4px;background:#332e22;margin:2px 3px 0 0}.k.u{background:#4a3b1c}.k.h{background:#6d2f22}
a{color:#d9bd6e}
@media(max-width:700px){header{position:static}.lab{width:100%}}
</style></head><body><header><h1>Battle Maps</h1><input id="q" placeholder="Search names and descriptions" aria-label="Search"><span id="count"></span>
<div class="row" id="fc"><span class="lab">Place</span></div><div class="row" id="fb"><span class="lab">Setting</span></div><div class="row" id="fu"><span class="lab">Use</span></div><div class="row" id="fs"><span class="lab">Size</span></div><div class="row" id="fx"><span class="lab">Foundry</span></div></header><main id="m"></main>
<script>
const D=__DATA__,C=__CATS__;const st={c:new Set,b:new Set,u:new Set,s:new Set,x:new Set,q:''};
const uniq=f=>[...new Set(D.flatMap(f))].sort();
function btns(id,key,vals,lab=v=>v){const r=document.getElementById(id);vals.forEach(v=>{const b=document.createElement('button');b.textContent=lab(v);b.onclick=()=>{st[key].has(v)?st[key].delete(v):st[key].add(v);b.classList.toggle('on');draw()};r.append(b)})}
btns('fc','c',Object.keys(C).filter(k=>D.some(d=>d.c==k)),k=>C[k]);btns('fb','b',uniq(d=>d.b));btns('fu','u',uniq(d=>d.u));btns('fs','s',['small','medium','large'],v=>({small:'small (up to 25)',medium:'medium (up to 50)',large:'large (over 50)'}[v]));btns('fx','x',['vtt','walls','mod'],v=>({vtt:'has VTT file',walls:'has walls',mod:'pack has module'}[v]));
document.getElementById('q').oninput=e=>{st.q=e.target.value.toLowerCase();draw()};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ok(d){if(st.c.size&&!st.c.has(d.c))return false;for(const v of st.b)if(!d.b.includes(v))return false;for(const v of st.u)if(!d.u.includes(v))return false;if(st.s.size&&!st.s.has(d.s))return false;if(st.x.has('vtt')&&!d.v)return false;if(st.x.has('walls')&&!d.w)return false;if(st.x.has('mod')&&!d.mod)return false;if(st.q&&!(d.t+' '+d.n+' '+d.p).toLowerCase().includes(st.q))return false;return true}
function draw(){const R=D.filter(ok);document.getElementById('count').textContent=R.length+' of '+D.length;let h='',cur;for(const d of R){if(d.c!=cur){if(cur)h+='</div>';cur=d.c;h+='<h2>'+esc(d.cn)+'</h2><div class="grid">'}
const sz=d.dim?d.dim[0]+'×'+d.dim[1]:'';const g=d.g&&d.dim&&(d.g[0]!=d.dim[0])?' · VTT grid '+d.g[0]+'×'+d.g[1]:'';
h+='<div class="card"><a href="'+d.full+'" target="_blank"><img loading="lazy" src="'+esc(d.th)+'" alt="'+esc(d.t)+'"></a><div class="b"><div class="t">'+esc(d.t)+'</div><div class="m">'+[sz,esc(d.p)].filter(Boolean).join(' · ')+'</div><div class="n">'+esc(d.n)+'</div>'+d.u.map(u=>'<span class="k '+(u=='hunt'?'h':'u')+'">'+esc(u)+'</span>').join('')+d.b.map(b=>'<span class="k">'+esc(b)+'</span>').join('')+'<div class="m" style="margin-top:5px">'+(d.mo.length?'Versions: '+esc(d.mo.join(', '))+'. ':'')+(d.of.length?'Off-switches: '+esc(d.of.join(', '))+'. ':'')+(d.v?d.v+' VTT'+(d.w?', walls':', no walls')+(d.d?', doors':'')+g:'No VTT file')+(d.mod?' · pack has Foundry module':'')+' · <a href="'+d.folder+'">folder</a></div></div></div>'}
document.getElementById('m').innerHTML=h+(cur?'</div>':'<p>No maps match those filters.</p>')}draw();
</script></body></html>'''

if __name__ == '__main__':
    main(sys.argv[1])
