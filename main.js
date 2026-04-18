/* ============================================================
   VOLTPILE CLONE — main.js
   Replicates: GSAP ScrollSmoother, ticker animations,
   nav theme switching, hero stack entrance, scramble text,
   scroll-triggered reveals
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ─── 1. GSAP PLUGINS REGISTER ───────────────────────────────
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin);

  // ─── 2. SCROLLSMOOTHER (smooth scroll) ───────────────────────
  let smoother;
  const isMobile = window.innerWidth <= 640;
  const hasWrapper = !!document.getElementById('smooth-wrapper');
  if (ScrollSmoother && !isMobile && hasWrapper) {
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      smoothTouch: 0.1,
      effects: true,
    });
  }

  // ─── 3. HERO STACK ENTRANCE ANIMATION ────────────────────────
  // Battery stack fades up on page load
  const heroStack = document.getElementById('hero-stack');
  if (heroStack) {
    gsap.to(heroStack, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3
    });
  }

  // ─── 4. INFINITE TICKER ANIMATIONS ───────────────────────────
  // Replicates original ticker.js logic exactly
  const tickers = document.querySelectorAll('.ticker-flex');

  tickers.forEach((ticker) => {
    // Get total width of original items
    const items = Array.from(ticker.children);
    let totalWidth = 0;
    items.forEach(item => { totalWidth += item.offsetWidth; });

    // Clone all items for seamless loop
    items.forEach(item => {
      const clone = item.cloneNode(true);
      ticker.appendChild(clone);
    });

    // Set explicit width
    ticker.style.width = (totalWidth * 2) + 'px';

    // GSAP infinite scroll — 60s duration matching original
    gsap.to(ticker, {
      x: -totalWidth,
      duration: 60,
      ease: 'none',
      repeat: -1
    });
  });

  // ─── 5. NAV THEME SWITCHER ────────────────────────────────────
  // Dynamically switches nav between light/dark based on current section
  const nav = document.getElementById('main-nav');
  const sections = document.querySelectorAll('[navtype]');
  const btnParents = nav ? nav.querySelectorAll('.primary-cta-nav') : [];
  const btnTexts = nav ? nav.querySelectorAll('.ctatext') : [];
  const menuNavCtas = nav ? nav.querySelectorAll('.menu-nav-cta') : [];
  const menuBtTexts = nav ? nav.querySelectorAll('.menu-bt-text') : [];

  function removeThemeClasses(els, light, dark) {
    els.forEach(el => el.classList.remove(light, dark));
  }
  function addThemeClass(els, cls) {
    els.forEach(el => el.classList.add(cls));
  }

  function updateNavTheme() {
    if (!nav) return;
    const navHeight = nav.offsetHeight;
    let applied = false;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= navHeight && rect.bottom > navHeight) {
        const theme = section.getAttribute('navtype');

        removeThemeClasses(btnParents, 'primary-nav-light', 'primary-nav-dark');
        removeThemeClasses(btnTexts, 'nav-ctatext-light', 'nav-ctatext-dark');
        removeThemeClasses(menuNavCtas, 'menu-nav-cta-light', 'menu-nav-cta-dark');
        removeThemeClasses(menuBtTexts, 'menu-bt-text-light', 'menu-bt-text-dark');
        nav.classList.remove('is-light', 'is-dark');

        addThemeClass(btnParents, `primary-nav-${theme}`);
        addThemeClass(btnTexts, `nav-ctatext-${theme}`);
        addThemeClass(menuNavCtas, `menu-nav-cta-${theme}`);
        addThemeClass(menuBtTexts, `menu-bt-text-${theme}`);
        nav.classList.add(`is-${theme}`);

        // Update logo color
        const navLogo = nav.querySelector('.nav-logo');
        if (navLogo) {
          navLogo.style.color = theme === 'dark' ? 'var(--dark)' : 'var(--white)';
        }

        applied = true;
      }
    });

    if (!applied) {
      removeThemeClasses(btnParents, 'primary-nav-light', 'primary-nav-dark');
      addThemeClass(btnParents, 'primary-nav-light');
    }
  }

  // Run on scroll (works with ScrollSmoother via ScrollTrigger)
  window.addEventListener('scroll', updateNavTheme);
  ScrollTrigger.addEventListener('refresh', updateNavTheme);
  updateNavTheme();

  // ─── 6. MOBILE MENU TOGGLE ───────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const navOverlay = document.getElementById('nav-overlay');
  const closeNav = document.getElementById('close-nav');

  if (menuToggle && navOverlay) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      navOverlay.classList.add('open');
      // Pause scroll
      if (smoother) smoother.paused(true);
    });
  }
  if (closeNav && navOverlay) {
    closeNav.addEventListener('click', (e) => {
      e.preventDefault();
      navOverlay.classList.remove('open');
      if (smoother) smoother.paused(false);
    });
  }
  // Close on nav link click
  document.querySelectorAll('.nav-open-link').forEach(link => {
    link.addEventListener('click', () => {
      navOverlay.classList.remove('open');
      if (smoother) smoother.paused(false);
    });
  });

  // ─── 7. SCROLL-TRIGGERED ENTRANCE ANIMATIONS ─────────────────
  // Fade-up reveals for sections — matching original Webflow IX2 triggers

  // Hero title
  gsap.from('.hero-title', {
    opacity: 0, y: 20, duration: 1, ease: 'power2.out', delay: 0.1
  });

  // Section headings — fade up on enter
  gsap.utils.toArray('.expressive-big span').forEach((span, i) => {
    gsap.from(span, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: {
        trigger: span,
        start: 'top 90%',
        once: true
      }
    });
  });

  // Title reveal for key headings
  gsap.utils.toArray('.title-small, .title-huge, .title-medium').forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
    });
  });

  // Bento cards stagger
  gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
      delay: i * 0.12,
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 80%',
        once: true
      }
    });
  });

  // Stats cards stagger
  gsap.utils.toArray('.stat-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      scale: 0.97,
      duration: 0.8,
      ease: 'power3.out',
      delay: i * 0.1,
      scrollTrigger: {
        trigger: '.stats-cards-wrapper',
        start: 'top 80%',
        once: true
      }
    });
  });

  // Solid state section image: clip reveal from bottom + parallax (PAGMADRE style)
  gsap.fromTo('.solidstate-img',
    { clipPath: 'inset(18% 0 0 0)', scale: 1.07, y: 50 },
    {
      clipPath: 'inset(0% 0 0 0)',
      scale: 1,
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.solidstate-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );

  // Car image: autocomplete reveal on scroll (clip-path builds from bottom as user scrolls in)
  gsap.fromTo('.car-wrapper',
    { clipPath: 'inset(35% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      ease: 'none',
      scrollTrigger: {
        trigger: '.problem-p2-section',
        start: 'top 85%',
        end: 'center 30%',
        scrub: 1.2
      }
    }
  );

  // Car image: parallax movement layered on top of the reveal
  gsap.fromTo('.car-image',
    { y: 60, scale: 1.06 },
    {
      y: -60,
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.problem-p2-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );

  // ─── 8. SCRAMBLE TEXT on stat figures ─────────────────────────
  // Matching original ScrambleTextPlugin usage
  gsap.utils.toArray('.figure-big').forEach((el) => {
    const originalText = el.textContent;
    gsap.to(el, {
      duration: 1.5,
      scrambleText: {
        text: originalText,
        chars: '0123456789.',
        speed: 0.2,
        revealDelay: 0.75
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        once: true
      }
    });
  });

  // ─── 9. FOOTER LOGO SCROLL REVEAL ────────────────────────────
  // The footer section scrolls up revealing the big green logo
  const footerInner = document.querySelector('.footer-inner');
  if (footerInner) {
    gsap.from(footerInner, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer-section',
        start: 'top 85%',
        once: true
      }
    });
  }

  // ─── 10. POINT WRAPPERS STAGGER ───────────────────────────────
  gsap.utils.toArray('.point-wrapper').forEach((pw, i) => {
    gsap.from(pw, {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: 'power3.out',
      delay: i * 0.15,
      scrollTrigger: {
        trigger: '.all-points-wrapper',
        start: 'top 80%',
        once: true
      }
    });
  });

  // ─── 11. PROBLEM SECTION transition line animation ────────────
  gsap.to('.progress-line', {
    scaleX: 1,
    transformOrigin: 'left',
    ease: 'none',
    scrollTrigger: {
      trigger: '.problem-grid-wrapper',
      start: 'top 80%',
      end: 'bottom 40%',
      scrub: true
    }
  });

  // ─── 12. EXTRA SCROLL IMAGE EFFECTS (PAGMADRE style) ─────────

  // Hero ticket area: entrance fade-up on load
  gsap.fromTo('.hero-ticket-area',
    { y: 70, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.3, ease: 'power3.out', delay: 0.6 }
  );

  // Problem p1 background image: parallax zoom (scale + y move, image is separate from text)
  gsap.fromTo('.problem-bg-img',
    { scale: 1.12, y: '0%' },
    {
      scale: 1,
      y: '-8%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.problem-p1-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );

  // Difference section battery stack: entrance from below
  gsap.fromTo('.hero-stack-img',
    { y: 100, opacity: 0, scale: 0.94 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.difference-section',
        start: 'top 70%',
        once: true
      }
    }
  );

  // Bento card images: scale-settle reveal on scroll
  gsap.utils.toArray('.bento-card img, .card-image-edge img').forEach(img => {
    gsap.fromTo(img,
      { scale: 1.12, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: img.closest('.bento-card') || img,
          start: 'top 82%',
          once: true
        }
      }
    );
  });

  // Platform image: slide in from the right edge
  gsap.fromTo('.platform-img',
    { x: 80, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.no-padding-card',
        start: 'top 82%',
        once: true
      }
    }
  );

  // Climate section: subtle parallax on background
  gsap.fromTo('.climate-bg-image',
    { scale: 1.08, y: 40 },
    {
      scale: 1,
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.climate-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );

  // ─── 13. SIGNUP FORM HANDLER ──────────────────────────────────
  window.handleSignup = function() {
    const email = document.getElementById('signup-email');
    if (email && email.value && email.value.includes('@')) {
      const wrapper = email.parentElement;
      wrapper.innerHTML = '<div style="color:#FF8C00;font-size:18px;font-weight:600;">Gracias por formar parte de esta comunidad.</div>';
    } else {
      if (email) email.style.borderColor = '#ff4f4f';
    }
  };

  // ─── 14. REFRESH SCROLLTRIGGER ────────────────────────────────
  // Needed after images load to recalculate positions
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

});
