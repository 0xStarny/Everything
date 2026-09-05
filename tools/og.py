"""Draws one Open Graph card per view, from views.json.

Run once after editing views.json:  python tools/og.py
The cards are committed; there is no build-time image step.
"""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets', 'og')
os.makedirs(OUT, exist_ok=True)

W, H = 1200, 630
BG, FG, MUT, ACC = (29, 32, 41), (255, 255, 255), (160, 169, 187), (56, 126, 252)
DIM = (86, 92, 110)

FONTS = {
    True:  [r"C:\Windows\Fonts\seguisb.ttf", r"C:\Windows\Fonts\arialbd.ttf"],
    False: [r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\arial.ttf"],
}


def font(size, bold=False):
    for p in FONTS[bold]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def wrap(draw, text, f, width):
    """Greedy wrap to a pixel width."""
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=f) <= width:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def mark(d, x, y, s, fill=FG):
    """The three stacked bars of the Everything logo."""
    for pts in ([[0, 4.5], [11.7, 0.1], [11.7, 4.2], [0, 8.6]],
                [[0, 10.9], [11.7, 6.7], [11.7, 10.8], [6, 13.1]],
                [[0, 10.9], [11.7, 15.2], [11.7, 19.5], [0, 15.2]]):
        d.polygon([(x + px * s, y + py * s) for px, py in pts], fill=fill)


def card(v, coin):
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)

    # a faint tick ladder on the right, the one visual motif the whole guide shares
    for i in range(15):
        y = 40 + i * 40
        d.line([(760, y), (1160, y)], fill=(44, 48, 60), width=1)

    # the coin, low opacity, bleeding off the right edge
    if coin:
        c = coin.resize((520, 520), Image.LANCZOS)
        faded = Image.new('RGBA', c.size, (0, 0, 0, 0))
        faded = Image.blend(faded, c, 0.30)
        img.paste(faded, (830, 120), faded)

    mark(d, 72, 62, 2.6)
    d.text((132, 68), 'Everything, the guide', font=font(24, True), fill=MUT)

    y = 190
    if v['kicker']:
        d.text((72, y), v['kicker'], font=font(21, True), fill=ACC)
        y += 44

    f = font(66, True)
    lines = wrap(d, v['og'], f, 660)
    for ln in lines[:3]:
        d.text((72, y), ln, font=f, fill=FG)
        y += 76
    y += 12

    fd = font(25)
    for ln in wrap(d, v['desc'], fd, 640)[:4]:
        d.text((72, y), ln, font=fd, fill=MUT)
        y += 36

    d.text((72, H - 76), v.get('url_label', 'everything, the guide  ·  EN / FR'),
           font=font(22, True), fill=DIM)
    d.rectangle([0, H - 8, W, H], fill=ACC)
    return img


def main():
    meta = json.load(open(os.path.join(ROOT, 'views.json'), encoding='utf-8'))
    coin_path = os.path.join(ROOT, 'assets', 'badge.webp')
    coin = Image.open(coin_path).convert('RGBA') if os.path.exists(coin_path) else None

    for v in meta['views']:
        img = card(v, coin)
        p = os.path.join(OUT, v['id'] + '.png')
        img.save(p, optimize=True)
        print(f"  {v['id']:9s} {os.path.getsize(p)//1024:4d} kB  {v['og']}")

    # the default card, used for the bare domain
    root = dict(meta['views'][0])
    root['og'] = meta['site']['tagline']
    root['kicker'] = 'AN ANIMATED READING OF THE WHITEPAPER'
    root['desc'] = ('Six people followed step by step, in plain language, with every diagram '
                    'animated. Then six tests and a badge you have to earn.')
    card(root, coin).save(os.path.join(ROOT, 'og.png'), optimize=True)
    print(f"  {'root':9s} {os.path.getsize(os.path.join(ROOT, 'og.png'))//1024:4d} kB")


if __name__ == '__main__':
    main()
