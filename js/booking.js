// Booking widget: 4-step flow with live pricing, a fake availability calendar,
// inline validation and a client-side .ics download. No network calls.
// Behaviour follows docs/ux-spec.md §5; wording comes from data-* attributes
// in the markup so copy stays in index.html.

// Brand name, used in the .ics file. Keep in sync with index.html.
const BRAND = 'مكتب الاختيار الأول';

// Prices in Iraqi dinar (IQD). Base = studio or 1 bedroom with 1 bathroom.
const SERVICES = {
  standard: { name: 'تنظيف أساسي', base: 75000, bed: 10000, bath: 10000, hours: 2 },
  deep: { name: 'تنظيف عميق', base: 125000, bed: 15000, bath: 15000, hours: 3.5 },
  move: { name: 'تنظيف نقل بيت', base: 160000, bed: 20000, bath: 15000, hours: 4.5 },
  reno: { name: 'تنظيف بعد الترميم', base: 200000, bed: 25000, bath: 20000, hours: 5.5 },
};
const EXTRAS = {
  oven: { name: 'جوه الفرن', price: 25000, hours: 1 },
  fridge: { name: 'جوه الثلاجة', price: 15000, hours: 0.5 },
  windows: { name: 'الشبابيك من جوه', price: 30000, hours: 1 },
  laundry: { name: 'غسل الهدوم وطيّها', price: 20000, hours: 0.5 },
};
const INCLUDED_IN_MOVE = ['oven', 'fridge'];
// Iraqi working week: Saturday to Thursday, Friday off, Thursday a short day.
const CLOSED_DAY = 5; // Friday
const SHORT_DAY = 4; // Thursday
const WEEKDAY_SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00'];
const SHORT_DAY_SLOTS = ['08:00', '10:00', '12:00'];
const BOOK_AHEAD_DAYS = 56;
const STORE_KEY = 'ak-booking';
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const BOUNDS = { bedrooms: [0, 6], bathrooms: [1, 4] };

// ar-IQ gives Arabic-Indic digits and the Iraqi month names (تشرين الأول, كانون الثاني …).
const LOCALE = 'ar-IQ';
const num = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const money = { format: (n) => `${num.format(n)} د.ع` };
const fmtLong = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const fmtDay = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', month: 'long', day: 'numeric' });
const fmtShort = new Intl.DateTimeFormat(LOCALE, { weekday: 'short', month: 'short', day: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' });
const isRtl = () => document.documentElement.dir === 'rtl';
// Saturday-first week: Sat=0 … Fri=6.
const weekIndex = (d) => (d.getDay() + 1) % 7;
// Accept Arabic-Indic (٠-٩) and Persian (۰-۹) digits in typed input.
const toLatinDigits = (v) => v.replace(/[\u0660-\u0669]/g, (c) => c.charCodeAt(0) - 0x0660).replace(/[\u06F0-\u06F9]/g, (c) => c.charCodeAt(0) - 0x06F0);
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a, b) => !!a && !!b && iso(a) === iso(b);
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// "٨ الصبح", "١٢ الظهر", "٤ العصر", "٧ المسا": how a Baghdadi says the time.
function to12h(t) {
  const [h, m] = t.split(':').map(Number);
  const part = h < 12 ? 'الصبح' : h < 15 ? 'الظهر' : h < 18 ? 'العصر' : 'المسا';
  const hh = num.format(((h + 11) % 12) + 1);
  return `${m ? `${hh}:${num.format(m).padStart(2, '٠')}` : hh} ${part}`;
}
function addHours(t, hrs) {
  const [h, m] = t.split(':').map(Number);
  const mins = h * 60 + m + Math.round(hrs * 60);
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
}
// Arabic counting: 1 ساعة, 2 ساعتين, 3–10 ساعات; halves are "ونص".
function fmtHours(h) {
  const whole = Math.floor(h);
  const half = h % 1 ? ' ونص' : '';
  if (whole === 0) return 'نص ساعة';
  if (whole === 1) return (half ? 'ساعة' : 'ساعة وحدة') + half;
  if (whole === 2) return 'ساعتين' + half;
  return `${num.format(whole)} ${whole <= 10 ? 'ساعات' : 'ساعة'}${half}`;
}
const fmtTeam = (n) => (n === 1 ? 'شخص واحد' : n === 2 ? 'شخصين' : `${num.format(n)} أشخاص`);
const fmtBeds = (n) => (n === 0 ? 'ستوديو' : n === 1 ? 'غرفة نوم وحدة' : n === 2 ? 'غرفتين نوم' : `${num.format(n)} غرف نوم`);
const fmtBaths = (n) => (n === 1 ? 'حمّام واحد' : n === 2 ? 'حمّامين' : `${num.format(n)} حمّامات`);
const sizeLabel = (bed, bath) => `${fmtBeds(bed)} · ${fmtBaths(bath)}`;

const DEFAULTS = () => ({
  step: 1, service: 'standard', bedrooms: 2, bathrooms: 1, extras: [], date: null, slot: null, contact: {},
});

export function initBooking(root) {
  if (!root) return;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const firstBookable = addDays(today, 1);
  const lastBookable = addDays(today, BOOK_AHEAD_DAYS);

  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];
  const form = $('form');
  const steps = $$('[data-step]');
  const status = $('[data-live]');
  const backBtn = $('[data-back]');
  const nextBtn = $('[data-next]');
  const summary = $('[data-summary]');

  let state = DEFAULTS();
  let view = new Date(firstBookable.getFullYear(), firstBookable.getMonth(), 1);
  let focusDate = firstBookable;
  let lastIcs = null;
  let ref = null;

  // --- availability (deterministic, so every visit sees the same calendar) ---
  function dayStatus(d) {
    if (d < firstBookable || d > lastBookable) return 'past';
    if (d.getDay() === CLOSED_DAY) return 'closed';
    const k = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) % 13;
    if (k === 0 || k === 5) return 'full';
    return 'open';
  }
  function slotsFor(d) {
    const day = d.getDate();
    return (d.getDay() === SHORT_DAY ? SHORT_DAY_SLOTS : WEEKDAY_SLOTS).map((t, i) => {
      const taken = (day + 3 * i) % 5 === 0 || (day + i) % 7 === 0;
      return { t, free: !taken };
    }).map((s, i, all) => (all.some((x) => x.free) || i ? s : { ...s, free: true }));
  }

  // --- pricing & duration ---------------------------------------------------
  function effectiveExtras() {
    return state.service === 'move' ? state.extras.filter((k) => !INCLUDED_IN_MOVE.includes(k)) : state.extras;
  }
  function quote() {
    const s = SERVICES[state.service];
    const extras = effectiveExtras();
    const price = s.base + Math.max(0, state.bedrooms - 1) * s.bed + (state.bathrooms - 1) * s.bath
      + extras.reduce((n, k) => n + EXTRAS[k].price, 0);
    const labour = s.hours + 0.5 * state.bedrooms + 0.5 * (state.bathrooms - 1)
      + extras.reduce((n, k) => n + EXTRAS[k].hours, 0);
    const team = labour > 4 ? 2 : 1;
    const hours = Math.ceil((labour / team) * 2) / 2;
    return { price, hours, team };
  }
  const priceFor = (key) => {
    const s = SERVICES[key];
    return s.base + Math.max(0, state.bedrooms - 1) * s.bed + (state.bathrooms - 1) * s.bath;
  };

  // --- persistence: sessionStorage (holds PII, so never localStorage) ----------
  let saveTimer;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        if (state.step === 4) return sessionStorage.removeItem(STORE_KEY);
        sessionStorage.setItem(STORE_KEY, JSON.stringify({ ...state, date: state.date && iso(state.date) }));
      } catch { /* storage blocked: the widget still works, it just won't survive a reload */ }
    }, 300);
  }
  function restore() {
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null'); } catch { saved = null; }
    if (!saved || !SERVICES[saved.service]) return;
    state = { ...DEFAULTS(), ...saved, date: saved.date ? fromIso(saved.date) : null };
    if (state.step === 4) state.step = 1;
    if (state.date && dayStatus(state.date) !== 'open') {
      state.date = null; state.slot = null;
      if (state.step > 2) state.step = 2;
      showNotice($('[data-step="2"] [data-notice]'));
    }
  }

  // --- announcements --------------------------------------------------------
  let announceTimer;
  function announce(msg, delay = 0) {
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      status.textContent = '';
      requestAnimationFrame(() => { status.textContent = msg; });
    }, delay);
  }
  function showNotice(el) { if (el) el.hidden = false; }

  // --- step 1 ---------------------------------------------------------------
  function renderStep1() {
    $$('input[name="service"]').forEach((i) => { i.checked = i.value === state.service; });
    $$('[data-price-for]').forEach((el) => { el.textContent = money.format(priceFor(el.dataset.priceFor)); });
    for (const key of ['bedrooms', 'bathrooms']) {
      const v = state[key];
      const out = $(`[data-stepper="${key}"] output`);
      out.textContent = key === 'bedrooms' && v === 0 ? 'ستوديو' : num.format(v);
      $(`[data-stepper="${key}"] [data-dec]`).disabled = v <= BOUNDS[key][0];
      $(`[data-stepper="${key}"] [data-inc]`).disabled = v >= BOUNDS[key][1];
    }
    $$('input[name="extras"]').forEach((i) => {
      const included = state.service === 'move' && INCLUDED_IN_MOVE.includes(i.value);
      i.disabled = included;
      i.checked = included || state.extras.includes(i.value);
      i.closest('.extra').classList.toggle('is-included', included);
    });
  }

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-inc], [data-dec]');
    if (!btn) return;
    const key = btn.closest('[data-stepper]').dataset.stepper;
    const [lo, hi] = BOUNDS[key];
    state[key] = Math.min(hi, Math.max(lo, state[key] + (btn.hasAttribute('data-inc') ? 1 : -1)));
    // Keep focus usable when a button disables itself at a bound.
    if (btn.disabled || state[key] === lo || state[key] === hi) requestAnimationFrame(() => { if (btn.disabled) btn.parentElement.querySelector('button:not(:disabled)')?.focus(); });
    update({ estimate: true });
  });

  form.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'service') state.service = t.value;
    if (t.name === 'extras') state.extras = $$('input[name="extras"]:checked:not(:disabled)').map((i) => i.value)
      .concat(state.service === 'move' ? state.extras.filter((k) => INCLUDED_IN_MOVE.includes(k)) : []);
    if (t.name === 'slot') { state.slot = t.value; clearError('slot'); }
    update({ estimate: t.name === 'service' || t.name === 'extras' });
  });

  // --- step 2: calendar -----------------------------------------------------
  const grid = $('[data-cal-grid]');
  const monthLabel = $('[data-cal-month]');
  const prevBtn = $('[data-cal-prev]');
  const nextMonthBtn = $('[data-cal-next]');
  const slotWrap = $('[data-slots]');

  function renderCalendar(focus = false) {
    monthLabel.textContent = fmtMonth.format(view);
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    prevBtn.disabled = first <= new Date(firstBookable.getFullYear(), firstBookable.getMonth(), 1);
    nextMonthBtn.disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > lastBookable;

    if (focusDate.getMonth() !== view.getMonth() || focusDate.getFullYear() !== view.getFullYear()) {
      const days = [];
      for (let d = first; d.getMonth() === view.getMonth(); d = addDays(d, 1)) days.push(d);
      focusDate = (state.date && days.find((d) => sameDay(d, state.date)))
        || days.find((d) => dayStatus(d) === 'open') || days[0];
    }

    const lead = weekIndex(first); // Saturday-first
    let d = addDays(first, -lead);
    const rows = [];
    while (rows.length < 6) {
      const cells = [];
      for (let i = 0; i < 7; i++, d = addDays(d, 1)) {
        if (d.getMonth() !== view.getMonth()) { cells.push('<td role="gridcell" class="cal__pad"></td>'); continue; }
        const st = dayStatus(d);
        const sel = sameDay(d, state.date);
        const label = `${fmtLong.format(d)}، ${{ open: 'متوفر', full: 'محجوز بالكامل', closed: 'عطلة', past: 'مو متاح' }[st]}${sel ? '، مختار' : ''}`;
        cells.push(`<td role="gridcell"${sel ? ' aria-selected="true"' : ''}><button type="button" lang="ar-IQ"
          class="cal__day is-${st}${sel ? ' is-selected' : ''}" data-date="${iso(d)}"
          tabindex="${sameDay(d, focusDate) ? 0 : -1}" aria-label="${label}"
          ${st !== 'open' ? 'aria-disabled="true"' : ''}${sameDay(d, today) ? ' aria-current="date"' : ''}>${num.format(d.getDate())}</button></td>`);
      }
      rows.push(`<tr role="row">${cells.join('')}</tr>`);
      if (d.getMonth() !== view.getMonth()) break;
    }
    grid.innerHTML = rows.join('');
    if (focus) $('[tabindex="0"]', grid)?.focus();
  }

  function selectDate(d) {
    if (dayStatus(d) !== 'open') return;
    const prevSlot = state.slot;
    state.date = d;
    focusDate = d;
    clearError('date');
    const slots = slotsFor(d);
    const free = slots.filter((s) => s.free).length;
    let msg = `اخترت ${fmtDay.format(d)}. ${free === 0 ? 'ماكو أوقات وصول متوفرة' : free === 1 ? 'اكو وقت وصول واحد متوفر' : free === 2 ? 'اكو وقتين وصول متوفرين' : `اكو ${num.format(free)} أوقات وصول متوفرة`}.`;
    if (prevSlot && !slots.find((s) => s.t === prevSlot && s.free)) {
      state.slot = null;
      msg += ` ${to12h(prevSlot)} مو متوفر بذاك اليوم. اختار وقت ثاني.`;
    }
    renderCalendar(true);
    update();
    announce(msg);
  }

  function renderSlots() {
    if (!state.date) {
      slotWrap.innerHTML = `<p class="slots__empty">${slotWrap.dataset.empty}</p>`;
      return;
    }
    const { hours } = quote();
    const slots = slotsFor(state.date);
    slotWrap.innerHTML = `<fieldset class="slots__set"><legend class="slots__legend">${slotWrap.dataset.legend} · ${fmtShort.format(state.date)}</legend>
      <div class="slots__grid">${slots.map((s) => `<label class="slot${s.free ? '' : ' is-taken'}">
        <input type="radio" name="slot" value="${s.t}"${s.free ? '' : ' disabled'}${state.slot === s.t ? ' checked' : ''}>
        <span class="slot__time">${to12h(s.t)}</span>
        <span class="slot__meta">${s.free ? `يخلص بحدود ${to12h(addHours(s.t, hours + 0.5))}` : 'محجوز'}</span>
      </label>`).join('')}</div>
      <p class="slots__note">${slotWrap.dataset.note}</p></fieldset>`;
  }

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-date]');
    if (btn) selectDate(fromIso(btn.dataset.date));
  });
  grid.addEventListener('keydown', (e) => {
    const btn = e.target.closest('[data-date]');
    if (!btn) return;
    const d = fromIso(btn.dataset.date);
    const dow = weekIndex(d);
    const fwd = isRtl() ? -1 : 1; // in RTL the next day is to the left
    const sameDayOfMonth = (offset) => {
      const t = new Date(d.getFullYear(), d.getMonth() + offset, 1);
      const len = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
      return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), len));
    };
    const moves = {
      ArrowLeft: () => addDays(d, -fwd), ArrowRight: () => addDays(d, fwd),
      ArrowUp: () => addDays(d, -7), ArrowDown: () => addDays(d, 7),
      Home: () => addDays(d, -dow), End: () => addDays(d, 6 - dow),
      PageUp: () => sameDayOfMonth(-1), PageDown: () => sameDayOfMonth(1),
    };
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDate(d); return; }
    if (!moves[e.key]) return;
    e.preventDefault();
    let target = moves[e.key]();
    const minNav = new Date(today.getFullYear(), today.getMonth(), 1);
    if (target < minNav) target = minNav;
    if (target > lastBookable) target = lastBookable;
    focusDate = target;
    const monthChanged = target.getMonth() !== view.getMonth();
    view = new Date(target.getFullYear(), target.getMonth(), 1);
    renderCalendar(true);
    if (monthChanged) announce(fmtMonth.format(view));
  });
  const shiftMonth = (n) => {
    view = new Date(view.getFullYear(), view.getMonth() + n, 1);
    renderCalendar();
    announce(fmtMonth.format(view));
  };
  prevBtn.addEventListener('click', () => shiftMonth(-1));
  nextMonthBtn.addEventListener('click', () => shiftMonth(1));

  // --- step 3: details ------------------------------------------------------
  const RULES = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    phone: (v) => { const n = toLatinDigits(v).replace(/[\s()+.-]/g, ''); return /^\d{10,15}$/.test(n); },
    address: (v) => v.trim().length >= 5,
    notes: (v) => v.length <= 500,
  };
  const fields = () => $$('[data-step="3"] [data-field]');

  function validateField(input) {
    const ok = RULES[input.name](input.value);
    const err = $(`#err-${input.name}`);
    input.setAttribute('aria-invalid', String(!ok));
    err.hidden = ok;
    const ids = (input.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== err.id);
    if (!ok) ids.push(err.id);
    input.setAttribute('aria-describedby', ids.join(' '));
    return ok;
  }
  fields().forEach((input) => {
    input.addEventListener('blur', () => {
      if (input.value || input.getAttribute('aria-invalid') === 'true') validateField(input);
    });
    input.addEventListener('input', () => {
      state.contact[input.name] = input.value;
      if (input.getAttribute('aria-invalid') === 'true') { validateField(input); refreshErrorSummary(); }
      if (input.name === 'notes') {
        const left = 500 - input.value.length;
        const c = $('[data-notes-count]');
        c.textContent = `باقيلك ${num.format(left)} حرف`;
        c.hidden = left > 50;
      }
      if (input.name === 'address') renderSummary();
      save();
    });
  });

  // --- errors ---------------------------------------------------------------
  const clearError = (key) => { const el = $(`#err-${key}`); if (el) el.hidden = true; };
  const showError = (key) => { const el = $(`#err-${key}`); el.hidden = false; return el; };

  function errorSummaryFor(step) { return $(`[data-step="${step}"] [data-error-summary]`); }
  function refreshErrorSummary() {
    const box = errorSummaryFor(3);
    if (box.hidden) return;
    const bad = fields().filter((i) => i.getAttribute('aria-invalid') === 'true');
    if (!bad.length) { box.hidden = true; return; }
    box.querySelector('ul').innerHTML = bad.map((i) => `<li><a href="#${i.id}">${$(`#err-${i.name}`).textContent}</a></li>`).join('');
  }
  root.addEventListener('click', (e) => {
    const a = e.target.closest('[data-error-summary] a');
    if (!a) return;
    e.preventDefault();
    $(a.getAttribute('href'))?.focus();
  });

  function validateStep(n) {
    if (n === 2) {
      if (!state.date) { showError('date'); $('[tabindex="0"]', grid)?.focus(); return false; }
      if (!state.slot) { showError('slot'); ($('input[name="slot"]:not(:disabled)', slotWrap))?.focus(); return false; }
    }
    if (n === 3) {
      const bad = fields().filter((i) => !validateField(i));
      const box = errorSummaryFor(3);
      box.hidden = !bad.length;
      if (bad.length) { refreshErrorSummary(); box.focus(); return false; }
    }
    return true;
  }

  // --- summary --------------------------------------------------------------
  let lastTotal = null;
  function renderSummary() {
    const q = quote();
    const s = SERVICES[state.service];
    const set = (k, v) => $$(`[data-sum="${k}"]`).forEach((el) => { el.textContent = v; });
    const extras = state.extras.filter((k) => !(state.service === 'move' && INCLUDED_IN_MOVE.includes(k)));
    set('service', s.name);
    set('size', sizeLabel(state.bedrooms, state.bathrooms));
    set('extras', [
      ...(state.service === 'move' ? ['الفرن والثلاجة مشمولين'] : []),
      ...extras.map((k) => EXTRAS[k].name),
    ].join('، ') || 'ماكو');
    set('when', state.date ? `${fmtShort.format(state.date)}${state.slot ? ' · ' + to12h(state.slot) : ''}` : 'بعدك ما اخترت');
    set('team', `بحدود ${fmtHours(q.hours)} · ${fmtTeam(q.team)}`);
    set('address', state.contact.address?.trim() || 'بعده ما انضاف');
    set('total', money.format(q.price));
    if (lastTotal !== null && lastTotal !== q.price) {
      $$('[data-sum="total"]').forEach((el) => { el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); });
    }
    lastTotal = q.price;
    $$('[data-edit]').forEach((b) => { b.hidden = Number(b.dataset.edit) >= state.step || state.step === 4; });
  }

  function update({ estimate = false } = {}) {
    renderStep1();
    if (state.step === 2) renderSlots();
    renderSummary();
    if (estimate) {
      const q = quote();
      announce(`المجموع التقريبي ${money.format(q.price)}، بحدود ${fmtHours(q.hours)}.`, 600);
    }
    save();
  }

  // --- navigation -----------------------------------------------------------
  const progress = $$('[data-progress] li');
  function goTo(n, { focus = true } = {}) {
    state.step = n;
    steps.forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
    progress.forEach((li, i) => {
      const k = i + 1;
      li.classList.toggle('is-done', k < n);
      li.classList.toggle('is-current', k === n);
      if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      const b = li.querySelector('button');
      b.disabled = !(k < n && n !== 4);
    });
    root.dataset.step = n;
    backBtn.hidden = n === 1;
    $('[data-actions]').hidden = n === 4;
    nextBtn.textContent = nextBtn.dataset[`label${n}`] || '';
    if (n === 2) { renderCalendar(); renderSlots(); }
    renderSummary();
    if (focus) {
      const top = root.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.5) root.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      $('[data-step-heading]', steps[n - 1])?.focus({ preventScroll: true });
    }
    save();
  }

  // Next is a submit button, so Enter in a field and a click share this one path.
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (nextBtn.getAttribute('aria-busy') === 'true') return;
    if (!validateStep(state.step)) return;
    if (state.step < 3) { goTo(state.step + 1); return; }
    // Simulated submit. An email starting with "fail@" exercises the error path.
    const alert = $('[data-submit-error]');
    alert.hidden = true;
    nextBtn.setAttribute('aria-busy', 'true');
    nextBtn.setAttribute('aria-disabled', 'true');
    nextBtn.textContent = nextBtn.dataset.loading;
    await new Promise((r) => setTimeout(r, 900));
    nextBtn.removeAttribute('aria-busy');
    nextBtn.removeAttribute('aria-disabled');
    nextBtn.textContent = nextBtn.dataset.label3;
    if (/^fail@/i.test(state.contact.email || '')) { alert.hidden = false; alert.focus(); return; }
    confirmBooking();
  });
  backBtn.addEventListener('click', () => goTo(Math.max(1, state.step - 1)));
  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-goto], [data-edit]');
    if (!b) return;
    goTo(Number(b.dataset.goto || b.dataset.edit));
  });

  // --- step 4 ---------------------------------------------------------------
  function makeRef(d) {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    const tail = [...bytes].map((b) => REF_ALPHABET[b % REF_ALPHABET.length]).join('');
    return `AK-${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${tail}`;
  }

  function confirmBooking() {
    ref = makeRef(state.date);
    const s = SERVICES[state.service];
    const fill = (k, v) => $$(`[data-confirm="${k}"]`).forEach((el) => { el.textContent = v; });
    fill('first', (state.contact.name || '').trim().split(/\s+/)[0]);
    fill('service', s.name);
    fill('when', fmtDay.format(state.date));
    fill('time', to12h(state.slot));
    fill('email', state.contact.email.trim());
    fill('ref', ref);
    lastIcs = buildIcs();
    goTo(4);
    try { sessionStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
  }

  function buildIcs() {
    const s = SERVICES[state.service];
    const { hours, price } = quote();
    const [h, m] = state.slot.split(':').map(Number);
    const start = new Date(state.date); start.setHours(h, m);
    const end = new Date(start.getTime() + (hours + 0.5) * 3600e3);
    const local = (d) => `${iso(d).replace(/-/g, '')}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const utc = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const esc = (v) => String(v).replace(/[\\;,]/g, (c) => '\\' + c).replace(/\r?\n/g, '\\n');
    const fold = (line) => {
      const out = [];
      let rest = line;
      while (new TextEncoder().encode(rest).length > 75) {
        let cut = 75;
        while (new TextEncoder().encode(rest.slice(0, cut)).length > 75) cut--;
        out.push(rest.slice(0, cut));
        rest = ' ' + rest.slice(cut);
      }
      out.push(rest);
      return out.join('\r\n');
    };
    const extras = effectiveExtras().map((k) => EXTRAS[k].name).join('، ') || 'ماكو';
    const notes = state.contact.notes?.trim();
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Alikhtiar Alawal//Booking//EN', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${ref}@alikhtiar-alawal.example`,
      `DTSTAMP:${utc}`,
      `DTSTART:${local(start)}`,
      `DTEND:${local(end)}`,
      `SUMMARY:${esc(`${BRAND}: ${s.name}`)}`,
      `LOCATION:${esc(state.contact.address.trim())}`,
      `DESCRIPTION:${esc(`الحجز ${ref}\nالإضافات: ${extras}\nالمجموع التقريبي: ${money.format(price)}${notes ? `\nملاحظات: ${notes}` : ''}`)}`,
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`فريق ${BRAND} جايكم باچر`)}`, 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR', '',
    ].map(fold).join('\r\n');
  }

  $('[data-ics]').addEventListener('click', () => {
    if (!lastIcs) return;
    const url = URL.createObjectURL(new Blob([lastIcs], { type: 'text/calendar;charset=utf-8' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `alikhtiar-alawal-${ref}.ics` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('[data-copy-ref]').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try { await navigator.clipboard.writeText(ref); } catch { return; }
    const label = btn.textContent;
    btn.textContent = 'تم النسخ';
    announce('نسخنا رقم الحجز.');
    setTimeout(() => { btn.textContent = label; }, 2000);
  });
  $('[data-restart]').addEventListener('click', () => {
    state = DEFAULTS();
    form.reset();
    fields().forEach((i) => i.removeAttribute('aria-invalid'));
    $$('.field__error, [data-error-summary]').forEach((el) => { el.hidden = true; });
    update();
    goTo(1);
  });

  // --- mobile summary toggle --------------------------------------------------
  const sumToggle = $('[data-summary-toggle]');
  const setSummaryOpen = (open) => {
    sumToggle.setAttribute('aria-expanded', String(open));
    summary.classList.toggle('is-open', open);
  };
  sumToggle.addEventListener('click', () => setSummaryOpen(sumToggle.getAttribute('aria-expanded') !== 'true'));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && summary.classList.contains('is-open')) { setSummaryOpen(false); sumToggle.focus(); }
  });

  // --- preselection from service cards / case studies elsewhere on the page ---
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-service]');
    if (!a || !SERVICES[a.dataset.service]) return;
    state.service = a.dataset.service;
    if (state.step === 4) state = { ...DEFAULTS(), service: a.dataset.service };
    update();
    goTo(1, { focus: false });
    announce(`اخترت ${SERVICES[state.service].name}.`);
  });

  // --- boot -----------------------------------------------------------------
  restore();
  if (state.date) { view = new Date(state.date.getFullYear(), state.date.getMonth(), 1); focusDate = state.date; }
  fields().forEach((i) => { if (state.contact[i.name]) i.value = state.contact[i.name]; });
  update();
  goTo(state.step, { focus: false });
  root.classList.add('is-ready');
  document.documentElement.classList.add('booking-ready');
}

// Exposed for the hero "next available" chip.
export function nextAvailable() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= BOOK_AHEAD_DAYS; i++) {
    const d = addDays(today, i);
    const k = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) % 13;
    if (d.getDay() !== CLOSED_DAY && k !== 0 && k !== 5) return fmtShort.format(d);
  }
  return null;
}
