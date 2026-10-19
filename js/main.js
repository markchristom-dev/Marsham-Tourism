/**
 * Marsham Tourism — Core UI & Lead Capture Logic
 * Modular script: handles navigation drawer, scroll states, service pre-fill, and lead form.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initHeroVideoFallback();
  initScrollSpy();
  initServicePrefill();
  initLeadForm();
  initCurrentYear();
});

/**
 * 0. Hero Background Video & Low-Bandwidth / Power-Saving Fallback
 */
function initHeroVideoFallback() {
  const video = document.getElementById('hero-bg-video');
  if (!video) return;

  // Match the hero frame to the video's real aspect ratio so it is never cropped
  const hero = video.closest('.hero');
  const applyRatio = () => {
    if (hero && video.videoWidth && video.videoHeight) {
      hero.style.setProperty('--hero-ratio', `${video.videoWidth} / ${video.videoHeight}`);
    }
  };
  if (video.readyState >= 1) applyRatio();
  video.addEventListener('loadedmetadata', applyRatio);

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isLowBandwidth = Boolean(
    conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g')
  );

  if (isLowBandwidth) {
    video.pause();
    video.classList.add('is-fallback');
    return;
  }

  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Device is in power-saving mode or blocked autoplay; fall back cleanly to BG_2026.jpg
      video.classList.add('is-fallback');
    });
  }

  video.addEventListener('error', () => {
    video.classList.add('is-fallback');
  });
}

/**
 * 1. Sticky Header Scroll State
 */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Mobile Navigation Drawer (Accessible & Touch-Friendly)
 */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!openBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.classList.add('nav-open');
    openBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    openBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
  };

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/**
 * 3. Scroll-Spy for Active Navigation Links
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-25% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * 4. Pre-select Service in Lead Form when clicking Service / Package Cards
 */
function initServicePrefill() {
  const triggerButtons = document.querySelectorAll('[data-select-service]');
  const serviceSelect = document.getElementById('lead-service');
  const nameInput = document.getElementById('lead-name');

  if (!triggerButtons.length || !serviceSelect) return;

  triggerButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetService = btn.getAttribute('data-select-service');
      if (targetService) {
        serviceSelect.value = targetService;
      }
      setTimeout(() => {
        if (nameInput) nameInput.focus({ preventScroll: true });
      }, 450);
    });
  });
}

/**
 * 5. Direct Lead Capture Form Handler (WhatsApp + Email Fallback)
 */
function initLeadForm() {
  const form = document.getElementById('marsham-lead-form');
  const feedback = document.getElementById('lead-form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('lead-name')?.value.trim() || '';
    const phone = document.getElementById('lead-phone')?.value.trim() || '';
    const service = document.getElementById('lead-service')?.value || 'Full Package';
    const dates = document.getElementById('lead-dates')?.value.trim() || 'Flexible / To be confirmed';
    const notes = document.getElementById('lead-notes')?.value.trim() || '';

    if (!name || !phone) {
      return;
    }

    const messageLines = [
      `Hello *Marsham Tourism*! 👋`,
      `I would like to request a travel quote / consultation:`,
      ``,
      `• *Name:* ${name}`,
      `• *Phone / WhatsApp:* ${phone}`,
      `• *Service Needed:* ${service}`,
      `• *Travel Dates:* ${dates}`
    ];

    if (notes) {
      messageLines.push(`• *Additional Details:* ${notes}`);
    }

    const fullMessage = messageLines.join('\n');
    const whatsappUrl = window.MARSHAM_CONFIG
      ? window.MARSHAM_CONFIG.buildWhatsAppUrl(fullMessage)
      : `https://wa.me/971564511167?text=${encodeURIComponent(fullMessage)}`;

    const emailSubject = encodeURIComponent(`New Travel Inquiry: ${service} — ${name}`);
    const emailBody = encodeURIComponent(fullMessage.replace(/\*/g, ''));
    const mailtoUrl = `mailto:marshamtourism@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    if (feedback) {
      feedback.innerHTML = `
        Thank you, <strong>${escapeHtml(name)}</strong>! Redirecting your inquiry to our WhatsApp desk (+971 56 451 1167).
        <br><small>Prefer email? <a href="${mailtoUrl}" style="text-decoration: underline; font-weight: 700;">Click here to send via Email</a>.</small>
      `;
      feedback.classList.add('is-visible');
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}

/**
 * 6. Dynamic Footer Year
 */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Basic HTML escaping helper
 */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (char) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return map[char] || char;
  });
}
