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
  initQuoteCtas();
  initFlightFields();
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

  // Mobile browsers only allow autoplay for muted, inline videos. Set these
  // as properties as well as attributes so iOS/Android always honour them.
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  const tryPlay = () => {
    if (!video.paused) return;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked (e.g. Low Power Mode): the poster stays visible and
        // playback is retried on the next user gesture below.
      });
    }
  };

  tryPlay();
  video.addEventListener('loadeddata', tryPlay);
  video.addEventListener('canplay', tryPlay);

  // Retry on first interaction (touch / scroll / click) if autoplay was blocked
  ['touchstart', 'touchend', 'pointerdown', 'click', 'scroll', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, tryPlay, { passive: true });
  });

  // Resume when returning to the tab / restoring from background
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
  window.addEventListener('pageshow', tryPlay);

  // Keep looping even if the browser ignores the loop attribute
  video.addEventListener('ended', () => {
    video.currentTime = 0;
    tryPlay();
  });

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

  document.querySelectorAll('.drawer-cta').forEach((cta) => {
    cta.addEventListener('click', closeDrawer);
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
        serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setTimeout(() => {
        if (nameInput) nameInput.focus({ preventScroll: true });
      }, 450);
    });
  });
}

/**
 * 4b. "Request a Quote" CTAs (header + drawer) -> scroll to the form and focus it
 */
function initQuoteCtas() {
  const ctas = document.querySelectorAll('[data-quote-cta]');
  const nameInput = document.getElementById('lead-name');
  if (!ctas.length) return;

  ctas.forEach((cta) => {
    cta.addEventListener('click', () => {
      setTimeout(() => {
        if (nameInput) nameInput.focus({ preventScroll: true });
      }, 600);
    });
  });
}

/**
 * 4c. Flight fields: show for Flights / Full Package, hide return date for one-way,
 *     and keep the calendar pickers consistent (no past dates, return >= departure)
 */
function initFlightFields() {
  const serviceSelect = document.getElementById('lead-service');
  const flightFields = document.getElementById('flight-fields');
  const returnGroup = document.getElementById('return-date-group');
  const departInput = document.getElementById('lead-depart');
  const returnInput = document.getElementById('lead-return');
  const tripRadios = document.querySelectorAll('input[name="tripType"]');

  if (!serviceSelect || !flightFields || !departInput || !returnInput) return;

  const toISODate = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const today = toISODate(new Date());
  departInput.min = today;
  returnInput.min = today;

  const isOneWay = () => {
    const checked = document.querySelector('input[name="tripType"]:checked');
    return !flightFields.hidden && checked && checked.value === 'One way';
  };

  const sync = () => {
    const showFlight = ['Flights', 'Full Package'].includes(serviceSelect.value);
    flightFields.hidden = !showFlight;

    const oneWay = isOneWay();
    if (returnGroup) returnGroup.hidden = oneWay;
    if (oneWay) returnInput.value = '';
  };

  const syncReturnMin = () => {
    returnInput.min = departInput.value || today;
    if (returnInput.value && returnInput.value < returnInput.min) {
      returnInput.value = returnInput.min;
    }
  };

  serviceSelect.addEventListener('change', sync);
  tripRadios.forEach((r) => r.addEventListener('change', sync));
  departInput.addEventListener('change', syncReturnMin);

  // Open the native calendar on click/focus where supported
  [departInput, returnInput].forEach((input) => {
    input.addEventListener('click', () => {
      if (typeof input.showPicker === 'function') {
        try { input.showPicker(); } catch (_) { /* ignore */ }
      }
    });
  });

  sync();
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
    const notes = document.getElementById('lead-notes')?.value.trim() || '';

    if (!name || !phone) {
      return;
    }

    const formatDate = (iso) => {
      if (!iso) return '';
      const d = new Date(`${iso}T00:00:00`);
      return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const showFlight = ['Flights', 'Full Package'].includes(service);
    const tripType = showFlight ? (document.querySelector('input[name="tripType"]:checked')?.value || 'Round trip') : '';
    const departDate = formatDate(document.getElementById('lead-depart')?.value);
    const returnDate = tripType === 'One way' ? '' : formatDate(document.getElementById('lead-return')?.value);

    let dates = 'Flexible / To be confirmed';
    if (departDate && returnDate) dates = `${departDate} → ${returnDate}`;
    else if (departDate) dates = `${departDate}${tripType === 'One way' ? ' (one way)' : ''}`;
    else if (returnDate) dates = `Return: ${returnDate}`;

    const messageLines = [
      `Hello *Marsham Tourism*! 👋`,
      `I would like to request a travel quote / consultation:`,
      ``,
      `• *Name:* ${name}`,
      `• *Phone / WhatsApp:* ${phone}`,
      `• *Service Needed:* ${service}`
    ];

    if (showFlight) {
      const from = document.getElementById('lead-from')?.value.trim();
      const to = document.getElementById('lead-to')?.value.trim();
      const airline = document.getElementById('lead-airline')?.value.trim();
      const baggage = document.getElementById('lead-baggage')?.value || 'None';
      const meals = document.querySelector('input[name="meals"]:checked')?.value || 'No';

      messageLines.push(`• *Trip Type:* ${tripType}`);
      if (from || to) messageLines.push(`• *Route:* ${from || '—'} → ${to || '—'}`);
      if (airline) messageLines.push(`• *Preferred Airline:* ${airline}`);
      messageLines.push(`• *Baggage:* ${baggage}`);
      messageLines.push(`• *Meals Included:* ${meals}`);
    }

    messageLines.push(`• *Travel Dates:* ${dates}`);

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
