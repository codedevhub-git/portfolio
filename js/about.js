/* ============================================
   ABOUT PAGE SCRIPT
   Purpose: Client-side logic for about.html
   ============================================ */

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize about page
 */
function initAbout() {
  // Add loaded class
  const container = document.querySelector('.about-container');
  if (container) {
    setTimeout(() => {
      container.classList.add('loaded');
    }, 100);
  }

  // Initialize animated counters
  initCounters();

  // Log console message
  logAboutMessage();
}

/* ============================================
   ANIMATED COUNTERS
   ============================================ */

/**
 * Initialize animated stat counters
 */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/**
 * Animate counter to target value
 * @param {HTMLElement} element - Counter element
 */
function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (easeOutQuart)
    const easeProgress = 1 - Math.pow(1 - progress, 4);
    
    const currentValue = Math.floor(easeProgress * target);
    
    // Format large numbers with commas
    element.textContent = formatNumber(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = formatNumber(target);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* ============================================
   TERMINAL ANIMATION
   ============================================ */

/**
 * Initialize terminal typing animation
 */
function initTerminalAnimation() {
  const terminalLines = document.querySelectorAll('.terminal-line');
  
  terminalLines.forEach((line, index) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
      line.style.transition = 'all 0.3s ease';
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, index * 100);
  });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        
        // Special handling for terminal
        if (entry.target.classList.contains('why-me-section')) {
          setTimeout(() => {
            initTerminalAnimation();
          }, 300);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================
   STACK BADGE INTERACTIONS
   ============================================ */

/**
 * Initialize stack badge hover effects
 */
function initStackBadges() {
  const badges = document.querySelectorAll('.stack-badge');
  
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      const stackName = badge.querySelector('.stack-name').textContent;
      console.log(`Tech: ${stackName}`);
    });
  });
}

/* ============================================
   PHILOSOPHY CARD TRACKING
   ============================================ */

/**
 * Initialize philosophy card tracking
 */
function initPhilosophyTracking() {
  const cards = document.querySelectorAll('.philosophy-card');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.philosophy-title').textContent;
      console.log(`Philosophy clicked: ${title}`);
      
      // Visual feedback
      card.style.animation = 'pulse 0.3s ease';
      setTimeout(() => {
        card.style.animation = '';
      }, 300);
    });
  });
}

/* ============================================
   CONSOLE MESSAGE
   ============================================ */

/**
 * Log about page message
 */
function logAboutMessage() {
  const styles = {
    title: 'color: #7ee787; font-family: monospace; font-size: 18px; font-weight: bold;',
    info: 'color: #8b949e; font-family: monospace; font-size: 12px;',
    value: 'color: #58a6ff; font-family: monospace; font-size: 12px;'
  };

  console.log('%c> ABOUT EDGAR', styles.title);
  console.log('%cLocation: Lancaster, SC → Charlotte, NC', styles.info);
  console.log('%cReach: Clients across USA', styles.info);
  console.log('%cStack: Node.js + Express + MongoDB + EJS', styles.value);
  console.log('%cMission: Real code. Real results. No BS.', styles.value);
}

/* ============================================
   PULSE ANIMATION (for cards)
   ============================================ */

/**
 * Add pulse animation CSS if not exists
 */
function addPulseAnimation() {
  if (!document.querySelector('style[data-pulse]')) {
    const style = document.createElement('style');
    style.setAttribute('data-pulse', '');
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================
   INITIALIZATION ON DOM LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initAbout();
  initScrollAnimations();
  initStackBadges();
  initPhilosophyTracking();
  addPulseAnimation();
});

/* ============================================
   WINDOW LOAD EVENT
   ============================================ */

window.addEventListener('load', () => {
  console.log('%c✓ About page loaded', 'color: #7ee787; font-family: monospace;');
});