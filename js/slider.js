// Before/after comparison slider + case-study tabs (docs/ux-spec.md §4).
// Value = share of the "before" image shown, from the left.

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pct = (n) => new Intl.NumberFormat('ar-IQ', { style: 'percent' }).format(n / 100);

export function initSliders(root = document) {
  root.querySelectorAll('[data-ba]').forEach(setupSlider);
  root.querySelectorAll('[data-tabs]').forEach(setupTabs);
}

function setupSlider(el) {
  const handle = el.querySelector('.ba__handle');
  let pos = 50;
  let dragging = false;
  let touched = false;
  let frame = 0;

  const set = (v) => {
    pos = Math.max(0, Math.min(100, v));
    el.style.setProperty('--pos', pos + '%');
    el.dataset.edge = pos < 12 ? 'after' : pos > 88 ? 'before' : '';
    const n = Math.round(pos);
    handle.setAttribute('aria-valuenow', n);
    handle.setAttribute('aria-valuetext',
      n === 100 ? 'تبين صورة قبل بس' : n === 0 ? 'تبين صورة بعد بس' : `${pct(n)} قبل، ${pct(100 - n)} بعد`);
  };
  // The value counts from the inline-start edge: the left in LTR, the right in RTL.
  const rtl = () => getComputedStyle(el).direction === 'rtl';
  const fromEvent = (e) => {
    const r = el.getBoundingClientRect();
    return ((rtl() ? r.right - e.clientX : e.clientX - r.left) / r.width) * 100;
  };

  el.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    touched = true;
    el.classList.remove('is-hinting');
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
    if (e.pointerType !== 'touch') { e.preventDefault(); handle.focus({ preventScroll: true }); }
    set(fromEvent(e));
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => set(fromEvent(e)));
  });
  const end = () => { dragging = false; el.classList.remove('is-dragging'); };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);

  handle.addEventListener('keydown', (e) => {
    const toward = rtl() ? -5 : 5; // the arrow key that points at the "after" side grows "before"
    const map = { ArrowLeft: pos - toward, ArrowDown: pos - 5, ArrowRight: pos + toward, ArrowUp: pos + 5,
      PageDown: pos - 20, PageUp: pos + 20, Home: 0, End: 100 };
    if (!(e.key in map)) return;
    e.preventDefault();
    touched = true;
    set(map[e.key]);
  });

  set(pos);

  // One-time nudge so people discover the slider is draggable.
  if (!reducedMotion() && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || touched) return;
      io.disconnect();
      el.classList.add('is-hinting');
      el.addEventListener('animationend', () => el.classList.remove('is-hinting'), { once: true });
    }, { threshold: 0.5 });
    io.observe(el);
  }
}

function setupTabs(list) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const indicator = list.querySelector('.tabs__indicator');
  const panelOf = (t) => document.getElementById(t.getAttribute('aria-controls'));

  const place = () => {
    const t = tabs.find((x) => x.getAttribute('aria-selected') === 'true');
    if (!t || !indicator) return;
    indicator.style.setProperty('--ind-x', t.offsetLeft + 'px');
    indicator.style.setProperty('--ind-w', t.offsetWidth + 'px');
  };
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panelOf(t).hidden = !on;
    });
    place();
    if (focus) {
      tab.focus();
      tab.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  };
  // Warm the image cache for a case before it's opened.
  const preload = (t) => panelOf(t).querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('pointerenter', () => preload(tab));
    tab.addEventListener('focus', () => preload(tab));
    tab.addEventListener('keydown', (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true); // automatic activation
    });
  });

  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0], false);
  addEventListener('resize', place, { passive: true });
  document.fonts?.ready.then(place);
}
