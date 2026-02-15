/* ============================================
   SERVICES PAGE SCRIPT
   Purpose: Client-side logic for services.html
   ============================================ */

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize services page
 */
function initServices() {
  // Add loaded class for fade-in animation
  const container = document.querySelector('.services-container');
  if (container) {
    setTimeout(() => {
      container.classList.add('loaded');
    }, 100);
  }

  // Initialize service card interactions
  initServiceCardInteractions();

  // Initialize pricing hover effects
  initPricingEffects();

  // Track service interest
  initServiceTracking();

  // Log console message
  logServicesMessage();
}

/* ============================================
   SERVICE CARD INTERACTIONS
   ============================================ */

/**
 * Initialize service card interactions
 */
function initServiceCardInteractions() {
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    // Add hover tracking
    card.addEventListener('mouseenter', () => {
      const serviceName = card.querySelector('.service-name').textContent;
      console.log(`Viewing service: ${serviceName}`);
    });

    // Track "See Examples" clicks
    const exampleLink = card.querySelector('a[href*="projects"]');
    if (exampleLink) {
      exampleLink.addEventListener('click', (e) => {
        const serviceName = card.querySelector('.service-name').textContent;
        console.log(`Clicked "See Examples" for: ${serviceName}`);
      });
    }
  });
}

/* ============================================
   PRICING EFFECTS
   ============================================ */

/**
 * Initialize pricing hover effects
 */
function initPricingEffects() {
  const priceRanges = document.querySelectorAll('.price-range');

  priceRanges.forEach(priceEl => {
    const card = priceEl.closest('.service-card');
    
    card.addEventListener('mouseenter', () => {
      priceEl.style.transform = 'scale(1.05)';
      priceEl.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', () => {
      priceEl.style.transform = 'scale(1)';
    });
  });
}

/* ============================================
   SERVICE TRACKING
   ============================================ */

/**
 * Initialize service interest tracking
 */
function initServiceTracking() {
  // Track "Text for Quote" button clicks
  const quoteButtons = document.querySelectorAll('.service-actions .btn-primary');

  quoteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.service-card');
      const serviceName = card.querySelector('.service-name').textContent;
      
      console.log(`Requesting quote for: ${serviceName}`);
      
      // Save to localStorage
      saveToLocalStorage('last_service_inquiry', {
        service: serviceName,
        timestamp: new Date().toISOString()
      });

      // Track in session
      incrementServiceViews(serviceName);
    });
  });
}

/**
 * Increment service views counter
 * @param {string} serviceName - Name of service
 */
function incrementServiceViews(serviceName) {
  const views = getFromLocalStorage('service_views') || {};
  views[serviceName] = (views[serviceName] || 0) + 1;
  saveToLocalStorage('service_views', views);
}

/**
 * Get most viewed services
 * @returns {Array} - Sorted array of services by views
 */
function getMostViewedServices() {
  const views = getFromLocalStorage('service_views') || {};
  return Object.entries(views)
    .sort((a, b) => b[1] - a[1])
    .map(([service, count]) => ({ service, count }));
}

/* ============================================
   FEATURE EXPANSION
   ============================================ */

/**
 * Initialize feature list expansion (for mobile)
 */
function initFeatureExpansion() {
  const featureLists = document.querySelectorAll('.features-list');

  featureLists.forEach(list => {
    const items = list.querySelectorAll('li');
    
    if (items.length > 5 && isMobile()) {
      // Hide items beyond 5 initially
      items.forEach((item, index) => {
        if (index >= 5) {
          item.style.display = 'none';
        }
      });

      // Add "Show More" button
      const showMoreBtn = document.createElement('button');
      showMoreBtn.textContent = 'Show More';
      showMoreBtn.className = 'btn btn-secondary btn-small';
      showMoreBtn.style.marginTop = 'var(--spacing-sm)';
      
      list.parentElement.appendChild(showMoreBtn);

      let expanded = false;
      showMoreBtn.addEventListener('click', () => {
        expanded = !expanded;
        
        items.forEach((item, index) => {
          if (index >= 5) {
            item.style.display = expanded ? 'block' : 'none';
          }
        });

        showMoreBtn.textContent = expanded ? 'Show Less' : 'Show More';
      });
    }
  });
}

/* ============================================
   PRICE CALCULATOR (Optional Enhancement)
   ============================================ */

/**
 * Calculate estimated price based on features
 * @param {Array} features - Selected features
 * @returns {Object} - Price estimate
 */
function calculateEstimate(features) {
  // Base prices for each service type
  const basePrices = {
    'Online Presence': 800,
    'Lead Generation': 1200,
    'Internal Tools': 2000,
    'Customer Platforms': 2500,
    'Community & Resources': 3000,
    'Custom Development': 0 // Custom pricing
  };

  // Feature multipliers
  const featureMultipliers = {
    'bilingual': 1.2,
    'payment': 1.3,
    'ai': 1.5,
    'auth': 1.2,
    'analytics': 1.1
  };

  // Calculate estimate (not used currently, but available)
  let estimate = 0;
  
  return {
    min: estimate,
    max: estimate * 1.5,
    note: 'Estimate - final price depends on scope'
  };
}

/* ============================================
   COMPARISON MODE
   ============================================ */

/**
 * Initialize service comparison mode
 */
function initComparisonMode() {
  let selectedServices = [];
  const compareBtn = document.createElement('button');
  compareBtn.textContent = 'Compare Selected';
  compareBtn.className = 'btn btn-primary';
  compareBtn.style.position = 'fixed';
  compareBtn.style.bottom = '20px';
  compareBtn.style.right = '20px';
  compareBtn.style.display = 'none';
  compareBtn.style.zIndex = '1000';
  
  document.body.appendChild(compareBtn);

  const cards = document.querySelectorAll('.service-card');
  
  cards.forEach(card => {
    // Add checkbox for comparison
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'comparison-checkbox';
    checkbox.style.position = 'absolute';
    checkbox.style.top = '20px';
    checkbox.style.right = '20px';
    checkbox.style.display = 'none'; // Hidden by default
    
    card.style.position = 'relative';
    card.appendChild(checkbox);

    checkbox.addEventListener('change', (e) => {
      const serviceName = card.querySelector('.service-name').textContent;
      
      if (e.target.checked) {
        selectedServices.push(serviceName);
      } else {
        selectedServices = selectedServices.filter(s => s !== serviceName);
      }

      compareBtn.style.display = selectedServices.length >= 2 ? 'block' : 'none';
    });
  });

  compareBtn.addEventListener('click', () => {
    showComparisonModal(selectedServices);
  });
}

/**
 * Show comparison modal
 * @param {Array} services - Selected services to compare
 */
function showComparisonModal(services) {
  console.log('Comparing services:', services);
  showToast(`Comparing ${services.length} services`, 'success');
  // Modal implementation would go here
}

/* ============================================
   SCROLL PROGRESS INDICATOR
   ============================================ */

/**
 * Initialize scroll progress indicator
 */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
    z-index: 9999;
    transition: width 0.1s ease;
  `;
  
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', throttle(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / scrollHeight) * 100;
    
    progressBar.style.width = `${progress}%`;
  }, 100));
}

/* ============================================
   CONSOLE MESSAGE
   ============================================ */

/**
 * Log services page message to console
 */
function logServicesMessage() {
  const styles = {
    title: 'color: #7ee787; font-family: monospace; font-size: 18px; font-weight: bold;',
    info: 'color: #8b949e; font-family: monospace; font-size: 12px;',
    pricing: 'color: #ffa657; font-family: monospace; font-size: 12px;'
  };

  console.log('%c> SERVICES', styles.title);
  console.log('%c6 service categories available', styles.info);
  console.log('%cPricing ranges from $800 to $10,000+', styles.pricing);
  console.log('%cText for custom quote: +1-803-209-7750', styles.pricing);
}

/* ============================================
   ANALYTICS
   ============================================ */

/**
 * Log page analytics
 */
function logPageAnalytics() {
  const analytics = {
    page: 'services',
    timestamp: new Date().toISOString(),
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`
  };

  console.log('Page Analytics:', analytics);
  
  // Could send to analytics service here
  // saveToLocalStorage('page_analytics', analytics);
}

/* ============================================
   INITIALIZATION ON DOM LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initServices();
  initScrollProgress();
  logPageAnalytics();
  
  // Optional: Enable comparison mode
  // initComparisonMode();
  
  // Optional: Enable feature expansion for mobile
  // initFeatureExpansion();
});

/* ============================================
   WINDOW LOAD EVENT
   ============================================ */

window.addEventListener('load', () => {
  console.log('%c✓ Services page loaded', 'color: #7ee787; font-family: monospace;');
  
  // Log most viewed services
  const mostViewed = getMostViewedServices();
  if (mostViewed.length > 0) {
    console.log('Most viewed services:', mostViewed);
  }
});