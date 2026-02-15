/* ============================================
   STACK PAGE SCRIPT
   Purpose: Client-side logic for stack.html
   ============================================ */

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize stack page
 */
function initStack() {
  // Add loaded class
  const container = document.querySelector('.stack-container');
  if (container) {
    setTimeout(() => {
      container.classList.add('loaded');
    }, 100);
  }

  // Initialize terminal animation
  initTerminalAnimation();

  // Initialize tech card interactions
  initTechCardInteractions();

  // Log console message
  logStackMessage();
}

/* ============================================
   TERMINAL ANIMATION
   ============================================ */

/**
 * Initialize terminal typing animation
 */
function initTerminalAnimation() {
  const terminalLines = document.querySelectorAll('.terminal-line');
  
  // Animate terminal lines one by one
  terminalLines.forEach((line, index) => {
    setTimeout(() => {
      line.style.transition = 'all 0.3s ease';
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, index * 150);
  });
}

/* ============================================
   TECH CARD INTERACTIONS
   ============================================ */

/**
 * Initialize tech card interactions
 */
function initTechCardInteractions() {
  const techCards = document.querySelectorAll('.tech-card');
  
  techCards.forEach(card => {
    // Track hover
    card.addEventListener('mouseenter', () => {
      const techName = card.querySelector('.tech-name').textContent;
      const badge = card.querySelector('.tech-badge').textContent;
      console.log(`Tech: ${techName} (${badge})`);
    });

    // Click to highlight
    card.addEventListener('click', () => {
      // Remove highlight from all cards
      techCards.forEach(c => c.classList.remove('tech-selected'));
      
      // Add highlight to clicked card
      card.classList.add('tech-selected');
      
      // Log selection
      const techName = card.querySelector('.tech-name').textContent;
      console.log(`Selected: ${techName}`);
    });
  });
}

/* ============================================
   TECH CATEGORY FILTER (Optional Enhancement)
   ============================================ */

/**
 * Filter tech cards by category
 * @param {string} category - Category to filter by
 */
function filterTechByCategory(category) {
  const techCards = document.querySelectorAll('.tech-card');
  
  techCards.forEach(card => {
    const badge = card.querySelector('.tech-badge').textContent.toLowerCase();
    
    if (category === 'all' || badge === category.toLowerCase()) {
      card.style.display = 'block';
      card.style.animation = 'fadeInUp 0.6s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ============================================
   SKILL CARD INTERACTIONS
   ============================================ */

/**
 * Initialize skill card interactions
 */
function initSkillCardInteractions() {
  const skillCards = document.querySelectorAll('.skill-card');
  
  skillCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.skill-title').textContent;
      console.log(`Skill principle: ${title}`);
      
      // Visual feedback
      card.style.animation = 'pulse 0.3s ease';
      setTimeout(() => {
        card.style.animation = '';
      }, 300);
    });
  });
}

/* ============================================
   TECH BADGE CLICK TRACKING
   ============================================ */

/**
 * Track which tech categories users are interested in
 */
function initBadgeTracking() {
  const badges = document.querySelectorAll('.tech-badge');
  
  badges.forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation(); // Don't trigger card click
      
      const category = badge.textContent;
      console.log(`Interested in: ${category}`);
      
      // Save to localStorage
      const interests = getFromLocalStorage('tech_interests') || {};
      interests[category] = (interests[category] || 0) + 1;
      saveToLocalStorage('tech_interests', interests);
    });
  });
}

/* ============================================
   HIGHLIGHT AI CARDS
   ============================================ */

/**
 * Add special highlighting to AI cards
 */
function highlightAICards() {
  const aiCards = document.querySelectorAll('.tech-card.tech-highlight');
  
  // Add pulsing glow effect
  aiCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation = 'aiGlow 2s ease-in-out infinite';
    }, index * 200);
  });
}

/* ============================================
   CONSOLE MESSAGE
   ============================================ */

/**
 * Log stack page message
 */
function logStackMessage() {
  const styles = {
    title: 'color: #7ee787; font-family: monospace; font-size: 18px; font-weight: bold;',
    info: 'color: #8b949e; font-family: monospace; font-size: 12px;',
    tech: 'color: #58a6ff; font-family: monospace; font-size: 12px;',
    ai: 'color: #bc8cff; font-family: monospace; font-size: 12px; font-weight: bold;'
  };

  console.log('%c> TECH STACK', styles.title);
  console.log('%cCore: Node.js + Express + MongoDB + EJS', styles.tech);
  console.log('%cAI: Claude AI + GPT + 3D (Three.js)', styles.ai);
  console.log('%cPhilosophy: Learn what solves the problem', styles.info);
  console.log('%cLimitation: null', styles.info);
  console.log('%cAdaptability: Infinity', styles.tech);
}

/* ============================================
   ADD AI GLOW ANIMATION
   ============================================ */

/**
 * Add AI glow animation CSS
 */
function addAIGlowAnimation() {
  if (!document.querySelector('style[data-ai-glow]')) {
    const style = document.createElement('style');
    style.setAttribute('data-ai-glow', '');
    style.textContent = `
      @keyframes aiGlow {
        0%, 100% {
          box-shadow: 0 0 10px rgba(188, 140, 255, 0.3);
        }
        50% {
          box-shadow: 0 0 20px rgba(188, 140, 255, 0.6);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
      }
      
      .tech-selected {
        border-color: var(--accent-green) !important;
        box-shadow: 0 0 20px rgba(126, 231, 135, 0.4) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

/* ============================================
   SCROLL REVEAL
   ============================================ */

/**
 * Initialize scroll-based reveal animations
 */
function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================
   INITIALIZATION ON DOM LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStack();
  initScrollReveal();
  initSkillCardInteractions();
  initBadgeTracking();
  addAIGlowAnimation();
  highlightAICards();
});

/* ============================================
   WINDOW LOAD EVENT
   ============================================ */

window.addEventListener('load', () => {
  console.log('%c✓ Stack page loaded', 'color: #7ee787; font-family: monospace;');
  
  // Log tech interests if any
  const interests = getFromLocalStorage('tech_interests');
  if (interests) {
    console.log('Tech interests:', interests);
  }
});