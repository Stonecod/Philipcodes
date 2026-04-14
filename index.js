/**
 * Philip Balogun — Portfolio  |  index.js
 *
 * Sections:
 *  1. Theme (persist to localStorage)
 *  2. Mobile Menu
 *  3. Scroll: nav shrink + active link (ScrollSpy)
 *  4. Scroll Reveal (IntersectionObserver)
 *  5. Testimonial Slider + dots
 *  6. WhatsApp Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Cached DOM references ─────────────────────────────── */
  const body        = document.body;
  const themeBtn    = document.getElementById('theme-toggle');
  const navPill     = document.querySelector('.nav-container');
  const menuOpen    = document.getElementById('menu-open');
  const menuClose   = document.getElementById('menu-close');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu-overlay a');
  const slider      = document.getElementById('testimonial-slider');
  const nextBtn     = document.getElementById('next-btn');
  const prevBtn     = document.getElementById('prev-btn');
  const dotsWrap    = document.getElementById('slider-dots');
  const form        = document.getElementById('whatsappForm');
  const sections    = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.nav-menu a');


  /* ── 1. THEME ──────────────────────────────────────────── */
  const applyTheme = (theme) => {
    body.className = `${theme}-theme`;
    localStorage.setItem('theme', theme);
  };

  // Restore saved theme — default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeBtn?.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-theme');
    applyTheme(isDark ? 'light' : 'dark');
  });


  /* ── 2. MOBILE MENU ────────────────────────────────────── */
  const openMobileMenu = () => {
    mobileMenu.classList.add('active');
    menuOpen.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    menuOpen.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  };

  menuOpen?.addEventListener('click', openMobileMenu);
  menuClose?.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
      closeMobileMenu();
    }
  });


  /* ── 3. SCROLL: NAV SHRINK + SCROLLSPY ─────────────────── */
  const handleScroll = () => {
    // Slightly compact the nav pill after scrolling
    const scrolled = window.scrollY > 80;
    navPill?.style.setProperty('max-width', scrolled ? '820px' : '980px');
    navPill?.style.setProperty('padding', scrolled ? '0.45rem 1.1rem' : '0.6rem 1.25rem');

    // Highlight active nav link based on scroll position
    let currentId = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ── 4. SCROLL REVEAL ──────────────────────────────────── */
  // Selectively apply reveal — exclude hero elements (they use CSS animations)
  const revealTargets = [
    '.about-grid > *',
    '.bento-card',
    '.testimonial-card',
    '.contact-box',
    '.work .section-header',
    '.testimonials .section-header',
    '.about .section-label',
    '.stat-item',
  ];

  const revealEls = document.querySelectorAll(revealTargets.join(', '));
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 55);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));


  /* ── 5. TESTIMONIAL SLIDER ──────────────────────────────── */
  if (slider && nextBtn && prevBtn && dotsWrap) {
    const cards = slider.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let current = 0;

    // Build indicator dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const updateDots = (index) => {
      dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    const goTo = (index) => {
      current = ((index % total) + total) % total; // wrap around
      slider.scrollTo({ left: current * slider.offsetWidth, behavior: 'smooth' });
      updateDots(current);
    };

    nextBtn.addEventListener('click', () => goTo(current + 1));
    prevBtn.addEventListener('click', () => goTo(current - 1));

    // Sync dots when user manually swipes
    let scrollTimer;
    slider.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const idx = Math.round(slider.scrollLeft / slider.offsetWidth);
        if (idx !== current) {
          current = idx;
          updateDots(current);
        }
      }, 80);
    }, { passive: true });
  }


  /* ── 6. CONTACT FORM (FORMSUBMIT) ──────────────────────── */
  if (form) {
    const submitBtn = form.querySelector('.submit-btn');
    const btnText   = form.querySelector('.btn-text');

    form.addEventListener('submit', () => {
      // Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending…';
    });
  }

});