/* ============================================
   PORTFOLIO PAGE SCRIPT
   Purpose: Client-side logic for index.ejs
   ============================================ */

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize portfolio page
 */
function initPortfolio() {
  // Add loaded class for fade-in animation
  const container = document.querySelector('.portfolio-container');
  if (container) {
    setTimeout(() => {
      container.classList.add('loaded');
    }, 100);
  }

  // Initialize card hover effects
  initCardHoverEffects();

  // Initialize contact link tracking
  initContactTracking();

  // Log welcome message
  logWelcomeMessage();
}

/* ============================================
   CARD HOVER EFFECTS
   ============================================ */

/**
 * Initialize enhanced card hover effects
 */
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.nav-card');

  cards.forEach(card => {
    // Mouse move effect - subtle tilt
    card.addEventListener('mousemove', (e) => {
      if (!isTouchDevice()) {
        handleCardTilt(card, e);
      }
    });

    // Mouse leave - reset tilt
    card.addEventListener('mouseleave', () => {
      if (!isTouchDevice()) {
        resetCardTilt(card);
      }
    });

    // Click effect
    card.addEventListener('click', (e) => {
      handleCardClick(card, e);
    });
  });
}

/**
 * Handle card tilt on mouse move
 * @param {HTMLElement} card - Card element
 * @param {MouseEvent} e - Mouse event
 */
function handleCardTilt(card, e) {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = (y - centerY) / 20;
  const rotateY = (centerX - x) / 20;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
}

/**
 * Reset card tilt
 * @param {HTMLElement} card - Card element
 */
function resetCardTilt(card) {
  card.style.transform = '';
}

/**
 * Handle card click with ripple effect
 * @param {HTMLElement} card - Card element
 * @param {MouseEvent} e - Mouse event
 */
function handleCardClick(card, e) {
  // Create ripple element
  const ripple = document.createElement('span');
  const rect = card.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  // Add ripple CSS
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(88, 166, 255, 0.4);
      transform: scale(0);
      animation: ripple-effect 0.6s ease-out;
      pointer-events: none;
    }
    @keyframes ripple-effect {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  
  if (!document.querySelector('style[data-ripple]')) {
    style.setAttribute('data-ripple', '');
    document.head.appendChild(style);
  }

  card.style.position = 'relative';
  card.style.overflow = 'hidden';
  card.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

/* ============================================
   CONTACT TRACKING
   ============================================ */

/**
 * Initialize contact link tracking
 */
function initContactTracking() {
  // Track WhatsApp clicks
  const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me"]');
  whatsappLinks.forEach(link => {
    link.addEventListener('click', () => {
      console.log('WhatsApp link clicked');
      saveToLocalStorage('contact_method_used', 'whatsapp');
    });
  });

  // Track SMS clicks
  const smsLinks = document.querySelectorAll('a[href^="sms:"]');
  smsLinks.forEach(link => {
    link.addEventListener('click', () => {
      console.log('SMS link clicked');
      saveToLocalStorage('contact_method_used', 'sms');
    });
  });

  // Track Email clicks
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', () => {
      console.log('Email link clicked');
      saveToLocalStorage('contact_method_used', 'email');
    });
  });

  // Track Social media clicks
  const socialLinks = document.querySelectorAll('.social-link');
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const platform = link.getAttribute('aria-label');
      console.log(`${platform} link clicked`);
      saveToLocalStorage('social_platform_used', platform);
    });
  });
}

/* ============================================
   KEYBOARD NAVIGATION
   ============================================ */

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Numbers 1-4 to navigate to cards
    if (e.key >= '1' && e.key <= '4') {
      const cards = document.querySelectorAll('.nav-card');
      const index = parseInt(e.key) - 1;
      if (cards[index]) {
        cards[index].click();
      }
    }

    // 'w' for WhatsApp
    if (e.key.toLowerCase() === 'w' && !e.ctrlKey && !e.metaKey) {
      const whatsappLink = document.querySelector('a[href^="https://wa.me"]');
      if (whatsappLink) {
        whatsappLink.click();
      }
    }

    // 'e' for Email
    if (e.key.toLowerCase() === 'e' && !e.ctrlKey && !e.metaKey) {
      const emailLink = document.querySelector('a[href^="mailto:"]');
      if (emailLink) {
        emailLink.click();
      }
    }
  });
}

/* ============================================
   CODE BLOCK INTERACTIONS
   ============================================ */

/**
 * Initialize code block interactions
 */
function initCodeBlockInteractions() {
  // Make code values copyable on click
  const codeValues = document.querySelectorAll('.code-value');
  
  codeValues.forEach(value => {
    // Skip links
    if (value.tagName === 'A') return;

    value.style.cursor = 'pointer';
    value.title = 'Click to copy';

    value.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = value.textContent.replace(/"/g, '');
      await copyToClipboard(text, 'Copied!');
    });
  });
}

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */

/**
 * Log page performance metrics
 */
function logPerformanceMetrics() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('%c⚡ Performance Metrics', 'color: #7ee787; font-weight: bold;');
          console.log(`DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms`);
          console.log(`Page Load: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }
      }, 0);
    });
  }
}

/* ============================================
   EASTER EGGS
   ============================================ */

/**
 * Log welcome message to console
 */
function logWelcomeMessage() {
  const styles = {
    title: 'color: #7ee787; font-family: monospace; font-size: 20px; font-weight: bold;',
    subtitle: 'color: #8b949e; font-family: monospace; font-size: 14px;',
    tech: 'color: #58a6ff; font-family: monospace; font-size: 12px;',
    contact: 'color: #ffa657; font-family: monospace; font-size: 12px;'
  };

  console.log('%c> EDGAR_ROBLEDO', styles.title);
  console.log('%c// Full-Stack Web Developer', styles.subtitle);
  console.log('%c', ''); // Empty line
  console.log('%cStack: Node.js, Express, MongoDB, EJS', styles.tech);
  console.log('%cLocation: Lancaster, SC / Charlotte, NC', styles.tech);
  console.log('%c', ''); // Empty line
  console.log('%cInterested in working together?', styles.contact);
  console.log('%cWhatsApp: +1-803-209-7750', styles.contact);
  console.log('%cEmail: edgar@codedevhub.com', styles.contact);
  console.log('%c', ''); // Empty line
  console.log('%cKeyboard shortcuts:', styles.subtitle);
  console.log('%c1-4: Navigate to sections', styles.tech);
  console.log('%cW: Open WhatsApp', styles.tech);
  console.log('%cE: Send Email', styles.tech);
}

/**
 * Konami code easter egg
 */
function initKonamiCode() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateKonamiEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

/**
 * Activate Konami code easter egg
 */
function activateKonamiEasterEgg() {
  console.log('%c🎮 KONAMI CODE ACTIVATED!', 'color: #7ee787; font-size: 24px; font-weight: bold;');
  console.log('%cYou found the secret! 🎉', 'color: #ffa657; font-size: 16px;');
  
  showToast('🎮 Konami Code Activated! You are a true developer! 🎉', 'success', 5000);
  
  // Add rainbow effect to name
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.style.animation = 'rainbow 2s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================
   SCROLL REVEAL OPTIMIZATION
   ============================================ */

/**
 * Optimize scroll reveal animations
 */
function optimizeScrollReveal() {
  // Reduce motion for users who prefer it
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }
}

/* ============================================
   PAGE VISIBILITY
   ============================================ */

/**
 * Handle page visibility changes
 */
function initPageVisibility() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('Page hidden');
    } else {
      console.log('Page visible');
    }
  });
}

/* ============================================
   INITIALIZATION ON DOM LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
  initKeyboardNavigation();
  initCodeBlockInteractions();
  initKonamiCode();
  optimizeScrollReveal();
  initPageVisibility();
  logPerformanceMetrics();
});

/* ============================================
   WINDOW LOAD EVENT
   ============================================ */

window.addEventListener('load', () => {
  // Page fully loaded
  console.log('%c✓ Portfolio loaded', 'color: #7ee787; font-family: monospace;');
});