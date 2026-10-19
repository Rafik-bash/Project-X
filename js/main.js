// Entry point. The first statement marks the page as able to run reveal
// animations; every hidden-until-revealed style is scoped under that class.
document.documentElement.classList.add('js-reveal-ready');

import { initSliders } from './slider.js';
import { initBooking, nextAvailable } from './booking.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const mqDesktop = matchMedia('(min-width: 1024px)');

// ---------- Scroll reveals & wipes ----------
function initReveals() {
  const items = $$('.reveal, .wipe');
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
  // Stagger siblings that share a parent.
  const groups = new Map();
  $$('.reveal').forEach((el) => {
    const n = groups.get(el.parentElement) || 0;
    el.style.setProperty('--i', Math.min(n, 6));
    groups.set(el.parentElement, n + 1);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });
  // Wipes start as soon as any of the image is on screen so a peeking arch never sits empty.
  const wipeIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); wipeIo.unobserve(e.target); } });
  }, { threshold: 0 });
  items.forEach((el) => (el.classList.contains('wipe') ? wipeIo : io).observe(el));
}

// ---------- Header ----------
function initHeader() {
  const header = $('[data-header]');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the section in view.
  const links = $$('.nav__list a[href^="#"]:not(.btn)');
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const a = byId.get(e.target.id);
      if (!a) return;
      if (e.isIntersecting) {
        links.forEach((l) => l.removeAttribute('aria-current'));
        a.setAttribute('aria-current', 'location');
      } else if (a.getAttribute('aria-current')) {
        a.removeAttribute('aria-current');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

// ---------- Mobile menu ----------
function initMenu() {
  const btn = $('[data-menu-btn]');
  const sheet = $('[data-nav]');
  const label = $('[data-menu-label]');
  const outside = [$('main'), $('footer')];
  const icon = btn.querySelector('use');

  const setOpen = (open, { restoreFocus = true } = {}) => {
    btn.setAttribute('aria-expanded', String(open));
    sheet.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    outside.forEach((el) => { el.inert = open; });
    label.textContent = open ? 'سكّر القائمة' : 'افتح القائمة';
    icon.setAttribute('href', open ? '#i-x' : '#i-menu');
    updateMobileBar();
    if (open) sheet.querySelector('a')?.focus();
    else if (restoreFocus) btn.focus();
  };
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a') && !mqDesktop.matches) setOpen(false, { restoreFocus: false }); });
  document.addEventListener('keydown', (e) => {
    if (btn.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    // Trap focus between the menu button and the sheet's links.
    const focusables = [btn, ...$$('a', sheet)];
    const i = focusables.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); focusables.at(-1).focus(); }
    else if (!e.shiftKey && i === focusables.length - 1) { e.preventDefault(); focusables[0].focus(); }
  });
  mqDesktop.addEventListener('change', () => { if (btn.getAttribute('aria-expanded') === 'true') setOpen(false, { restoreFocus: false }); });
}

// ---------- Sticky mobile CTA bar ----------
const barState = { heroGone: false, bookInView: false, footerInView: false, typing: false };
let bar;
function updateMobileBar() {
  if (!bar) return;
  const menuOpen = document.body.classList.contains('menu-open');
  const show = barState.heroGone && !barState.bookInView && !barState.footerInView && !barState.typing && !menuOpen;
  bar.classList.toggle('is-visible', show);
  bar.setAttribute('aria-hidden', String(!show));
  bar.querySelector('a').tabIndex = show ? 0 : -1;
}
function initMobileBar() {
  bar = $('[data-mobile-bar]');
  const watch = (el, key, opts, invert = false) => new IntersectionObserver(([e]) => {
    barState[key] = invert ? !e.isIntersecting : e.isIntersecting;
    updateMobileBar();
  }, opts).observe(el);
  watch($('#hero-cta'), 'heroGone', { threshold: 0 }, true);
  watch($('#book'), 'bookInView', { threshold: 0.15 });
  watch($('.site-footer'), 'footerInView', { threshold: 0 });
  document.addEventListener('focusin', (e) => { barState.typing = e.target.matches('input, textarea'); updateMobileBar(); });
  document.addEventListener('focusout', () => { barState.typing = false; updateMobileBar(); });
}

// ---------- Reviews "show more" on small screens ----------
function initReviews() {
  const grid = $('[data-reviews]');
  const btn = $('[data-more-reviews]');
  grid.classList.add('is-collapsed');
  btn.hidden = false;
  const sync = () => { btn.hidden = matchMedia('(min-width: 600px)').matches || !grid.classList.contains('is-collapsed'); };
  btn.addEventListener('click', () => {
    grid.classList.remove('is-collapsed');
    btn.setAttribute('aria-expanded', 'true');
    sync();
    grid.children[3]?.setAttribute('tabindex', '-1');
    grid.children[3]?.focus();
  });
  addEventListener('resize', sync, { passive: true });
  sync();
}

// ---------- FAQ: open the item named in the URL hash ----------
function initFaq() {
  const open = () => {
    const el = location.hash && document.getElementById(location.hash.slice(1));
    if (el?.tagName === 'DETAILS') { el.open = true; el.scrollIntoView({ block: 'start' }); }
  };
  addEventListener('hashchange', open);
  open();
}

// ---------- Hero "next available" chip ----------
function initNextAvailable() {
  const chip = $('[data-next-available]');
  const label = nextAvailable();
  if (!label) return;
  $('[data-next-available-date]', chip).textContent = label;
  chip.hidden = false;
}

const safely = (fn, ...args) => { try { fn(...args); } catch (err) { console.error(err); } };
safely(initReveals);
safely(initHeader);
safely(initMenu);
safely(initMobileBar);
safely(initSliders);
safely(initReviews);
safely(initFaq);
safely(initNextAvailable);
// If the booking widget throws, the phone/email fallback stays visible.
safely(initBooking, $('[data-booking]'));
