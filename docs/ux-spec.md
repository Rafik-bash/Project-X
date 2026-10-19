# Maison Clair: Landing Page UX Specification

Scope: structure, flows and interaction behaviour. Colour, type and final copy are owned by the brand and copy workstreams. Wording in quotes is placeholder unless marked **(fixed)**.
Stack: static HTML + CSS + vanilla JS. No backend. Mobile-first.
**Conversion goal (the only one):** a completed booking in the `#book` widget, which ends at Step 4 "Confirmed".

---

## 1. Page structure and section order

| # | id | Section | Why it earns its place |
|---|----|---------|------------------------|
| 0 | `#top` | Header + hero | Value proposition, primary CTA, trust signals. Most visitors decide here. |
| 1 | `#results` | Before/after case studies | The strongest proof. It sits straight after the hero so the hero's secondary CTA lands one scroll away. |
| 2 | `#services` | 4 service cards | Matches the widget's Step 1 options one to one and anchors price. Each card preselects its service in the widget. |
| 3 | `#process` | How it works + trust | Reduces the anxiety of letting strangers into your home: vetting, insurance, guarantee. Kept short. |
| 4 | `#book` | Booking widget | The conversion point. |
| 5 | `#reviews` | Reviews | A net for people who scrolled past the widget without booking. Ends in a CTA back to `#book`. |
| 6 | `#faq` | FAQ | Answers the last objections (keys, pets, cancellation, payment). Answers link to `#book`. |
| 7 | `footer` | Contact, legal | Phone and email fallback, required legal links. |

**Cut, because they don't earn their place:** About/team story (fold one line of it into `#process`), blog, newsletter signup, partner-logo wall, animated stat counters, pricing table (duplicates the widget's live estimate), chat widget, exit-intent popups.

Every "Book" CTA links to `#book`. Use real `href="#book"` anchors so they work without JS. Set `html { scroll-padding-top: <header height + 16px> }` so anchored headings are never hidden under the fixed header.

---

## 2. Header, navigation and persistent CTAs

**Header (`<header class="site-header">`)**
- `position: fixed` and always visible. It does not hide when you scroll down, because the Book CTA must stay reachable. Height: 56px on mobile, 72px from 1024px up. `body` gets matching top padding.
- Contents: logo (links to `#top`), nav (Results, Services, How it works, Reviews, FAQ), and the **"Book a clean"** button.
- Scroll state: add `.is-scrolled` after 8px of scroll. This allows a visual change only (for example a shadow or a solid background). Height does not change, so there is no layout shift.
- Active section: an IntersectionObserver (rootMargin `-40% 0px -55% 0px`) sets `aria-current="location"` on the matching nav link.
- First focusable element on the page: a skip link "Skip to booking" pointing to `#book`. A second skip link, "Skip to content", points to `#main`.

**Mobile menu (below 1024px)**
- The header shows the logo, the Book button (from 600px up only; below 600px the bottom bar replaces it) and a menu `<button aria-expanded="false" aria-controls="mobile-nav">` with an accessible name of "Menu".
- When the menu opens it becomes a full-height sheet under the header. While it is open:
  - focus moves to the first link and is trapped inside the sheet;
  - `main` and `footer` get `inert`;
  - body scroll is locked;
  - the sticky bottom bar is hidden.
- It closes on Esc, on the close button, on any link activation, and when the viewport crosses 1024px. Focus returns to the menu button, except after a link activation, where the anchor scroll takes focus to the target.
- The sheet repeats a full-width "Book a clean" CTA as its last item.

**Sticky mobile bottom CTA bar (below 600px only)**
- Fixed to the bottom. Contents: "Book a clean" (button-styled link to `#book`) and "from £X" text. Height 64px plus `env(safe-area-inset-bottom)`.
- **It shows** once the hero's primary CTA has scrolled out of the viewport (IntersectionObserver on `#hero-cta`).
- **It hides** when any of these is true:
  - `#book` is at least 15% in view;
  - the mobile menu is open;
  - a text input or textarea has focus (virtual keyboard);
  - the user has reached the footer.
- It slides in and out over 200ms, or toggles instantly with reduced motion. When hidden: `visibility:hidden` and `aria-hidden="true"`.
- Add `scroll-padding-bottom: 80px` so focused elements are never covered by the bar (WCAG 2.4.11).

---

## 3. Hero (`#top`)

Required content:
- H1 (one per page)
- subheading
- primary CTA **"Book a clean" (fixed)**, with `id="hero-cta"`, linking to `#book`
- secondary CTA "See the results", a lower-weight link to `#results`
- trust row:
  - rating "4.9/5 from 1,2xx reviews", with stars plus text and a link to `#reviews`
  - "Fully insured"
  - "Vetted, employed cleaners"
  - "Re-clean guarantee"
- optional chip "Next available: Wed 21 Oct", computed from the same availability logic as the calendar; it links to `#book`
- a hero image. Recommended: a calm "after" interior. It is not the slider; the slider stays in `#results`.

Above-the-fold requirements (header included):

| Viewport | Must be visible without scrolling | Notes |
|----------|-----------------------------------|-------|
| 1440×900 | Everything above, plus the hero image | Two columns: text 6/12, image 6/12. Text block vertically centred. |
| 1280×720 | H1 (at most 2 lines), sub (at most 2 lines), both CTAs, full trust row | Two columns. The image may crop (`object-fit: cover`). The availability chip may drop below the fold. |
| 390×844 | H1 (at most 3 lines), sub (at most 3 lines), primary CTA (full width, at least 48px tall), secondary link, condensed trust row (rating and "Insured" on one line) | Single column, text first. The image sits below the CTAs, peeking at least 80px above the fold to invite scrolling. The rest of the trust row wraps below. |

Copy constraints for copywriters: H1 of at most 8 words, sub of at most 25 words. Validate with real text at all three sizes. No hero video, no carousel, no auto-animations except one optional fade-in of under 300ms.

---

## 4. Before/after case studies (`#results`)

**Four cases.** Each maps to a service so its CTA can preselect that service:

| Tab label | Room | Service | Problem (example) |
|-----------|------|---------|-------------------|
| Kitchen | Family kitchen | Deep clean | Baked-on hob grease, stained grout |
| Bathroom | En-suite | Deep clean | Limescale, mould in sealant |
| Living room | Rental flat | Move in/out | End-of-tenancy dust, marks, carpet stains |
| Whole flat | 2-bed flat | Post-renovation | Plaster dust on every surface |

**Per-case content (data-driven, one JS/JSON object per case):**
- `room`, `location` (fictional district) and `service`
- `problem`: one sentence
- `timeTaken` (for example "3 h 40 min") and `teamSize` (for example "2 cleaners")
- `metrics`: exactly 3 items, each a label and a value, for example "Surfaces treated: 38", "Hygiene swab reading: 412 → 18 RLU", "Limescale removed: 100% of fixtures"
- `quote`: client quote of at most 30 words, with first name and initial
- `beforeImg` / `afterImg`: same framing and aspect ratio (4:3, or 3:4 on mobile via `<picture>`), and descriptive `alt` text for each
- CTA "Book a {service} like this". It links to `#book` with `data-service="deep"` and so on. JS selects that service in Step 1 and announces "Deep clean selected" via the widget live region.

**Layout:** below 1024px: tabs, then slider, then details stacked. From 1024px up: slider at 7/12, details panel at 5/12 beside it.

**Switching cases: accessible tabs (no carousel, no autoplay)**
- Structure: `div[role=tablist][aria-label="Case studies"]`, containing `button[role=tab][aria-selected][aria-controls][id]`. Each panel is `div[role=tabpanel][aria-labelledby]`, and inactive panels are `hidden`.
- Roving tabindex: the active tab has `tabindex=0` and the others `-1`.
  - ←/→ move between tabs and wrap around.
  - Home/End jump to the first/last tab.
  - Activation is **automatic** on focus. Panels are local; preload the next case's images when the user hovers or focuses its tab.
- On mobile the tablist scrolls horizontally with scroll-snap. The active tab calls `scrollIntoView({inline:'nearest'})`.
- Each case keeps its own slider position when you switch away and back.
- Without JS: all four cases render stacked, each with before and after images shown side by side (stacked below 600px) and captioned "Before" and "After". The tablist is not rendered.

**Comparison slider**
- Markup: a figure with two stacked images. The **Before image is on the left side, the After image on the right**.
  - The After layer is clipped with `clip-path: inset(0 0 0 var(--pos))`, driven by the CSS variable `--pos` (0–100%).
  - A vertical divider with a handle sits at `--pos`.
- The handle is the focusable control:
  - attributes: `role="slider"`, `tabindex="0"`, `aria-orientation="horizontal"`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow="50"`;
  - `aria-label="Before and after comparison: Kitchen"`;
  - `aria-valuetext="50% before, 50% after"`. Use "Showing before only" at 100 and "Showing after only" at 0.
  - The value is the handle position from the left, which is the share of Before shown.
- **Initial position: 50.**
- Labels: "Before" pinned top-left and "After" pinned top-right. Both are `aria-hidden="true"` because the valuetext and alt texts carry the meaning. A label fades out when its side is under 12% visible.
- **Pointer (mouse and pen):**
  - `pointerdown` anywhere on the figure jumps the handle to that x position and starts a drag (`setPointerCapture`). `pointermove` updates are throttled with rAF. `pointerup` and `pointercancel` end the drag.
  - Clamp the value to 0–100.
  - Focus the handle on mouse down so keyboard keys work afterwards. With touch input, do not move focus.
- **Touch:** the figure gets `touch-action: pan-y`, so vertical swipes still scroll the page and horizontal drags move the handle. Tap-to-jump works the same as a click. The visible handle grip is at least 44×44px.
- **Keyboard (on the handle):**
  - ←/↓ −5, →/↑ +5
  - PageDown −20, PageUp +20
  - Home → 0 (after only), End → 100 (before only)
  - Every change updates `aria-valuenow` and `aria-valuetext`.
- This meets WCAG 2.5.7: tapping or clicking a position is the single-pointer alternative to dragging.
- Reduced motion: no easing on keyboard or tap jumps. The handle moves instantly.

---

## 5. Booking widget (`#book`)

### 5.1 Structure

```
section#book
 ├─ .book-fallback   (phone/email; visible by default, removed by JS on successful init)
 └─ form#booking-form[novalidate]   (hidden until JS init succeeds)
     ├─ ol.progress   "Step n of 4"  (li[aria-current="step"])
     ├─ div.steps
     │   ├─ fieldset#step-1  Your clean
     │   ├─ fieldset#step-2  Date & time
     │   ├─ fieldset#step-3  Your details
     │   └─ div#step-4       Confirmed
     ├─ aside#booking-summary[aria-labelledby]
     ├─ div.step-actions  [Back] [Next/Confirm]
     └─ div#booking-status.visually-hidden[aria-live="polite"][aria-atomic="true"]
```

- Only the current step is visible. The others get `hidden`.
- Each step starts with an `h3` with `tabindex="-1"`, for example "Step 1 of 4: Your clean".
- Progress items for **completed** steps are buttons that jump back. Future steps are plain text and are not focusable.

### 5.2 Step 1: Your clean

- **Service type:** native radio group styled as cards, with these values:

  | Value | Label | Base | per bedroom | per bathroom | Base duration |
  |---|---|---|---|---|---|
  | `standard` | Standard | £60 | +£15 | +£12 | 2 h |
  | `deep` | Deep clean | £110 | +£25 | +£20 | 3.5 h |
  | `move` | Move in/out | £150 | +£30 | +£25 | 4.5 h |
  | `reno` | Post-renovation | £190 | +£35 | +£30 | 5.5 h |

  - Defaults: `standard`, 2 bedrooms, 1 bathroom. A price is visible from the first paint.
  - Each card shows one line about what's included and "from £X".
- **Home size steppers:**
  - Bedrooms: 0 to 6, where 0 displays as "Studio".
  - Bathrooms: 1 to 4.
  - Markup: `div[role=group][aria-labelledby]` containing `− <output> +`. The buttons are named "Remove a bedroom" and "Add a bedroom".
  - Each button is `disabled` at its bound.
  - A hidden `input type=hidden` holds the value for the form state.
  - Duration adds 0.5 h per bedroom and 0.5 h per bathroom.
- **Extras:** checkboxes.

  | Extra | Price | Duration |
  |---|---|---|
  | Inside oven | +£35 | +1 h |
  | Inside fridge | +£25 | +0.5 h |
  | Interior windows | +£30 | +1 h |
  | Laundry & ironing | +£20 | +0.5 h |

  - For `move`, Oven and Fridge are shown checked and `disabled`, labelled "Included". Their price is not added.
  - Switching away from `move` restores the user's previous choices for those two extras.
- **Live estimate:**
  - The total and duration recalculate on every change and show both inline under the step (on mobile) and in the summary.
  - Team size is 1 cleaner if the duration is 4 h or less, otherwise 2 cleaners. With 2 cleaners the displayed duration is halved and rounded up to 0.5 h.
  - Announce changes through `#booking-status`, debounced by 600ms: "Estimate £145, about 3 hours".
- Next: "Choose a date". Step 1 always validates because of the defaults.

### 5.3 Step 2: Date & time

**Calendar (month view)**
- Header: month and year in an `h4` with `id`, plus "Previous month" and "Next month" icon buttons with text labels.
  - Previous is disabled on the current month.
  - Next is disabled when the following month has no dates in the booking window.
  - A month change is announced as "November 2026".
- Grid: `table[role=grid][aria-labelledby=<month heading>]`.
  - Weeks start on Monday.
  - Column headers: `th scope=col` with `abbr="Monday"` and visible text "Mo".
  - Each day is a `td[role=gridcell]` containing a `button type=button`.
  - Leading and trailing days of other months render as empty cells.
- **Booking window:** from tomorrow up to and including today + 56 days, using the client's local date. Same-day booking is not offered.
- **Day states** (deterministic, so they are identical on every load):

  | State | Rule | Selectable | Label suffix |
  |---|---|---|---|
  | past / today / beyond window | as above | no | ", unavailable" |
  | closed | Sunday | no | ", closed" |
  | fully booked | `(y*10000 + m*100 + d) % 13` is 0 or 5 (m is 1–12) | no | ", fully booked" |
  | available | otherwise | yes | ", available" |
  | selected | user choice | n/a | append ", selected" |

  - Non-selectable days get `aria-disabled="true"`, not `disabled`, so keyboard users can still land on them and hear why they can't pick them.
  - Each state needs a non-colour cue: a strikethrough for fully booked, muted text plus a dot legend for closed.
  - Show a legend below the grid.
  - Today additionally gets `aria-current="date"`.
- **Button `aria-label`:** full date plus state, for example "Wednesday 21 October 2026, available". Build it from `Intl.DateTimeFormat('en-GB', {weekday:'long', day:'numeric', month:'long', year:'numeric'})` parts, without a comma.
  - Note: 21 Oct 2026 is a Wednesday. The brief's "Tuesday 21 October" was a slip.
- **Roving tabindex:** exactly one day button has `tabindex=0` at a time. It is the selected day, or else the first available day of the visible month.
- **Keyboard (focus inside the grid):**

  | Key | Action |
  |---|---|
  | ← / → | ±1 day |
  | ↑ / ↓ | ±7 days |
  | Home / End | Monday / Sunday of the current week |
  | PageUp / PageDown | Previous / next month, same day number (clamped to month length) |
  | Enter / Space | Select the date, if it is available |

  - Moving across a month boundary re-renders the grid and keeps focus on the target day.
  - Focus cannot move outside the navigable months. Clamp it.
  - Arrow movement is plain date arithmetic, so ← on a Monday lands on the previous Sunday (row above).
- On select:
  - set `aria-selected="true"` on the cell (clear the previous one);
  - update the label suffix;
  - **leave focus on the date**;
  - render the time slots;
  - announce "Wednesday 21 October selected. 4 arrival times available."

**Time slots**
- Native radio group (`fieldset` + `legend` "Arrival time") styled as chips.
  - Mon–Fri: 08:00, 10:00, 12:00, 14:00, 16:00.
  - Sat: 08:00, 10:00, 12:00.
- Slot `i` (0-based) on day `d` is unavailable if `(d + 3*i) % 5 === 0` or `(d + i) % 7 === 0`. Fully-booked days are already excluded at day level, so every selectable day keeps at least one slot.
- Unavailable chips are `disabled`, with a visible "Booked" text and strikethrough.
- Each chip shows the arrival window and the estimated finish, for example "10:00–10:30 arrival · done by ~13:30".
- Before any date is chosen, show the placeholder "Pick a date to see times".
- Changing the date keeps the chosen slot if it is still free on the new day. Otherwise it is cleared and announced: "10:00 isn't available on Saturday 24 October. Choose another time."
- Changing service or size in Step 1 later only updates the finish times. Availability does not depend on them.

**Validation on Next:**
- No date: error "Choose a date for your clean", attached to the calendar via `aria-describedby`.
- Date but no time: "Choose an arrival time".

### 5.4 Step 3: Your details

| Field | Type / autocomplete | Required | Rule → error message (placeholder copy) |
|---|---|---|---|
| Full name | text / `name` | yes | trimmed length ≥ 2 → "Enter your full name" |
| Email | email / `email`, `inputmode=email` | yes | `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` → "Enter an email like name@example.com" |
| Phone | tel / `tel` | yes | 10–15 digits after stripping spaces, `()-`, leading `+` → "Enter a phone number with 10–15 digits" |
| Address line 1 | text / `address-line1` | yes | non-empty → "Enter the first line of the address" |
| Address line 2 | text / `address-line2` | no | none |
| Town / city | text / `address-level2` | yes | non-empty → "Enter a town or city" |
| Postcode | text / `postal-code`, `autocapitalize=characters` | yes | loose UK pattern `^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$`, case-insensitive; uppercase and normalise the space on blur → "Enter a valid postcode, like SW1A 1AA" |
| Access notes | textarea | no | max 500 characters. The counter becomes visible and announced politely at ≤ 50 remaining. Hint: "Keys, parking, pets, allergies" |

- Visible `<label>` on every field; required fields are marked in text, not with a lone `*`. Hints are linked with `aria-describedby`.
- **Validation timing:**
  - Never show errors on untouched fields.
  - Validate a field on `blur`, but only if it is non-empty or has already been in error.
  - Once a field is in error, re-validate it on every `input` so the error clears as soon as it is fixed.
  - On submit, validate all fields.
- **Error display:**
  - A message under the field with an icon and text. Set `aria-invalid="true"` and add the error id to `aria-describedby`.
  - Keep the user's input. Never clear a field.
- The primary button is labelled **"Confirm booking" (fixed)**. Above it, a policy line: "Free cancellation up to 24 h before. You pay after the clean."
- **Submit simulation:**
  - The button gets `aria-disabled`, `aria-busy="true"` and the label "Confirming…" with a spinner, which blocks double-submits.
  - After a 900ms timeout, go to Step 4.
  - **Test hook:** an email starting with `fail@` simulates a failure. Show an inline alert at the top of the step (`role="alert"`): "We couldn't confirm your booking. Nothing was charged. Try again, or call 0xxx." Restore the button and keep all data.

### 5.5 Step 4: Confirmed

- The heading "You're booked" (`h3`, focused on arrival) has a static check icon. No animation is needed for reduced motion.
- **Booking reference:** `MC-` + `YYMMDD` of the cleaning date + `-` + 4 characters from `crypto.getRandomValues` over the alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`. Example: `MC-261021-K7QX`.
  - Shown large, with a "Copy" button. On click it copies and sets the button text to "Copied" for 2 s, plus a polite announcement.
- Full summary: service, size, extras, date, arrival window, estimated duration and team, address, total, and "Pay after the clean. No card taken." The summary sidebar collapses to avoid repeating this.
- **"Add to calendar" button:** generates a `.ics` file client-side and downloads it.
  - Contents: `BEGIN:VCALENDAR`, `VERSION:2.0`, `PRODID:-//Maison Clair//Booking//EN`, `CALSCALE:GREGORIAN`, and one `VEVENT` with:
    - `UID:<ref>@maisonclair.example`
    - `DTSTAMP` in UTC (`…Z`)
    - `DTSTART` / `DTEND` as **floating local time** (`YYYYMMDDTHHMMSS`, no TZID), where end = arrival + duration
    - `SUMMARY:Maison Clair – Deep clean`
    - `LOCATION` = address
    - `DESCRIPTION` = ref, extras, access notes
    - a `VALARM` with `TRIGGER:-P1D`
  - Escape `\ ; ,` and newlines (as `\n`). Use CRLF line endings. Fold lines longer than 75 octets.
  - Create a `Blob` of type `text/calendar;charset=utf-8`, download it via a temporary `<a download="maison-clair-<ref>.ics">`, then `revokeObjectURL`.
- Secondary actions:
  - "Make another booking" resets the form to its defaults, clears storage and focuses the Step 1 heading.
  - Link to `#faq` for "What happens next?"
- There is no Back button on Step 4.

### 5.6 Order summary

- **From 1024px up:** a right column (4/12) with `position: sticky; top: header + 24px`.
- **Below 1024px:** collapsed into the mobile action bar (5.7).
- Content order:
  1. Service
  2. Home size ("2 bed · 1 bath")
  3. Extras (or "None")
  4. Date and time (or "Not chosen yet")
  5. Duration and team
  6. **Estimated total**
- Lines from completed steps each get an "Edit" link, for example "Edit date & time", with text naming the item. It jumps to that step.
- The total gets a brief highlight on change, with no count-up animation.

### 5.7 Navigation, state, focus, announcements

- **Back / Next:**
  - Back appears on Steps 2–3. It never validates and never loses data.
  - Next is **never disabled**. It validates on click.
  - Button labels name the destination: "Choose a date" → "Your details" → "Confirm booking".
- **Mobile action bar (below 1024px):** sticky to the bottom of the viewport while the form is in view, laid out as `[Summary · £145 ▴] [Back] [Next]`.
  - The Summary toggle is `button[aria-expanded][aria-controls=booking-summary]`. It expands the summary as a panel above the bar (max 60vh, scrollable). Esc collapses it, and focus stays on the toggle.
  - The bar becomes static (not sticky) while a text field has focus.
- **Step change:**
  1. hide the current step and show the next;
  2. scroll the form top into view (smooth, or instant with reduced motion);
  3. move focus to the new step's `h3` (`tabindex=-1`);
  4. update `aria-current="step"` in the progress list.
  - Do not also announce the step via the live region. The focused heading already announces it.
- **Failed validation on Next:**
  - render an error summary box at the top of the step (`div tabindex=-1` with heading "There's a problem" and a list of links to each invalid field) and focus it;
  - also show the inline errors.
  - The summary updates live as errors are fixed and disappears when there are none.
- **State preservation:**
  - One state object `{step, service, bedrooms, bathrooms, extras[], date, slot, contact{…}, ref}` is the single source of truth. Render from state.
  - Save the state to **`sessionStorage`** (not localStorage, because it holds PII) on every change, debounced by 300ms.
  - Restore it on load, including the step. If the restored date or slot is now invalid (in the past), clear it, return to Step 2 and show the notice "Your previous date is no longer available."
  - Do not push history entries per step. Browser Back behaves normally, and state survives in session storage.
- **Preselection from CTAs:** `[data-service]` links set the service before scrolling. Preselection does not change any other field. It is announced.
- **Live region (`#booking-status`, polite):** use it only for changes not tied to focus:
  - estimate updates
  - month changes
  - date selected plus slot count
  - slot cleared
  - preselected service
  - copy confirmation

  Submit failure uses its own `role="alert"`. Never announce on every keystroke.

---

## 6. Reviews, FAQ, footer

**`#reviews`**
- Aggregate block: "4.9 out of 5", review count, and the stars as an `img` with `aria-label="Rated 4.9 out of 5"`.
- 6 review cards. Each has:
  - the quote (at most 50 words)
  - first name and last initial
  - area
  - service used (this links reviews to the services)
  - month and year
  - star rating as text plus an icon
- Below 600px: show 3 cards and a "Show 3 more reviews" button (`aria-expanded`; focus moves to the first newly shown card). From 600px up: all 6.
- No carousel. A closing CTA "Book a clean" links to `#book`.

**`#faq`**
- Native `<details><summary>`, with multiple items allowed open (no `name` attribute). Each `details` has an `id`. If `location.hash` matches one on load or on `hashchange`, open it and scroll to it.
- 7 questions:
  - What's included in each service?
  - Do I need to be home / how do keys work?
  - What products do you use? Pets and allergies?
  - Are you insured if something breaks?
  - How do I reschedule or cancel?
  - When and how do I pay?
  - Will I get the same team each time?
- Answers that lead to action end with a link to `#book`. Keep the default `summary` semantics; style the marker without removing it from the accessibility tree.

**`footer`**
- Logo and tagline.
- Phone (`tel:`) and email (`mailto:`).
- Opening hours (Mon–Sat 08:00–18:00).
- Service area.
- Repeat of the nav links.
- Insurance and registration line.
- Legal links: Privacy, Terms, Cookies (placeholders).
- © 2026.
- A small "Fictional demo company" note.
- No newsletter and no social feeds. Social icons are optional, with text labels.

---

## 7. Responsive behaviour (mobile-first)

Breakpoints (min-width): **base** below 600 · **sm 600** · **md 768** · **lg 1024** · **xl 1280**. The content max-width is 1200px. Side padding is 16px (base), 24px (md) and 32px (lg).

| Section | base (<600) | sm/md (600–1023) | lg+ (≥1024) |
|---|---|---|---|
| Header | Logo + menu button | + Book button | Full inline nav + Book |
| Bottom CTA bar | Yes (rules §2) | No (the header Book button is visible) | No |
| Hero | 1 column, text then image | 1 column, image beside text from md if it fits the fold | 2 columns, 6/6 |
| Results | Scrollable tabs, 3:4 slider, details stacked | Tabs, 4:3 slider, metrics in a 3-up row | Slider 7/12 + details 5/12 |
| Services | 1 column of cards | 2×2 grid | 4 columns |
| Process | Vertical numbered list | Vertical list | 4-step horizontal row |
| Book | Single column; summary in the action bar | Single column; calendar and slots side by side from md | Steps 8/12 + sticky summary 4/12 |
| Reviews | 1 column, 3 cards + "Show more" | 2 columns, 6 cards | 3 columns, 6 cards |
| FAQ | Full width | Max 720px, centred | Max 720px, centred |
| Footer | Stacked | 2 columns | 4 columns |

- The page must not scroll horizontally at 320px wide or at 400% zoom.
- Calendar cells are at least 44×44px at the base breakpoint. With 7 columns at 320px minus padding, that gives about 41px, so at 320–359px allow 40px and reduce gaps to 2px. Everywhere else, enforce 44px.

---

## 8. Accessibility checklist (WCAG 2.2 AA)

- [ ] Contrast:
  - body text ≥ 4.5:1;
  - large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1;
  - UI boundaries, icons, focus rings, slider handle and selected date ≥ 3:1 against adjacent colours;
  - "Before"/"After" labels ≥ 4.5:1 over any image, using a solid backing plate.
- [ ] `:focus-visible` on every interactive element: a clearly visible ring (at least 2px with offset), never removed. Focus must never be hidden behind the fixed header or the bottom bar (scroll-padding top and bottom).
- [ ] Landmarks: `header`, `nav[aria-label="Main"]`, `main#main`, `footer`. One H1. Headings in order: each section `h2`, widget steps `h3`.
- [ ] Skip links: "Skip to content" and "Skip to booking".
- [ ] Every image has a meaningful `alt` text, except decorative ones (`alt=""`). Before/after alt texts describe the state ("Hob with thick brown grease…").
- [ ] Forms: visible labels, `autocomplete` tokens, errors given in text and linked via `aria-describedby`, `aria-invalid`, no placeholder-only labels, no time limits.
- [ ] State is never shown by colour alone: calendar states, disabled slots, the selected service card and errors all have text or a shape cue.
- [ ] Touch targets ≥ 44×44px (2.5.8 minimum is 24, our target is 44). Dragging has a single-pointer alternative (2.5.7).
- [ ] `prefers-reduced-motion: reduce`:
  - disable smooth scroll, the slider intro nudge, step transitions, the bar slide-in and section reveals;
  - every state change becomes instant.
- [ ] Reflow at 320px, text-spacing override and 200% text zoom all work without loss.
- [ ] `lang="en-GB"`. Prices use `Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'})`.
- [ ] **No-JS fallback:**
  - An inline `<head>` script swaps `html.no-js` to `html.js`.
  - In `#book`, the `.book-fallback` block (phone, email, hours, "We'll book you in by phone") is visible by default. JS removes it only after the widget initialises successfully, so a script error also leaves the fallback in place.
  - The form is hidden under `.no-js`.
  - The nav renders as a static wrapped list with no menu button.
  - Case studies render stacked side-by-side pairs.
  - Book CTAs still anchor to `#book`, where the fallback appears.
- [ ] Test with keyboard only, VoiceOver iOS and macOS, NVDA with Firefox, and Lighthouse/axe at 0 serious issues.

---

## 9. Micro-interactions

**Keep (each has a job):**

| Interaction | Purpose | Spec |
|---|---|---|
| Slider intro nudge | Shows that the slider is draggable | Once per page load, the first time a slider is 50% in view: 50 → 38 → 50 over 900ms ease-in-out. Skip it if the user has already interacted or prefers reduced motion. |
| Handle grip affordance | Shows that the handle is draggable | Cursor `ew-resize`. Grip icon with arrows. The handle enlarges slightly while dragging. |
| Total highlight on change | Links the user's input to the price | 400ms background pulse on the total. No count-up. |
| Step transition | Gives a sense of moving forward | 150ms fade with 8px translate. Instant with reduced motion. |
| Selected-state feedback (cards, dates, chips) | Confirms the choice | Instant. A check icon on the service card. |
| Busy state on "Confirm booking" | Prevents double-submit and reassures | Spinner and "Confirming…" for about 900ms. |
| Copy reference → "Copied" | Confirms the action | Text swap for 2 s plus a polite announcement. |
| Header `.is-scrolled` | Separates the header from content | Visual change only, no height change. |
| Sticky bar slide-in | Avoids an abrupt appearance | 200ms. Instant with reduced motion. |

**Skip:** parallax, scroll-jacking or snap scrolling of the page, auto-advancing carousels, count-up stats, confetti on confirmation, hover-zoom on before/after images, cursor followers, typing effects in the hero, scroll-triggered reveals on above-the-fold content or on content that is hidden until JS runs. Section-heading reveals are allowed only if content is visible by default and JS adds the animation. No exit-intent modals, no chat bubble, no cookie wall. Use a small non-blocking cookie notice only if analytics are added.
