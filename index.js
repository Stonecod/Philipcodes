/**
 * Philip Balogun — Portfolio  |  index.js
 * Clean, well-structured, and beginner-friendly.
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

  // Restore saved theme (default: dark)
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
    body.style.overflow = 'hidden'; // prevent scroll behind overlay
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('active');
    menuOpen.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  };

  menuOpen?.addEventListener('click', openMobileMenu);
  menuClose?.addEventListener('click', closeMobileMenu);

  // Close when any link inside the mobile menu is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
      closeMobileMenu();
    }
  });


  /* ── 3. SCROLL: NAV SHRINK + SCROLLSPY ─────────────────── */
  const handleScroll = () => {
    // Shrink nav pill on scroll
    if (window.scrollY > 80) {
      navPill?.style.setProperty('max-width', '820px');
      navPill?.style.setProperty('padding', '0.5rem 1.1rem');
    } else {
      navPill?.style.setProperty('max-width', '1000px');
      navPill?.style.setProperty('padding', '0.65rem 1.4rem');
    }

    // ScrollSpy — highlight active nav link
    let currentId = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 180) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ── 4. SCROLL REVEAL ──────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.about-grid, .bento-card, .testimonials .section-label, ' +
    '.contact-box, .skills-box, .stat-item, .section-label'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Slight stagger for grouped elements
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 5. TESTIMONIAL SLIDER ──────────────────────────────── */
  if (slider && nextBtn && prevBtn) {
    const cards = slider.querySelectorAll('.testimonial-card');
    const total = cards.length;
    let current = 0;

    // Build dots
    if (dotsWrap) {
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }

    const updateDots = (index) => {
      dotsWrap?.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    const goTo = (index) => {
      current = Math.max(0, Math.min(index, total - 1));
      slider.scrollTo({ left: current * slider.offsetWidth, behavior: 'smooth' });
      updateDots(current);
    };

    nextBtn.addEventListener('click', () => goTo(current + 1 >= total ? 0 : current + 1));
    prevBtn.addEventListener('click', () => goTo(current - 1 < 0 ? total - 1 : current - 1));

    // Sync dots when user swipes/scrolls manually
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


  /* ── 6. WHATSAPP FORM ───────────────────────────────────── */
  if (form) {
    const submitBtn  = form.querySelector('.submit-btn');
    const btnText    = form.querySelector('.btn-text');
    const PHONE      = '2349124270924';

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = document.getElementById('name')?.value.trim();
      const biz     = document.getElementById('business')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      // Basic guard
      if (!name || !message) return;

      // Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Opening WhatsApp…';

      const text = [
        '*New Project Inquiry* 🚀',
        '',
        `*Name:* ${name}`,
        `*Project Type:* ${biz || 'Not specified'}`,
        `*Message:* ${message}`,
      ].join('\n');

      const url = `https://wa.me/${2349124270924}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');

      form.reset();

      // Reset button after a short delay
      setTimeout(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send via WhatsApp';
      }, 3000);
    });
  }

});