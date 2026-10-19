# Maison Clair: Brand & Visual Guidelines

> **Your home, reset.** Calm, meticulous, quietly luxurious.

This document defines the visual system for the Maison Clair landing page. Every value mentioned here exists as a custom property in [`/css/tokens.css`](../css/tokens.css). **Never hard-code a hex, size, duration or shadow in component CSS; reference the token.** If a value you need is missing, add a token first.

Scope: visual language only. Page structure (UX) and copy are owned elsewhere; examples of copy below are placeholders.

---

## 1. Brand essence

| | |
|---|---|
| **Personality** | Calm · Meticulous · Warm · Discreet · Assured |
| **Feels like** | A freshly made bed in morning light; a well-run small hotel; a tailor's shop, not a showroom |
| **Does not feel like** | Bubbles, sparkles, spray bottles, aqua gradients, "SaaS purple", stock smiles in yellow gloves |
| **Visual idea** | *The reset.* Every motif is one gesture of a cloth across a surface: a single confident stroke that leaves things clearer than before. |

Design rules of thumb:

1. **Quiet first, one loud note.** Most of the page is linen, ink and forest. Citron appears roughly once per viewport, never as a background for long text on light surfaces.
2. **Editorial, not app-like.** Generous whitespace, big serif headlines, asymmetric image placement, hairline rules instead of boxes.
3. **Precision shows care.** Aligned baselines, consistent 4px spacing, crisp 1px hairlines. The craft *is* the message.

---

## 2. Logo

### 2.1 Wordmark

- Text: **Maison *Clair***, with "Maison" upright and "Clair" in italic.
- Family: `var(--font-display)` (Fraunces).
- Upright: weight 400, `font-variation-settings: "opsz" 144, "SOFT" 50, "WONK" 0`.
- Italic "Clair": weight 400, `font-variation-settings: "opsz" 144, "SOFT" 100, "WONK" 1`.
- Letter-spacing: `var(--ls-heading)` (-0.015em). One normal word-space between words.
- Colour: `--color-ink` on light, `--color-dark-ink` on dark. The wordmark never uses citron.
- Header size: `var(--fs-lg)`. Footer size: `var(--fs-2xl)`.
- Lockup: monogram + wordmark. The mark's height equals the wordmark's cap height × 1.6, with a gap of `var(--space-3)` and both elements vertically centred.
- Clear space: at least the height of the "M" on every side.
- Minimum size: 96px wide for the wordmark and 20px for the monogram. Below 32px, use the single-colour monogram with no swash.

```html
<a class="logo" href="/" aria-label="Maison Clair, home">
  <!-- monogram svg (2.2) -->
  <span class="logo__word">Maison <em>Clair</em></span>
</a>
```

### 2.2 Monogram: "the double arch"

A lowercase **m** drawn as two arched windows, which reads as both *Maison* (house) and a doorway. The citron swash under it is the cloth stroke, the *Clair* (light, clear). It is built from three paths and uses no font.

**Primary (on light):**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="40" height="40" role="img" aria-label="Maison Clair">
  <path d="M11 32V18a6.5 6.5 0 0 1 13 0v14M24 18a6.5 6.5 0 0 1 13 0v14"
        fill="none" stroke="#23392E" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M9.5 37.5c6.2-1.9 12.8-2.4 19.2-1.5 3.9.6 6.9 1 9.8.6"
        fill="none" stroke="#D4E05B" stroke-width="2.75" stroke-linecap="round"/>
</svg>
```

**Tile / favicon / app icon (on forest):**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="10" fill="#23392E"/>
  <path d="M11 32V18a6.5 6.5 0 0 1 13 0v14M24 18a6.5 6.5 0 0 1 13 0v14"
        fill="none" stroke="#F4EFE6" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M9.5 37.5c6.2-1.9 12.8-2.4 19.2-1.5 3.9.6 6.9 1 9.8.6"
        fill="none" stroke="#D4E05B" stroke-width="2.75" stroke-linecap="round"/>
</svg>
```

**Single colour (small sizes, print, inline in the page):** use `stroke="currentColor"` on both paths, or omit the swash below 32px.

Inline in the page, prefer `stroke="var(--color-primary)"` / `stroke="var(--color-accent)"` through CSS (`.logo path:first-child { stroke: var(--color-primary) }`), so it follows tokens and the dark-section remap. The hex values in the files above are only for standalone `.svg` and `favicon.svg` files.

Don't: rotate the mark, fill the arches, add a sparkle, put the swash above the arches, or set the mark on a photo without a solid tile.

---

## 3. Colour

### 3.1 Palette

| Swatch | Token | Hex | Name | Role |
|---|---|---|---|---|
| ![](https://placehold.co/24x24/F4EFE6/F4EFE6) | `--color-bg` | `#F4EFE6` | Linen | Page background |
| ![](https://placehold.co/24x24/FBF8F3/FBF8F3) | `--color-surface` | `#FBF8F3` | Paper | Cards, inputs, popovers, calendar |
| ![](https://placehold.co/24x24/EBE4D7/EBE4D7) | `--color-surface-2` | `#EBE4D7` | Oat | Sunken panels, alternate sections, hover fills |
| ![](https://placehold.co/24x24/1D2420/1D2420) | `--color-ink` | `#1D2420` | Ink | Headings, body text |
| ![](https://placehold.co/24x24/5A605A/5A605A) | `--color-muted` | `#5A605A` | Sage grey | Secondary text, captions, placeholders |
| ![](https://placehold.co/24x24/DDD5C7/DDD5C7) | `--color-line` | `#DDD5C7` | Hairline | Decorative dividers, card borders |
| ![](https://placehold.co/24x24/8C8475/8C8475) | `--color-line-strong` | `#8C8475` | Taupe | Input and control outlines (meets 3:1) |
| ![](https://placehold.co/24x24/23392E/23392E) | `--color-primary` | `#23392E` | Forest | Primary buttons, selected states, links |
| ![](https://placehold.co/24x24/1A2C23/1A2C23) | `--color-primary-hover` | `#1A2C23` | Deep forest | Hover/active on primary |
| ![](https://placehold.co/24x24/F4EFE6/F4EFE6) | `--color-primary-ink` | `#F4EFE6` | Linen | Text on primary |
| ![](https://placehold.co/24x24/DDE4D9/DDE4D9) | `--color-primary-soft` | `#DDE4D9` | Lichen | Soft selected / "today" fill, info chips |
| ![](https://placehold.co/24x24/D4E05B/D4E05B) | `--color-accent` | `#D4E05B` | Citron | Swash, wipe band, single key highlight, CTA on dark |
| ![](https://placehold.co/24x24/C5D246/C5D246) | `--color-accent-hover` | `#C5D246` | | Hover on citron fills |
| ![](https://placehold.co/24x24/1D2420/1D2420) | `--color-accent-ink` | `#1D2420` | Ink | Text on citron |
| ![](https://placehold.co/24x24/2E6B45/2E6B45) | `--color-success` / `-soft` | `#2E6B45` / `#DCEBDD` | | Confirmations, "available" |
| ![](https://placehold.co/24x24/8A5A0E/8A5A0E) | `--color-warning` / `-soft` | `#8A5A0E` / `#F3E3C3` | | "Few slots left" |
| ![](https://placehold.co/24x24/A3392B/A3392B) | `--color-danger` / `-soft` | `#A3392B` / `#F5DDD7` | | Errors, destructive |
| ![](https://placehold.co/24x24/23392E/23392E) | `--color-focus` | `#23392E` | Forest | Focus ring on light |
| ![](https://placehold.co/24x24/9A9488/9A9488) | `--color-disabled` | `#9A9488` | | Disabled text and icons only |

**Why this palette.** Cleaning brands reach for aqua and bubbles to signal "fresh". We signal the *result* instead: the warm, settled calm of a home that is already in order. Linen and oat read as natural fibre and morning light. Forest is deep, botanical and trustworthy without feeling corporate navy, and it sits well beside wood floors and plants in photography. Citron is the one fresh note: crisp and slightly acidic, like lemon on a clean counter. Because it appears so rarely, it marks the moment of "reset" (the wipe, the swash, the CTA on dark). Terracotta was considered and rejected because it pulls the palette toward "cosy café" and loses the crispness.

**Proportions (per viewport):** about 70% linen/paper/oat, 20% ink and forest (type, one dark section), at most 5% citron, and the rest imagery.

### 3.2 Dark section variant

Use the dark variant for **at most two** sections: the booking area and the footer. Implement it by remapping the semantic tokens on the section, so components inside need no dark-specific CSS:

```css
.section--dark {
  --color-bg: var(--color-dark-bg);
  --color-surface: var(--color-dark-surface);
  --color-surface-2: var(--color-dark-bg);
  --color-ink: var(--color-dark-ink);
  --color-muted: var(--color-dark-muted);
  --color-line: var(--color-dark-line);
  --color-line-strong: var(--color-dark-line-strong);
  --color-primary: var(--color-dark-primary);          /* citron becomes the action colour */
  --color-primary-hover: var(--color-dark-primary-hover);
  --color-primary-ink: var(--color-dark-primary-ink);
  --color-primary-soft: var(--color-dark-line);
  --color-focus: var(--color-dark-focus);
  --shadow-lg: var(--shadow-dark-lg);
  --grain-opacity: var(--grain-opacity-dark);
  background: var(--color-bg);
  color: var(--color-ink);
}
```

| Token | Hex | Role |
|---|---|---|
| `--color-dark-bg` | `#1B2A22` | Section background |
| `--color-dark-surface` | `#243429` | Cards and calendar on dark |
| `--color-dark-ink` | `#F1ECE2` | Text |
| `--color-dark-muted` | `#AEB7AD` | Secondary text |
| `--color-dark-line` | `#3A4B40` | Hairlines |
| `--color-dark-line-strong` | `#6F8074` | Control outlines |
| `--color-dark-primary` | `#D4E05B` | Primary action (citron), focus |
| `--color-dark-primary-ink` | `#1D2420` | Text on citron |

Feedback colours (success, warning, danger) are tuned for light surfaces. Inside a dark section, put messages in a `--color-surface` card that keeps light values (wrap it in a class that resets the light tokens), or show them as text in `--color-dark-ink` with an icon.

### 3.3 Usage rules

- Body text is always `--color-ink`. `--color-muted` is for supporting text 14px and up.
- **Citron on light backgrounds is never text and never a text background for more than one or two words.** It is decorative there (1.25:1 on linen). Use it for the swash, the wipe band and small dots. On dark it is a full action colour.
- Links: `--color-primary` with a 1px underline at `text-underline-offset: 0.2em`. On hover, thicken to 2px (`text-decoration-thickness`).
- `::selection { background: var(--color-selection); color: var(--color-accent-ink); }`
- Never put white (`#FFF`) on the page. Paper (`--color-surface`) is the lightest value.

### 3.4 Verified contrast pairs (WCAG 2.x)

Ratios were computed with the WCAG relative-luminance formula (node script). AA requires 4.5:1 for normal text and 3:1 for large text and UI components or graphical objects.

| Foreground | Background | Ratio | Use | Result |
|---|---|---|---|---|
| ink `#1D2420` | bg `#F4EFE6` | **13.83** | body text | AAA |
| ink | surface `#FBF8F3` | **14.96** | text in cards | AAA |
| ink | surface-2 `#EBE4D7` | **12.53** | text on oat | AAA |
| muted `#5A605A` | bg | **5.63** | secondary text | AA |
| muted | surface | **6.09** | secondary text | AA |
| muted | surface-2 | **5.10** | secondary text | AA |
| primary `#23392E` | bg | **10.81** | links, outlined buttons | AAA |
| primary | surface | **11.69** | links in cards | AAA |
| primary-ink `#F4EFE6` | primary | **10.81** | primary button | AAA |
| primary-ink | primary-hover `#1A2C23` | **12.84** | button hover | AAA |
| ink | primary-soft `#DDE4D9` | **12.20** | soft-selected chip | AAA |
| primary | primary-soft | **9.54** | today cell | AAA |
| accent-ink `#1D2420` | accent `#D4E05B` | **11.02** | citron button/badge | AAA |
| accent-ink | accent-hover `#C5D246` | **9.57** | citron hover | AAA |
| primary | accent | **8.62** | forest on citron | AAA |
| success `#2E6B45` | bg / success-soft | **5.55 / 5.13** | status text | AA |
| warning `#8A5A0E` | bg / warning-soft | **5.17 / 4.67** | status text | AA |
| danger `#A3392B` | bg / surface / danger-soft | **5.77 / 6.24 / 5.10** | errors | AA |
| line-strong `#8C8475` | bg / surface | **3.23 / 3.49** | input borders (non-text) | AA (3:1) |
| focus `#23392E` | bg / surface | **10.81 / 11.69** | focus ring | AA (3:1) |
| dark-ink `#F1ECE2` | dark-bg `#1B2A22` | **12.73** | text on dark | AAA |
| dark-ink | dark-surface `#243429` | **11.16** | text in dark cards | AAA |
| dark-muted `#AEB7AD` | dark-bg / dark-surface | **7.26 / 6.37** | secondary on dark | AAA / AA |
| accent `#D4E05B` | dark-bg / dark-surface | **10.43 / 9.14** | CTA, focus on dark | AAA |
| dark-line-strong `#6F8074` | dark-bg | **3.58** | control outlines on dark | AA (3:1) |
| *Decorative only:* line / bg | | 1.27 | hairlines | n/a |
| *Decorative only:* accent / bg | | 1.25 | swash, wipe band | n/a, never text |
| *Disabled:* disabled / bg | | 2.63 | disabled controls | exempt |

---

## 4. Typography

### 4.1 Families

| Role | Family (Google Fonts name) | Why |
|---|---|---|
| Display | **Fraunces**, variable: axes `opsz` 9–144, `wght` 300–600, `SOFT` 0–100, `WONK` 0–1 | An "Old Style soft" serif with real character. The `SOFT` axis rounds the terminals, which is literally a softened, polished letterform, and the `WONK` italic gives the emphasised word a hand-touched flair. At high optical size it looks expensive and editorial. |
| UI / body | **Instrument Sans**, variable: axes `wght` 400–700, `wdth` 75–100 | A clean, slightly condensed grotesque with crisp, contemporary details. Calm at body sizes, and the `wdth` axis gives tidy condensed labels for calendar cells and chips. It is less ubiquitous than Inter. |

### 4.2 Files to self-host (3 woff2 files, Latin subset)

Fetch the CSS with a modern browser user agent, then download the `/* latin */` `src` URL for each face:

```
https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0..100,0..1;1,9..144,300..600,0..100,0..1&family=Instrument+Sans:wdth,wght@75..100,400..700&display=swap
```

| Save as | Face | Range |
|---|---|---|
| `/fonts/fraunces-var-latin.woff2` | Fraunces, normal | wght 300–600, opsz/SOFT/WONK |
| `/fonts/fraunces-italic-var-latin.woff2` | Fraunces, italic | wght 300–600, opsz/SOFT/WONK |
| `/fonts/instrument-sans-var-latin.woff2` | Instrument Sans, normal | wght 400–700, wdth 75–100 |

(The latin URLs as of Oct 2026 were `fonts.gstatic.com/s/fraunces/v38/6NUV8FyLNQOQZAnv9ZwIlOk.woff2`, `.../fraunces/v38/6NUT8FyLNQOQZAnv9ZwNpOskzA.woff2` and `.../instrumentsans/v4/pxicypc9vsFDm051Uf6KVwgkfoSbT2lB.woff2`. Re-fetch the CSS if they 404.) An optional fourth file, Instrument Sans Italic, is **not needed**. Use the Fraunces italic for any emphasis.

```css
@font-face {
  font-family: "Fraunces";
  src: url("/fonts/fraunces-var-latin.woff2") format("woff2");
  font-weight: 300 600; font-style: normal; font-display: swap;
}
@font-face {
  font-family: "Fraunces";
  src: url("/fonts/fraunces-italic-var-latin.woff2") format("woff2");
  font-weight: 300 600; font-style: italic; font-display: swap;
}
@font-face {
  font-family: "Instrument Sans";
  src: url("/fonts/instrument-sans-var-latin.woff2") format("woff2");
  font-weight: 400 700; font-stretch: 75% 100%; font-style: normal; font-display: swap;
}
```

Preload the two faces used above the fold: Fraunces normal and Instrument Sans.

### 4.3 Fluid type scale (360px → 1280px)

| Token | Min → Max | Family / weight | Line height | Typical use |
|---|---|---|---|---|
| `--fs-display` | 42 → 96px | Fraunces 340, opsz auto | `--lh-tight` | Hero headline only |
| `--fs-3xl` | 34 → 58px | Fraunces 400 | `--lh-snug` | Section titles (h2) |
| `--fs-2xl` | 28 → 42px | Fraunces 400 | `--lh-snug` | Large pull quotes, booking title, footer wordmark |
| `--fs-xl` | 24 → 32px | Fraunces 400 | `--lh-snug` | h3, price figures |
| `--fs-lg` | 20 → 25px | Fraunces 400 or Sans 500 | `--lh-heading` | Card titles, header wordmark |
| `--fs-md` | 18 → 20.5px | Sans 400 | `--lh-body` | Lead paragraphs, testimonials body |
| `--fs-base` | 16 → 17.5px | Sans 400 | `--lh-body` | Body |
| `--fs-sm` | 14 → 15px | Sans 500 | `--lh-ui` | Buttons, chips, labels, form text |
| `--fs-xs` | 12.5 → 13px | Sans 600, uppercase, `--ls-eyebrow` | `--lh-ui` | Eyebrows, calendar weekday headers, legal |

### 4.4 Rules

- **Headlines** use Fraunces with `font-optical-sizing: auto`, `font-variation-settings: var(--font-display-variation)`, `letter-spacing: var(--ls-display)` (display) or `var(--ls-heading)` (h2–h4). Keep `text-wrap: balance` on all headings.
- **The one italic word.** Each major headline may italicise *one* word (`<em>`) with `font-variation-settings: var(--font-display-variation-italic)`. That word is the candidate for the swash underline (motif 3). Example: "Your home, *reset*."
- **Eyebrows** sit above section titles: `--fs-xs`, Instrument Sans 600, uppercase, `--ls-eyebrow`, `--color-muted`, preceded by a 24px hairline (`--color-line-strong`).
- **Numerals.** Step and process numbers use Fraunces italic at `--fs-xl` with `font-variant-numeric: oldstyle-nums`, for example *01*, *02*, *03*. Prices and times use Instrument Sans with `font-variant-numeric: tabular-nums lining-nums`.
- **Body** text measures at most `--measure` (62ch). Paragraph spacing is `--space-4`.
- **Condensed labels.** Calendar cells and time chips may use `font-stretch: 87.5%` for tidier rows.
- **Weights.** Don't use bold Fraunces above 560. Luxury comes from size and space, not weight.

---

## 5. Spacing & layout

**Scale (4px base):** `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32 · `--space-7` 48 · `--space-8` 64 · `--space-9` 96 · `--space-10` 128.
Section vertical padding: `--space-section` (fluid, 64 → 144px).

- Containers: `--container` (1200) by default, `--container-narrow` (720) for FAQ and booking forms, `--container-wide` (1360) for the hero and before/after.
- Side padding: `--gutter` (16 → 40px fluid), with no horizontal overflow at 360px.
- Grid: 12 columns with `--space-5` gaps on desktop and 4 columns with `--space-4` gaps on mobile. Prefer **asymmetric splits** (5/7, 7/5) for editorial feel, and offset images by one column so they don't align with the text.
- Header: `--header-height` (72px), dropping to `--header-height-compact` (60px) on mobile and on scroll. Set `scroll-padding-top: var(--header-height)` on `html`.
- Minimum touch target: `--tap-target` (44px).

---

## 6. Radius & borders: "tailored"

**Decision: crisp containers, soft interactions, arched images.**

- Containers such as cards, inputs and calendar cells are nearly sharp (`--radius-sm` 4px, `--radius-md` 8px). This reads as precise and tailored, like folded linen with pressed edges, and is the opposite of the bubbly, over-rounded look of typical cleaning sites.
- Interactive pills (buttons, chips, the slider handle) use `--radius-pill`. The curve tells the user "this moves" and visually echoes the arch.
- Images use the arch (`--radius-arch`) or `--radius-lg`, never a mix within one section.

| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 2px | Tiny indicators, the tab underline |
| `--radius-sm` | 4px | Inputs, calendar cells, checkboxes, tooltips |
| `--radius-md` | 8px | Cards, panels, booking summary |
| `--radius-lg` | 16px | Large media, dialogs, before/after frame |
| `--radius-pill` | 999px | Buttons, chips, time slots, stepper pills, slider handle |
| `--radius-arch` | 999px 999px 4px 4px | Arched image windows |

**Borders.** `--border-hairline` (1px `--color-line`) for decorative structure such as dividers, card outlines and table rules. `--border-control` (1px `--color-line-strong`) for anything the user operates. `--border-width-strong` (1.5px) for selected outlines. Prefer hairlines and whitespace over shadows.

---

## 7. Elevation

Shadows are warm (ink-tinted, never pure black), low and diffuse. Most surfaces sit flat with a hairline.

| Token | Use |
|---|---|
| `--shadow-sm` | Resting cards that need lift from oat; input focus (with ring) |
| `--shadow-md` | Card hover, dropdowns, sticky booking summary, slider handle |
| `--shadow-lg` | Dialogs, the floating booking panel, hero image card |
| `--shadow-inset` | Pressed buttons, the slider track |
| `--shadow-dark-lg` | Elevation inside dark sections |

---

## 8. Signature motifs

### Motif 1: The Wipe (cloth-stroke reveal)

A slanted citron band sweeps across an image or headline block left to right. The content is revealed just behind it, as if a cloth stroke cleaned the glass. Use it on the hero image, the before/after frame on first view, and at most two other images. Never use it on text paragraphs.

```css
.wipe { position: relative; overflow: hidden; isolation: isolate; }
.wipe > img { clip-path: inset(0 100% 0 0); }
.wipe::after {                         /* the cloth */
  content: ""; position: absolute; inset: -10% -20%;
  background: var(--color-accent);
  transform: translateX(-110%) skewX(var(--wipe-skew));
  z-index: var(--z-raised); pointer-events: none;
}
.wipe.is-in > img {
  clip-path: inset(0 0 0 0);
  transition: clip-path var(--dur-wipe) var(--ease-wipe) calc(var(--dur-wipe) * 0.18);
}
.wipe.is-in::after {
  transform: translateX(110%) skewX(var(--wipe-skew));
  transition: transform var(--dur-wipe) var(--ease-wipe);
}
@media (prefers-reduced-motion: reduce) {
  .wipe > img { clip-path: none; }
  .wipe::after { display: none; }
}
```

Toggle `.is-in` with an IntersectionObserver (threshold 0.35, once). Without JS, images must be visible: set the initial clip only under `.js .wipe`.

### Motif 2: The Arch Window

Hero and feature photos sit in arched frames, like the double arch of the monogram and a doorway into a calm home.

```css
.arch { border-radius: var(--radius-arch); overflow: hidden; aspect-ratio: 4 / 5; }
.arch > img { width: 100%; height: 100%; object-fit: cover; }
```

- A precise, resolution-independent version for non-rectangular parents uses an SVG `clipPath` with `clipPathUnits="objectBoundingBox"`: `M0,1 V0.4 A0.5,0.4 0 0 1 1,0.4 V1 Z`.
- **Double-arch pairing:** two arched images side by side, the second smaller and offset down by `--space-8`, echoing the monogram's "m".
- A 1px `--color-line-strong` outline arch, offset `--space-3` behind the image (absolutely positioned pseudo-element, same radius), adds a drafted, architectural detail. Use it on the hero only.

### Motif 3: The Swash (hand-drawn underline)

One citron stroke under the single italic word in the hero headline (and optionally one more section title). It draws in left to right once on load.

Inline SVG (preferred, animatable):

```html
<span class="swash">reset<svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
  <path d="M3 11.5C40 5.6 92 3.4 140 5.5c20 .9 38 2.6 57 5.2" pathLength="1"/></svg></span>
```

```css
.swash { position: relative; white-space: nowrap; }
.swash svg {
  position: absolute; left: -2%; width: 104%; bottom: -0.08em; height: 0.28em;
  overflow: visible; z-index: var(--z-below);
}
.swash path {
  fill: none; stroke: var(--color-accent); stroke-width: 5; stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: swash-draw var(--dur-draw) var(--ease-out) 400ms forwards;
}
@keyframes swash-draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .swash path { animation: none; stroke-dashoffset: 0; } }
```

When the stroke is non-scaling, scale the stroke width with the type size, for example `stroke-width: max(4px, 0.07em)` set on the svg via `font-size: inherit`. A static alternative is `--motif-swash` as `mask-image` on a `::after` with `background: var(--color-accent)`. The stroke sits **behind** the text (`z-index: var(--z-below)` inside an `isolation: isolate` heading) so descenders stay legible. On dark sections it stays citron.

### Motif 4: Linen Grain

A barely-there fractal-noise grain over the whole page gives the flat linen a woven, tactile, printed-paper quality and keeps large colour fields from looking digital.

```css
body::before {
  content: ""; position: fixed; inset: 0; pointer-events: none;
  background-image: var(--texture-grain); background-size: 180px;
  opacity: var(--grain-opacity); mix-blend-mode: multiply;
  z-index: var(--z-grain);
}
.section--dark { position: relative; }
.section--dark::before {                  /* dark sections get their own, lighter-blend grain */
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: var(--texture-grain); background-size: 180px;
  opacity: var(--grain-opacity); mix-blend-mode: soft-light;
}
```

The same grain applies to photos (§9) so imagery and the page feel printed on the same stock. Keep opacity at or below 0.08 on light. If it is visible at first glance, it is too strong.

**Supporting detail: the crease rule.** Section dividers are a 1px `--color-line` hairline running the container width, with a 6px citron dot centred on it (`background: radial-gradient(circle, var(--color-accent) 3px, transparent 3.5px) center / 12px 12px no-repeat, linear-gradient(var(--color-line), var(--color-line)) center / 100% 1px no-repeat; height: 12px;`). Use it between light sections that share a background.

---

## 9. Imagery & iconography

### Photography

- **Light:** bright, natural, side-lit daylight from windows. Morning, never flash. Highlights are soft, not blown out.
- **Subjects:** real, lived-in homes, not show homes. Made beds, a folded throw, sunlight on oak floors, a clear kitchen counter with one lemon and a linen cloth, plants, ceramics. The vibe is calm after the clean.
- **People:** show hands and partial figures at work (folding, smoothing, wiping) rather than posed faces. When staff appear, use neutral uniforms (forest or oat aprons), relaxed and unposed. No yellow gloves and no spray-bottle hero shots.
- **Colour grade:** warm white balance (about 5200K), slightly lifted blacks, muted saturation (−10 to −15), greens pushed toward forest, no teal-orange grade.
- **Composition:** generous negative space for asymmetric layouts, 4:5 portrait for arches, 3:2 for wide.
- **Hero:** one arched 4:5 portrait of a sunlit, reset room, plus an optional smaller second arch (a detail shot such as folded towels) offset below.

### Before / after

- The two shots must match exactly: same tripod position, focal length, light and grade. Only the mess changes.
- "Before" is believable clutter (dishes, unmade bed, dust on a shelf), not squalor.
- Labels are small pills in the top corners: "Before" in `--color-surface` with ink text, "After" in `--color-accent` with `--color-accent-ink` text.

### Image treatment

- Radius: `--radius-arch` for portrait features, `--radius-lg` for landscape and before/after.
- Linen wash: an overlay of `--color-image-tint` and the grain at 0.05 opacity (`mix-blend-mode: multiply`) unifies all photos with the page.
- Text over an image: only with a `--color-scrim` gradient from the bottom (`linear-gradient(to top, var(--color-scrim), transparent 60%)`).
- Always set width and height or `aspect-ratio`, use `loading="lazy"` below the fold, and AVIF or WebP with JPEG fallback.

### Icons

- Line icons on a 24px grid with a **1.5px stroke** (`--icon-stroke`), round caps and joins, no fills, `stroke="currentColor"`.
- Recommended source: **Lucide** (ISC licence) with `stroke-width="1.5"`, or **Phosphor Light**. Don't mix sets.
- Size: 20px inline with `--fs-sm` text and 24px standalone. Feature icons are 32px, inside a 56px `--color-primary-soft` circle (or `--color-dark-line` on dark).
- Subjects are domestic and calm: leaf, bed, sun, shield-check, calendar, key, clock, sofa. Avoid sparkles, bubbles and spray bottles.

---

## 10. Components

All transitions use `var(--dur-fast) var(--ease-out)` unless noted. The focus style is global:

```css
:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus);
  outline-offset: var(--focus-ring-offset);
}
```

### Buttons

Shared styles: `font: var(--fw-medium) var(--fs-sm)/var(--lh-ui) var(--font-sans)`, `letter-spacing: var(--ls-ui)`, `min-height: var(--tap-target)`, padding `--space-3` × `--space-5`, `border-radius: var(--radius-pill)`, and an optional trailing arrow icon that nudges 3px right on hover.

| Variant | Default | Hover | Active | Disabled |
|---|---|---|---|---|
| **Primary** | bg `--color-primary`, text `--color-primary-ink` | bg `--color-primary-hover`, `--shadow-md`, `translateY(-1px)` | `translateY(0)`, `--shadow-inset`, `--dur-instant` | bg `--color-surface-2`, text `--color-disabled`, no shadow, `cursor: not-allowed` |
| **Secondary** | transparent, 1px `--color-primary` border, text `--color-primary` | bg `--color-primary-soft` | `--shadow-inset` | border `--color-line`, text `--color-disabled` |
| **Ghost / link** | text `--color-primary`, underline at offset 0.2em | underline thickens to 2px | text `--color-primary-hover` | text `--color-disabled` |
| **Accent** (one per page, e.g. the hero CTA *or* the booking CTA on dark) | bg `--color-accent`, text `--color-accent-ink` | bg `--color-accent-hover` | `--shadow-inset` | as primary |

On dark sections, Primary automatically becomes citron through the token remap. Large CTA variant: padding `--space-4` × `--space-6`, `--fs-base`.

### Chips (filters, add-ons)

- Pill, `min-height: 36px` (with a 44px hit area through padding or a pseudo-element), padding `--space-2` × `--space-4`, `--fs-sm`, border `--border-control`, bg `--color-surface`.
- Hover: bg `--color-surface-2`.
- Selected (`aria-pressed="true"` or checked): bg `--color-primary`, text `--color-primary-ink`, and a leading 16px check icon (the chip widens, `--dur-base`).
- Info or status chips are non-interactive: no border, bg `--color-primary-soft` or the feedback soft colours, `--fs-xs`.

### Cards

- bg `--color-surface`, `--border-hairline`, `--radius-md`, padding `--space-6` (or `--space-5` on mobile), no shadow at rest.
- Interactive cards (service tiers) on hover: `--shadow-md`, border `--color-line-strong`, and the image inside scales 1.03 over `--dur-slow`.
- Featured or recommended tier: 1.5px `--color-primary` border plus a citron "Most booked" pill overlapping the top edge.
- Price: Fraunces `--fs-xl` with tabular nums. Unit text: `--fs-sm` muted.

### Form inputs

- Height 48px, padding `0 var(--space-4)`, bg `--color-surface`, `--border-control`, `--radius-sm`, `--fs-base` (never under 16px, which avoids iOS zoom).
- Label sits above in `--fs-sm` weight 500 `--color-ink` with a `--space-2` gap. Help text is `--fs-xs` muted. Placeholder is `--color-muted`.
- Hover: border `--color-ink`.
- Focus: border `--color-primary`, `box-shadow: 0 0 0 3px var(--color-primary-soft)`, plus the global ring for keyboard users.
- Error: border `--color-danger`, bg stays surface, an error message below in `--color-danger` `--fs-sm` with an alert icon, and `aria-invalid="true"`.
- Disabled: bg `--color-surface-2`, text `--color-disabled`.
- Checkbox and radio: 20px, `accent-color: var(--color-primary)`.

### Calendar (booking)

The grid is 7 columns, gap `--space-1`, and weekday headers are `--fs-xs` uppercase muted. Cells are square (`aspect-ratio: 1`), at least 44px, `--radius-sm`, with the numeral in Instrument Sans `--fs-sm` 500 using `tabular-nums`.

| State | Style |
|---|---|
| **Default (available)** | bg `--color-surface`, text `--color-ink`, `--border-hairline` |
| **Hover** | bg `--color-surface-2`, border `--color-line-strong` |
| **Today** | 1.5px inset ring `--color-primary` (`box-shadow: inset 0 0 0 1.5px var(--color-primary)`), and a 4px `--color-primary` dot under the numeral |
| **Selected** | bg `--color-primary`, text `--color-primary-ink`, weight 600. On dark: citron with ink text |
| **Few slots left** | default, plus a 4px `--color-warning` dot (with an `aria-label` suffix ", few slots left") |
| **Fully booked** | bg `--color-surface-2`, text `--color-disabled` with `line-through`, a diagonal hatch `repeating-linear-gradient(135deg, var(--color-line) 0 1px, transparent 1px 6px)`, `aria-disabled="true"`, focusable but not selectable, and a tooltip saying "Fully booked" |
| **Disabled (past or out of range)** | transparent bg, no border, text `--color-disabled`, `cursor: default` |
| **Focus** | global ring, offset 2px |

Month navigation uses 40px circular ghost icon buttons (chevrons) beside the month name in Fraunces `--fs-lg`.

### Time-slot chips

- 3-column grid (2 on narrow screens), gap `--space-2`. Each slot is a pill, height 44px, centred, `--fs-sm` `tabular-nums`, `font-stretch: 87.5%`, `--border-control`, bg `--color-surface`.
- Hover: bg `--color-surface-2`. Selected: bg `--color-primary`, text `--color-primary-ink`, with a check icon replacing the leading clock. Unavailable: dashed `--color-line` border, `--color-disabled` text, line-through.
- Optional part-of-day group labels ("Morning", "Afternoon") in eyebrow style.

### Stepper (booking progress)

- A horizontal row of steps joined by a 1px `--color-line` rail. Each step is a 28px circle and a label (`--fs-xs` uppercase, `--ls-eyebrow`).
- Upcoming: circle with `--border-control`, muted Fraunces italic numeral.
- Current: circle filled `--color-primary` with the numeral in `--color-primary-ink`, and the label in `--color-ink` 600.
- Complete: circle filled `--color-primary-soft` with a forest check icon. The rail segment before it becomes 2px `--color-primary`, animating `scaleX` 0 → 1 from the left over `--dur-slow` `--ease-out`.
- Mobile: collapse to "Step 2 of 4 · Details" with a 2px progress bar.
- Use `aria-current="step"` on the current item.

### Tabs (e.g. service types, room sizes)

- Text tabs in `--fs-sm` 500 muted, padding `--space-3` × `--space-4`, sitting on a full-width `--border-hairline` baseline.
- Hover: text `--color-ink`.
- Selected: text `--color-ink`, with a 2px `--color-primary` indicator (`--radius-xs`) that **slides** between tabs (transform, `--dur-base` `--ease-in-out`).
- Alternative on light hero areas: segmented pills on a `--color-surface-2` track, with the selected pill in `--color-surface` with `--shadow-sm`.
- Use the full ARIA tabs pattern with arrow-key navigation.

### Before / after slider

- Frame: `--radius-lg`, `overflow: hidden`, `aspect-ratio: 3 / 2` (4:5 on mobile). The "after" image is the base layer, and the "before" image sits on top clipped with `clip-path: inset(0 calc(100% - var(--pos)) 0 0)`. Here `--pos` is a component-local runtime variable (for example `50%`) that JS sets inline from the range input. It is not a design token.
- Divider: a 2px `--color-surface` vertical line with `--shadow-md`.
- **Handle:** a 48px circle, bg `--color-surface`, `--shadow-md`, with two 1.5px chevrons (‹ ›) in `--color-primary`, `z-index: var(--z-raised)`.
  - Hover: scale 1.06, `--shadow-lg`.
  - Active (dragging): bg `--color-accent`, chevrons in `--color-accent-ink`, scale 0.96.
  - Focus: global ring.
- First view plays a hint: the handle eases from 50% to 60%, then back to 50% (`--dur-slow` × 2, `--ease-in-out`), once, and only without reduced motion.
- Accessibility: build it as an `<input type="range">` (0–100) overlaid on the image and visually hidden but focusable. Arrow keys move it 5% per press. Use the label "Reveal before and after".

---

## 11. Motion

**Principle:** motion should feel like a single, unhurried hand: one smooth stroke that settles. Nothing bounces, spins or sparkles.

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 80ms | Press feedback |
| `--dur-fast` | 150ms | Hover colour, borders, focus, icon nudge |
| `--dur-base` | 250ms | Chips selecting, tab indicator, dropdowns, tooltips |
| `--dur-slow` | 450ms | Panels, accordion, stepper rail, booking step changes, card image zoom |
| `--dur-wipe` | 900ms | Motif 1 |
| `--dur-draw` | 1100ms | Motif 3 |
| `--stagger` | 70ms | Between list or card reveals (cap at 6 items) |

| Easing | Curve | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for anything entering or responding |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Position swaps (tab indicator, slider hint) |
| `--ease-wipe` | `cubic-bezier(0.77, 0, 0.175, 1)` | The wipe: slow start, decisive middle, gentle finish |
| `--ease-in` | `cubic-bezier(0.55, 0, 1, 0.45)` | Exits only (dialogs closing) |

**What animates:**

- **On scroll** (once per element): section content fades up 16px (`opacity` + `translateY`) over `--dur-slow` `--ease-out`, staggered. Wipe reveals on up to 3 images.
- **On load:** the hero swash draws in. The hero headline fades up first, then the swash after 400ms.
- **On interaction:** colour and border (`--dur-fast`), button lift (−1px), tab indicator slide, chip check-in, calendar selection fill (`--dur-base`), and booking step crossfade with a 12px horizontal shift (`--dur-slow`).
- **Header:** height and background (linen at 90% with `backdrop-filter: blur(8px)`) transition over `--dur-base` when it compacts on scroll.

**Never animate:** body text letter-by-letter, parallax on more than one layer, autoplaying carousels, layout properties (`width`, `height`, `top`). Animate only `transform`, `opacity` and `clip-path`.

**Reduced motion:** under `@media (prefers-reduced-motion: reduce)`, disable wipe, swash drawing, fade-ups, the slider hint and smooth scrolling. Keep instant state changes and colour transitions up to `--dur-fast`.

---

## 12. Accessibility checklist

- Every text pair comes from §3.4. Citron is never text on light backgrounds.
- A visible focus ring is on every interactive element (forest on light, citron on dark).
- Touch targets are at least 44px. Form inputs use a font size of at least 16px.
- State is never conveyed by colour alone: calendar "few left" uses a dot plus a label, fully booked uses a hatch, line-through and a label, and selected states add a check icon.
- Grain, swash and wipe are decorative (`aria-hidden`, `pointer-events: none`).
- All motion respects `prefers-reduced-motion`.

---

## 13. Token quick reference

| Group | Tokens |
|---|---|
| Colour (light) | `--color-bg` `--color-surface` `--color-surface-2` `--color-ink` `--color-muted` `--color-disabled` `--color-line` `--color-line-strong` `--color-primary` `--color-primary-hover` `--color-primary-ink` `--color-primary-soft` `--color-accent` `--color-accent-hover` `--color-accent-ink` `--color-success(-soft)` `--color-warning(-soft)` `--color-danger(-soft)` `--color-focus` `--color-selection` `--color-image-tint` `--color-scrim` `--color-overlay` |
| Colour (dark) | `--color-dark-bg` `--color-dark-surface` `--color-dark-ink` `--color-dark-muted` `--color-dark-line` `--color-dark-line-strong` `--color-dark-primary(-hover)` `--color-dark-primary-ink` `--color-dark-focus` |
| Type | `--font-display` `--font-sans` `--font-mono` · `--fs-xs` `--fs-sm` `--fs-base` `--fs-md` `--fs-lg` `--fs-xl` `--fs-2xl` `--fs-3xl` `--fs-display` · `--fw-*` · `--lh-*` · `--ls-*` · `--measure(-narrow)` · `--font-display-variation(-italic)` |
| Space | `--space-0` … `--space-10` · `--space-section` |
| Layout | `--container` `--container-narrow` `--container-wide` `--gutter` `--header-height` `--header-height-compact` `--tap-target` |
| Shape | `--radius-xs/sm/md/lg/pill/arch` · `--border-*` · `--focus-ring-width` `--focus-ring-offset` `--icon-stroke` |
| Elevation | `--shadow-sm/md/lg` `--shadow-inset` `--shadow-dark-lg` |
| Motion | `--ease-out` `--ease-in-out` `--ease-wipe` `--ease-in` · `--dur-instant/fast/base/slow/wipe/draw` · `--stagger` |
| Z-index | `--z-below` `--z-base` `--z-raised` `--z-dropdown` `--z-sticky` `--z-header` `--z-overlay` `--z-modal` `--z-toast` `--z-grain` |
| Motifs | `--texture-grain` `--grain-opacity(-dark)` `--motif-swash` `--wipe-skew` |
