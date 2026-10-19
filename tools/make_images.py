"""Build web images: resize/encode to webp, and synthesise grimy 'before' versions
of each case-study photo so the before/after slider lines up pixel-for-pixel."""
import random, sys, os
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageChops, ImageOps

SRC = sys.argv[1]
OUT = sys.argv[2]
os.makedirs(OUT, exist_ok=True)


def noise_field(size, scale, seed):
    """Cheap value-noise: random small image upscaled with blur -> soft blotches."""
    rnd = random.Random(seed)
    w, h = size
    sw, sh = max(2, w // scale), max(2, h // scale)
    small = Image.new("L", (sw, sh))
    small.putdata([rnd.randint(0, 255) for _ in range(sw * sh)])
    return small.resize(size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(scale / 3))


def grime(im, seed, *, dull=0.78, film=(120, 104, 70), film_amt=0.32, stains=40,
          stain_col=(70, 55, 30), specks=2600, streaks=0, streak_col=(235, 235, 225),
          floor_dust=0.0, clutter=0, crumbs_col=(60, 45, 30)):
    rnd = random.Random(seed)
    im = im.convert("RGB")
    w, h = im.size

    # 1. Dull, flat, slightly underexposed: what an un-cleaned room photographs like.
    im = ImageEnhance.Color(im).enhance(0.72)
    im = ImageEnhance.Contrast(im).enhance(0.82)
    im = ImageEnhance.Brightness(im).enhance(dull)

    # 2. Uneven yellow-grey film over everything (layered noise as mask).
    n1 = noise_field((w, h), 90, seed)
    n2 = noise_field((w, h), 28, seed + 1)
    mask = ImageChops.multiply(n1, n2).point(lambda v: min(255, int(v * film_amt * 1.6)))
    im = Image.composite(Image.new("RGB", (w, h), film), im, mask)

    # 3. Stains and water marks: soft irregular blobs.
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(stains):
        cx, cy = rnd.uniform(0, w), rnd.uniform(h * 0.25, h)
        r = rnd.uniform(w * 0.008, w * 0.05)
        for k in range(4):
            ox, oy = rnd.uniform(-r, r) * 0.6, rnd.uniform(-r, r) * 0.4
            rr = r * rnd.uniform(0.5, 1.0)
            d.ellipse([cx + ox - rr, cy + oy - rr * 0.6, cx + ox + rr, cy + oy + rr * 0.6],
                      fill=stain_col + (rnd.randint(12, 30),))
        # ring edge of a dried spill
        d.ellipse([cx - r, cy - r * 0.6, cx + r, cy + r * 0.6],
                  outline=stain_col + (rnd.randint(18, 40),), width=max(1, int(r / 14)))
    layer = layer.filter(ImageFilter.GaussianBlur(w / 500))
    im = Image.alpha_composite(im.convert("RGBA"), layer)

    # 4. Limescale / smear streaks (glass, tiles, counters).
    if streaks:
        layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        for _ in range(streaks):
            x, y = rnd.uniform(0, w), rnd.uniform(0, h * 0.8)
            pts = [(x, y)]
            for _ in range(rnd.randint(4, 9)):
                x += rnd.uniform(-w * 0.004, w * 0.004)
                y += rnd.uniform(h * 0.008, h * 0.03)
                pts.append((x, y))
            d.line(pts, fill=streak_col + (rnd.randint(18, 45),), width=rnd.randint(1, 3))
        for _ in range(streaks * 3):  # dried droplets
            x, y, r = rnd.uniform(0, w), rnd.uniform(0, h), rnd.uniform(1.5, w / 220)
            d.ellipse([x - r, y - r, x + r, y + r], outline=streak_col + (rnd.randint(30, 70),), width=1)
        layer = layer.filter(ImageFilter.GaussianBlur(1.6))
        im = Image.alpha_composite(im, layer)

    # 5. Floor dust: a pale haze concentrated low in the frame.
    if floor_dust:
        grad = Image.linear_gradient("L").resize((w, h))
        grad = grad.point(lambda v: int(max(0, v - 120) * 1.9 * floor_dust))
        haze = ImageChops.multiply(grad, noise_field((w, h), 40, seed + 7).point(lambda v: min(255, v * 2)))
        im = Image.composite(Image.new("RGBA", (w, h), (205, 196, 178, 255)), im, haze)

    # 6. Crumbs, dust specks, hair, debris.
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(specks):
        x = rnd.uniform(0, w)
        y = h * (0.35 + 0.65 * (rnd.random() ** 0.6))
        r = rnd.choice([0.5, 0.6, 0.8, 1, 1.2, 1.6]) * w / 1600
        col = crumbs_col if rnd.random() < 0.75 else (200, 190, 170)
        d.ellipse([x - r, y - r, x + r, y + r], fill=col + (rnd.randint(50, 140),))
    for _ in range(specks // 40):  # hairs / fibres
        x, y = rnd.uniform(0, w), rnd.uniform(h * 0.5, h)
        pts = [(x, y)]
        for _ in range(5):
            x += rnd.uniform(-8, 8) * w / 1600
            y += rnd.uniform(-5, 5) * w / 1600
            pts.append((x, y))
        d.line(pts, fill=(40, 32, 25, 150), width=1)
    for _ in range(clutter):  # scraps of paper / wrappers
        x, y = rnd.uniform(0, w), rnd.uniform(h * 0.6, h * 0.98)
        s = rnd.uniform(w * 0.004, w * 0.011)
        ang = rnd.uniform(0, 3.14)
        poly = [(x + s * rnd.uniform(0.6, 1.2) * c, y + s * rnd.uniform(0.3, 0.7) * sgn)
                for c, sgn in [(-1, -1), (1, -1.2), (1.1, 1), (-0.9, 1.1)]]
        col = rnd.choice([(214, 206, 188), (196, 186, 160), (170, 150, 120), (226, 220, 206)])
        d.polygon(poly, fill=col + (150,))
    layer = layer.filter(ImageFilter.GaussianBlur(0.5))
    im = Image.alpha_composite(im, layer)

    # 7. Vignette: grubby rooms feel darker at the edges.
    vig = Image.radial_gradient("L").resize((w, h)).point(lambda v: int(max(0, v - 110) * 0.9))
    im = Image.composite(Image.new("RGBA", (w, h), (30, 24, 16, 255)), im, vig)
    return im.convert("RGB")


def save(im, name, width, q=80):
    im = im.convert("RGB")
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name + ".webp"), "WEBP", quality=q, method=6)
    return im.size


def load(name):
    return Image.open(os.path.join(SRC, name + ".jpg"))


def crop_ratio(im, ratio, anchor_y=0.5):
    w, h = im.size
    nh = round(w / ratio)
    if nh <= h:
        top = round((h - nh) * anchor_y)
        return im.crop((0, top, w, top + nh))
    nw = round(h * ratio)
    left = (w - nw) // 2
    return im.crop((left, 0, left + nw, h))


sizes = {}
sizes["hero"] = save(load("hero"), "hero", 1600)
sizes["hero-inset"] = save(crop_ratio(load("hero-inset"), 4 / 5), "hero-inset", 640)
for s in ["svc-party", "svc-bedroom", "svc-kitchen"]:
    sizes[s] = save(crop_ratio(load(s), 4 / 3), s, 800)

cases = {
    "kitchen": dict(stains=60, stain_col=(85, 60, 20), specks=1400, streaks=30,
                    streak_col=(170, 150, 110), film=(130, 110, 60), film_amt=0.34),
    "bathroom": dict(stains=45, stain_col=(60, 70, 50), specks=600, streaks=110,
                     streak_col=(240, 240, 228), film=(150, 140, 100), film_amt=0.3),
    "living": dict(stains=30, specks=1600, floor_dust=0.5, film_amt=0.26),
    "reno": dict(stains=20, stain_col=(150, 140, 125), specks=2400, crumbs_col=(150, 140, 125),
                 floor_dust=0.9, film=(190, 182, 166), film_amt=0.48, dull=0.86, ),
}
for i, (k, opts) in enumerate(cases.items()):
    im = crop_ratio(load("case-" + k), 3 / 2)
    sizes["case-" + k] = save(im, f"case-{k}-after", 1400)
    save(grime(im, seed=100 + i, **opts), f"case-{k}-before", 1400, q=78)

for k, v in sizes.items():
    print(k, v)
