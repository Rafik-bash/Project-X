# Maison Clair: landing page

A static landing page for a home-cleaning company (Maison Clair is a fictional brand). It has before/after case studies and a four-step booking flow with a fake availability calendar. It uses plain HTML, CSS and JavaScript, with no build step and no framework.

## Run it

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

You need a server because the JavaScript uses ES modules, which don't load from `file://`.

## Structure

```
index.html            all page content and copy
css/tokens.css        the ONLY place colors, fonts, spacing, radius, motion are defined
css/base.css          @font-face, reset, element defaults
css/layout.css        containers, header, footer, dark-section token remap
css/components.css    buttons, tabs, before/after slider, form controls, calendar
css/sections.css      one-off rules per section (#top, #results, #book, …)
css/animations.css    all decorative motion, gated behind prefers-reduced-motion
js/main.js            reveals, header, mobile menu, sticky mobile CTA, FAQ hash
js/slider.js          before/after slider + accessible case-study tabs
js/booking.js         booking widget: pricing, fake availability, validation, .ics export
docs/                 brand guidelines, UX spec and copy deck the page was built from
tools/make_images.py  regenerates the web images and the simulated "before" shots
```

To change brand colors or fonts, edit `css/tokens.css` only.

## How the booking works

- **Pricing:** `SERVICES` / `EXTRAS` in `js/booking.js`. The price is the service base, plus a per-bedroom and per-bathroom amount, plus extras. Duration and team size come from the same table.
- **Availability:** deterministic and fake. Sundays are closed, and some days are "fully booked" by a date formula, so the calendar looks the same on every load. Booking runs from tomorrow to 56 days out.
- **Submit:** simulated with a 900 ms delay, after which you get a reference like `MC-261027-8KPL` and a downloadable `.ics` file. An email starting with `fail@` triggers the error state, for testing.
- **Saved progress:** progress is kept in `sessionStorage` (never `localStorage`, because it holds personal details) and restored on reload.
- **Without JavaScript:** a phone/email fallback shows in place of the widget.

**To connect a real calendar later**, replace `dayStatus()`, `slotsFor()` and the submit block in `nextBtn`'s form `submit` handler with API calls.

## Before launch: placeholders to replace

Everything below is invented and must be replaced before this goes live:

- [ ] Brand name, logo and the "fictional company" note in the footer
- [ ] Rating "4.9 from 1,200+ homes" (hero, reviews)
- [ ] All six reviews and the four case studies (names, neighborhoods, quotes, stats)
- [ ] Before/after photos. The "before" images are **digitally simulated** from the "after" shots by `tools/make_images.py`. Replace them with real, matched job photos.
- [ ] Prices, durations, extras and the $40 late-cancel fee (`index.html` + `js/booking.js`)
- [ ] Phone (555) 014-2210, email hello@maisonclair.example, service area, hours
- [ ] Footer links (Privacy, Terms, Careers, Gift a clean) currently point to `#top`
- [ ] Booking submit (currently simulated, nothing is sent anywhere)

## Credits

- **Photos:** [Unsplash](https://unsplash.com) (Unsplash License, free for commercial use). Source photo IDs:
  - hero: `1493809842364-78817add7ffb`
  - window cleaning: `1581578731548-c64695cc6952`
  - bedroom: `1595526114035-0d45ed16cfbf`
  - kitchen: `1600489000022-c2086d79f9d4`
  - vacuum: `1527515637462-cff94eecc1ac`
  - case kitchen: `1507089947368-19c1da9775ae`
  - case bathroom: `1584622650111-993a426fbf0a`
  - case living room: `1560448204-e02f11c3d0e2`
  - case renovation: `1560185007-cde436f6a4d0`

  Pixabay and Pexels weren't reachable from the build environment, so Unsplash was used instead.
- **Fonts:** Fraunces and Instrument Sans, self-hosted from Fontsource (SIL Open Font License, see `assets/fonts/LICENSE-*`).
- **Icons:** paths from [Lucide](https://lucide.dev) (ISC).
