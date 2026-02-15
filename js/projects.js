/* ============================================
   PROJECTS PAGE SCRIPT
   Purpose: Client-side logic for projects.html
   ============================================ */

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize projects page
 */
function initProjects() {
  // Add loaded class
  const container = document.querySelector('.projects-container');
  if (container) {
    setTimeout(() => {
      container.classList.add('loaded');
    }, 100);
  }

  // Initialize filter system
  initFilterSystem();

  // Initialize all carousels
  initCarousels();

  // Log console message
  logProjectsMessage();
}

/* ============================================
   FILTER SYSTEM
   ============================================ */

/**
 * Initialize filter system
 */
function initFilterSystem() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter projects
      filterProjects(filter, projectCards);

      // Log filter
      console.log(`Filtering by: ${filter}`);
    });
  });
}

/**
 * Filter projects by category
 * @param {string} filter - Filter category
 * @param {NodeList} cards - Project cards
 */
function filterProjects(filter, cards) {
  cards.forEach(card => {
    const category = card.dataset.category;

    if (filter === 'all' || category === filter) {
      card.classList.remove('hidden');
      card.style.animation = 'fadeInUp 0.6s ease';
    } else {
      card.classList.add('hidden');
    }
  });
}

/* ============================================
   CAROUSEL FUNCTIONALITY
   ============================================ */

/**
 * Initialize all carousels
 */
function initCarousels() {
  const carousels = document.querySelectorAll('.project-carousel');

  carousels.forEach(carousel => {
    initCarousel(carousel);
  });
}

/**
 * Initialize single carousel
 * @param {HTMLElement} carousel - Carousel element
 */
function initCarousel(carousel) {
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.dot');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');

  let currentSlide = 0;
  let autoplayInterval;

  /**
   * Go to specific slide
   * @param {number} index - Slide index
   */
  function goToSlide(index) {
    // Remove active class from current
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Update current slide
    currentSlide = index;

    // Add active class to new
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  /**
   * Next slide
   */
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  /**
   * Previous slide
   */
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }

  /**
   * Start autoplay
   */
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  /**
   * Stop autoplay
   */
  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  // Next button
  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    startAutoplay();
  });

  // Previous button
  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
    startAutoplay();
  });

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      stopAutoplay();
      startAutoplay();
    });
  });

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Start autoplay
  startAutoplay();

  // Pause when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });
}

/* ============================================
   PROJECT CARD INTERACTIONS
   ============================================ */

/**
 * Initialize project card interactions
 */
function initProjectCardInteractions() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    // Track hover
    card.addEventListener('mouseenter', () => {
      const projectName = card.querySelector('.project-name').textContent;
      console.log(`Viewing project: ${projectName}`);
    });

    // Track "Visit Site" clicks
    const visitBtn = card.querySelector('.btn');
    visitBtn.addEventListener('click', () => {
      const projectName = card.querySelector('.project-name').textContent;
      const url = visitBtn.href;
      
      console.log(`Visiting project: ${projectName} - ${url}`);
      
      // Save to localStorage
      saveToLocalStorage('last_project_visited', {
        name: projectName,
        url: url,
        timestamp: new Date().toISOString()
      });
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
  const filterButtons = document.querySelectorAll('.filter-btn');

  document.addEventListener('keydown', (e) => {
    // Number keys 1-5 for filters
    if (e.key >= '1' && e.key <= '5') {
      const index = parseInt(e.key) - 1;
      if (filterButtons[index]) {
        filterButtons[index].click();
      }
    }
  });
}

/* ============================================
   CONSOLE MESSAGE
   ============================================ */

/**
 * Log projects page message
 */
function logProjectsMessage() {
  const styles = {
    title: 'color: #7ee787; font-family: monospace; font-size: 18px; font-weight: bold;',
    info: 'color: #8b949e; font-family: monospace; font-size: 12px;',
    project: 'color: #58a6ff; font-family: monospace; font-size: 12px;'
  };

  console.log('%c> PROJECTS', styles.title);
  console.log('%c7 projects showcased', styles.info);
  console.log('%cMost recent: Terracore Construction', styles.project);
  console.log('%cStack: Node.js, Express, MongoDB, EJS', styles.info);
}

/* ============================================
   INITIALIZATION ON DOM LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initProjects();
  initProjectCardInteractions();
  initKeyboardNavigation();
});

/* ============================================
   WINDOW LOAD EVENT
   ============================================ */

window.addEventListener('load', () => {
  console.log('%c✓ Projects page loaded', 'color: #7ee787; font-family: monospace;');
});