/* ============================================================
   js/nav.js — Shared nav/footer behaviour for inner pages
   (No Three.js / GSAP dependency)
   ============================================================ */
(function () {
  'use strict';

  const EASE = 'cubic-bezier(0.22,1,0.36,1)';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Footer year ─────────────────────────────────────────── */
  const fy = document.getElementById('footer-year');
  if (fy) fy.textContent = new Date().getFullYear();

  /* ── Scroll progress bar ─────────────────────────────────── */
  const bar = document.getElementById('scroll-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max > 0) bar.style.width = (Math.min(window.scrollY / max, 1) * 100) + '%';
    }, { passive: true });
  }

  /* ── Nav — always solid on inner pages ───────────────────── */
  const nav = document.getElementById('site-nav');
  if (nav) nav.classList.add('scrolled');

  /* ── Mobile hamburger ────────────────────────────────────── */
  const burger  = document.getElementById('nav-burger');
  const navList = document.getElementById('nav-list');
  if (burger && navList) {
    burger.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    navList.querySelectorAll('.nav-a').forEach(a => {
      a.addEventListener('click', () => {
        navList.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Metric counter animation ────────────────────────────── */
  function runCounter(el) {
    const raw = el.dataset.target || el.textContent.trim();
    if (!el.dataset.target) el.dataset.target = raw;
    const match = raw.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (!match) return;
    const end    = parseFloat(match[1]);
    const suffix = match[2];
    const isFloat = match[1].includes('.');
    const dur = 1300;
    const t0  = performance.now();
    (function tick(now) {
      const p     = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (isFloat ? (end * eased).toFixed(1) : Math.round(end * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  /* ── Stagger helper — hide grid children before reveal ───── */
  const STAGGER_Q = [
    '.metrics-grid > *',
    '.challenge-grid > *',
    '.feature-grid > *',
    '.skills-grid > *',
    '.proj-grid > *',
    '.ux-grid > *',
    '.ux-process-grid > *',
  ].join(', ');

  const GRID_PARENTS = [
    '.metrics-grid',
    '.challenge-grid',
    '.feature-grid',
    '.skills-grid',
    '.proj-grid',
    '.ux-grid',
    '.ux-process-grid',
  ].join(', ');

  if (!reduced) {
    document.querySelectorAll(STAGGER_Q).forEach(child => {
      child.style.opacity   = '0';
      child.style.transform = 'translateY(16px)';
      child.style.transition = `opacity 0.55s ${EASE}, transform 0.55s ${EASE}`;
    });
  }

  /* ── Scroll reveal + stagger + counters ──────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduced) {
      reveals.forEach(el => el.classList.add('visible'));
      document.querySelectorAll('.metric-num').forEach(runCounter);
    } else {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add('visible');
          obs.unobserve(el);

          /* Stagger grid children inside this reveal */
          el.querySelectorAll(GRID_PARENTS).forEach(grid => {
            [...grid.children].forEach((child, i) => {
              setTimeout(() => {
                child.style.opacity   = '';
                child.style.transform = '';
                /* Clear inline transition once done so CSS hover works cleanly */
                setTimeout(() => { child.style.transition = ''; }, 650);
              }, 60 + i * 90);
            });
          });

          /* Counter animation for metric numbers */
          el.querySelectorAll('.metric-num').forEach((num, i) => {
            setTimeout(() => runCounter(num), 160 + i * 90);
          });
        });
      }, { threshold: 0.1 });
      reveals.forEach(el => obs.observe(el));
    }
  }

  /* ── Category filter (projects.html) ─────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        document.querySelectorAll('.proj-cat').forEach(sec => {
          sec.style.display = (cat === 'all' || sec.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  }

})();
