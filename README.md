# مكتب الاختيار الأول: landing page

A static landing page for **مكتب الاختيار الأول** (Al-Ikhtiar Al-Awwal), a home-cleaning office in Baghdad. It's written in Iraqi Arabic and laid out right to left. It has before/after case studies and a four-step booking flow with a fake availability calendar. It uses plain HTML, CSS and JavaScript, with no build step and no framework.

**Live site:** https://rafik-bash.github.io/Project-X/ (GitHub Pages, served from the `gh-pages` branch)

## Run it locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

You need a server because the JavaScript uses ES modules, which don't load from `file://`.

## Structure

```
index.html            all page content and copy (Arabic, lang="ar-IQ" dir="rtl")
css/tokens.css        the ONLY place colors, fonts, spacing, radius, motion are defined
css/base.css          @font-face, reset, element defaults
css/layout.css        containers, header, footer, dark-section token remap
css/components.css    buttons, tabs, before/after slider, form controls, calendar
css/sections.css      one-off rules per section, plus the polish layer (top bar, marquee, WhatsApp button)
css/animations.css    all decorative motion, gated behind prefers-reduced-motion
js/main.js            reveals, header, mobile menu, sticky mobile CTA, FAQ hash
js/slider.js          before/after slider + accessible case-study tabs (RTL-aware)
js/booking.js         booking widget: IQD pricing, fake availability, validation, .ics export
docs/                 brand guidelines, UX spec, English copy and Iraqi-Arabic copy (copy-ar.md)
tools/make_images.py  regenerates the web images and the simulated "before" shots
```

- **Brand colors or fonts:** change them in `css/tokens.css` only.
- **Company name:** it appears in `index.html` and as `BRAND` at the top of `js/booking.js`.

## Localization

- **Fonts:**
  - El Messiri for headings
  - Readex Pro for body text
  - Aref Ruqaa, the everyday Iraqi handwriting script, for the one emphasised word per heading and the logo

  All three are self-hosted (SIL OFL).
- **Formats:** dates and numbers use `Intl` with the `ar-IQ` locale. That gives Arabic-Indic digits and the Iraqi month names (تشرين الأول، كانون الثاني …).
- **Week and hours:** the week starts on Saturday. Friday is the day off, and Thursday is a short day.
- **Prices:** in Iraqi dinar. See `SERVICES` / `EXTRAS` in `js/booking.js`.
- **Input:** the phone field accepts Arabic-Indic digits.

## Booking logic

- **Pricing:** the service base, plus a per-bedroom and per-bathroom amount, plus extras. Duration and team size come from the same table.
- **Availability:** deterministic and fake, so the calendar looks the same on every load. Booking runs from tomorrow to 56 days out.
- **Submit:** simulated. You get a reference like `AK-261027-8KPL` and an `.ics` calendar file. An email starting with `fail@` triggers the error state, for testing.
- **Saved progress:** kept in `sessionStorage` and restored on reload.
- **Without JavaScript:** a phone and email fallback is shown in place of the widget.

**To connect a real calendar later**, replace `dayStatus()`, `slotsFor()` and the submit block in the form's `submit` handler with API calls.

## Before launch: placeholders to replace

- [ ] Phone and WhatsApp number `0770 123 4567` (`tel:+9647701234567`, `wa.me/9647701234567`)
- [ ] Email `info@alikhtiar-alawal.example`
- [ ] Rating «٤٫٩», «+١٬٢٠٠ بيت», and the 48-hour guarantee wording
- [ ] All reviews, the hero quote, and the four case studies (names, areas, quotes, stats)
- [ ] Before/after photos. The "before" images are **digitally simulated** from the "after" shots. Replace them with real, matched job photos.
- [ ] Prices, durations, extras and the late-cancel fee (`index.html` + `js/booking.js`)
- [ ] Service area and working hours
- [ ] Footer links (privacy, terms, careers, gift a clean) currently point to `#top`
- [ ] Booking submit (currently simulated, nothing is sent anywhere)

## Deploying

### Vercel (recommended)

The repo is ready for Vercel as-is. It's a static site, so there's no build step. `vercel.json` sets caching headers, and `.vercelignore` keeps `docs/`, `tools/` and the source photos off the live site.

1. Go to https://vercel.com/new and sign in with GitHub.
2. Import `Rafik-bash/Project-X`.
3. Use these settings:
   - Framework Preset: **Other**
   - Build Command: leave empty
   - Output Directory: leave empty (the repo root)
4. Click **Deploy**.

Vercel deploys the repo's default branch (`claude/cleaning-landing-page`), and redeploys on every push.

### GitHub Pages

The `gh-pages` branch holds only the site files. To publish an update:

```sh
git checkout gh-pages
git checkout claude/cleaning-landing-page -- index.html css js assets/favicon.svg assets/fonts assets/img/*.webp
git commit -m "Deploy" && git push origin gh-pages
```

## Credits

- **Photos:** [Unsplash](https://unsplash.com) (Unsplash License). Source photo IDs:
  - hero: `1493809842364-78817add7ffb`
  - window cleaning: `1581578731548-c64695cc6952`
  - bedroom: `1595526114035-0d45ed16cfbf`
  - kitchen: `1600489000022-c2086d79f9d4`
  - vacuum: `1527515637462-cff94eecc1ac`
  - case kitchen: `1507089947368-19c1da9775ae`
  - case bathroom: `1584622650111-993a426fbf0a`
  - case living room: `1560448204-e02f11c3d0e2`
  - case renovation: `1560185007-cde436f6a4d0`
- **Fonts:** El Messiri, Readex Pro and Aref Ruqaa via Fontsource (SIL Open Font License, see `assets/fonts/LICENSE-*`).
- **Icons:** paths from [Lucide](https://lucide.dev) (ISC).
