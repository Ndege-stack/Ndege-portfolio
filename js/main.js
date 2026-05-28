/* ============================================================
   js/main.js — Philip Ndege Portfolio
   Three.js + GSAP ScrollTrigger
   ============================================================ */

(function () {
  'use strict';

  /* ── WebGL availability check ─────────────────────────── */
  function hasWebGL() {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const webgl   = hasWebGL();

  /* ── Hero canvas (Three.js) ───────────────────────────── */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    if (!webgl) { canvas.style.display = 'none'; return; }

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x08080f, 1);

    const matBase  = new THREE.LineBasicMaterial({ color: 0xe8a94d, transparent: true });

    const geoFns = [
      () => new THREE.IcosahedronGeometry(Math.random() * 0.22 + 0.18, 0),
      () => new THREE.OctahedronGeometry(Math.random() * 0.22 + 0.18, 0),
      () => new THREE.TorusGeometry(Math.random() * 0.18 + 0.16, 0.055, 6, 8),
      () => new THREE.BoxGeometry(0.3 + Math.random() * 0.25, 0.3 + Math.random() * 0.25, 0.3 + Math.random() * 0.25),
    ];

    const shapes = [];
    for (let i = 0; i < 22; i++) {
      const geo   = geoFns[i % geoFns.length]();
      const edges = new THREE.EdgesGeometry(geo);
      const mat   = matBase.clone();
      mat.opacity = 0.12 + Math.random() * 0.28;
      const mesh  = new THREE.LineSegments(edges, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 3 - 1
      );
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      scene.add(mesh);
      shapes.push({
        mesh,
        rx:    (Math.random() - 0.5) * 0.007,
        ry:    (Math.random() - 0.5) * 0.009,
        drift: Math.random() * 0.35 + 0.18,
        phase: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
      });
    }

    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => {
      mx = (e.clientX / innerWidth  - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    });

    (function tick() {
      requestAnimationFrame(tick);
      const t = Date.now() * 0.001;
      shapes.forEach(s => {
        s.mesh.rotation.x += s.rx;
        s.mesh.rotation.y += s.ry;
        s.mesh.position.y = s.baseY + Math.sin(t * s.drift + s.phase) * 0.2;
      });
      camera.position.x += (mx * 0.45 - camera.position.x) * 0.022;
      camera.position.y += (-my * 0.28 - camera.position.y) * 0.022;
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    });
  }

  /* ── Cube canvas (About section) ──────────────────────── */
  function initCubeCanvas() {
    const canvas = document.getElementById('cube-canvas');
    if (!canvas) return;
    if (!webgl) { canvas.style.display = 'none'; return; }

    const parent   = canvas.parentElement;
    const W        = parent.offsetWidth  || 500;
    const H        = parent.offsetHeight || 500;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(48, W / H, 0.1, 50);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x090912, 1);

    const mkBox = (size, opacity) => {
      const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size));
      const mat   = new THREE.LineBasicMaterial({ color: 0xe8a94d, transparent: true, opacity });
      return new THREE.LineSegments(edges, mat);
    };

    const outer = mkBox(1.5, 0.72);
    const inner = mkBox(0.75, 0.2);
    scene.add(outer, inner);

    (function tick() {
      requestAnimationFrame(tick);
      outer.rotation.x += 0.004;
      outer.rotation.y += 0.007;
      inner.rotation.x -= 0.006;
      inner.rotation.y += 0.01;
      renderer.render(scene, camera);
    })();

    new ResizeObserver(() => {
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }).observe(parent);
  }

  /* ── Hero letter assembly (GSAP) ─────────────────────── */
  function initHeroAnim() {
    const letters = document.querySelectorAll('.nl');
    if (!letters.length) return;

    if (reduced) {
      letters.forEach(el => { el.style.opacity = '1'; });
      document.querySelectorAll('.hero-eyebrow, .hero-bio, .hero-ctas')
        .forEach(el => el.style.opacity = '1');
      return;
    }

    letters.forEach(el => {
      gsap.set(el, {
        z: +el.dataset.dz, x: +el.dataset.dx, y: +el.dataset.dy,
        opacity: 0, rotationX: 18, force3D: true,
      });
    });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.hero-eyebrow', { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);

    letters.forEach((el, i) => {
      tl.to(el, {
        z: 0, x: 0, y: 0, opacity: 1, rotationX: 0,
        duration: 0.85, ease: 'power3.out',
      }, 0.08 + i * 0.058);
    });

    tl.to('.hero-bio',  { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.35');
    tl.to('.hero-ctas', { opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.4');
  }

  /* ── Projects 3D deck ─────────────────────────────────── */
  function initProjectsDeck() {
    const stage = document.getElementById('pstage');
    const navEl = document.getElementById('pstage-nav');
    if (!stage || !navEl) return;

    const cards = Array.from(stage.querySelectorAll('.pcard'));
    const N     = cards.length;
    let active  = 0;
    let autoTimer;

    /* Deck positions: index 0 = active, 1 = peeking behind, 2+ = hidden */
    const DECK = [
      { z:   0, scale: 1,    opacity: 1,    rotationX: 0 },
      { z: -80, scale: 0.95, opacity: 0.38, rotationX: 2 },
      { z:-150, scale: 0.90, opacity: 0,    rotationX: 4 },
      { z:-200, scale: 0.86, opacity: 0,    rotationX: 5 },
    ];

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'psnav-dot';
      dot.setAttribute('aria-label', `View project ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      navEl.appendChild(dot);
    });

    function goTo(idx, animate = true) {
      active = ((idx % N) + N) % N;

      cards.forEach((card, i) => {
        const relPos = ((i - active) + N) % N;
        const pos    = DECK[relPos] || DECK[DECK.length - 1];
        const cfg    = {
          xPercent: -50, yPercent: -50,
          z: pos.z, scale: pos.scale,
          opacity: pos.opacity, rotationX: pos.rotationX,
          overwrite: true,
        };

        if (animate) {
          gsap.to(card, { ...cfg, duration: 0.62, ease: 'power3.out' });
        } else {
          gsap.set(card, cfg);
        }

        card.classList.toggle('is-active', relPos === 0);
        card.style.pointerEvents = relPos === 0 ? 'auto' : 'none';
        card.style.zIndex = String(N - relPos);
      });

      navEl.querySelectorAll('.psnav-dot').forEach((dot, j) => {
        dot.classList.toggle('active', j === active);
      });
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(active + 1), 4400);
    }

    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (i !== active) { goTo(i); resetAuto(); }
      });
    });

    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); resetAuto(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(active - 1); resetAuto(); }
    });

    goTo(0, false);  /* instant initial positioning — no animation flash */
    resetAuto();
  }

  /* ── Testimonials 3D carousel ─────────────────────────── */
  function initTestimonials() {
    const track  = document.getElementById('tcarousel');
    const dotsEl = document.getElementById('tdots');
    const prev   = document.getElementById('tprev');
    const next   = document.getElementById('tnext');
    if (!track || !dotsEl) return;

    const cards  = Array.from(track.querySelectorAll('.tcard'));
    const N      = cards.length;
    const step   = 360 / N;
    const radius = 330;
    let current  = 0;
    let autoTimer;

    cards.forEach((card, i) => {
      card.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'tdot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsEl.appendChild(dot);
    });

    function goTo(idx) {
      current = ((idx % N) + N) % N;
      track.style.transform = `rotateY(${-current * step}deg)`;
      dotsEl.querySelectorAll('.tdot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 4600);
    }

    prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    resetAuto();
  }

  /* ── Stats counter ────────────────────────────────────── */
  function initStats() {
    const nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        obs.unobserve(el);
        if (reduced) { el.textContent = target; return; }
        gsap.to({ v: 0 }, {
          v: target, duration: 1.8, ease: 'power2.out',
          onUpdate() { el.textContent = Math.ceil(this.targets()[0].v); },
        });
      });
    }, { threshold: 0.5 });

    nums.forEach(el => obs.observe(el));
  }

  /* ── Scroll reveal ────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (reduced) { els.forEach(el => el.classList.add('visible')); return; }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });

    els.forEach(el => obs.observe(el));
  }

  /* ── Navigation ───────────────────────────────────────── */
  function initNav() {
    const nav     = document.getElementById('site-nav');
    const burger  = document.getElementById('nav-burger');
    const navList = document.getElementById('nav-list');
    const links   = document.querySelectorAll('.nav-a');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    if (burger && navList) {
      burger.addEventListener('click', () => {
        const open = navList.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', String(open));
      });
      links.forEach(a => {
        a.addEventListener('click', () => {
          navList.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    const sections = Array.from(document.querySelectorAll('section[id]'));
    window.addEventListener('scroll', () => {
      let cur = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
      links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
      });
    }, { passive: true });
  }

  /* ── Scroll progress bar ──────────────────────────────── */
  function initScrollBar() {
    const bar = document.getElementById('scroll-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const max  = document.body.scrollHeight - window.innerHeight;
      bar.style.width = (Math.min(window.scrollY / max, 1) * 100) + '%';
    }, { passive: true });
  }

  /* ── Footer year ──────────────────────────────────────── */
  function initFooter() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ── INIT ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initFooter();
    initScrollBar();
    initNav();
    initHeroCanvas();
    initCubeCanvas();
    initHeroAnim();
    initProjectsDeck();
    initTestimonials();
    initStats();
    initReveal();
  });

})();
