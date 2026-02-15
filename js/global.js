 
/* ============================================
   GLOBAL JAVASCRIPT
   Purpose: Core utilities used across all pages
   ============================================ */

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: success, error, warning
 * @param {number} duration - Duration in ms (default: 3000)
 */
function showToast(message, type = 'success', duration = 3000) {
  // Create toast container if doesn't exist
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  // Add to container
  container.appendChild(toast);

  // Close button handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });

  // Auto remove after duration
  setTimeout(() => {
    removeToast(toast);
  }, duration);
}

/**
 * Remove toast notification
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
  toast.style.animation = 'fadeOut 0.3s ease';
  setTimeout(() => {
    toast.remove();
  }, 300);
}

/* ============================================
   LOADING OVERLAY
   ============================================ */

/**
 * Show loading overlay
 */
function showLoading() {
  let overlay = document.querySelector('.loading-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(overlay);
  }
  
  // Force reflow
  overlay.offsetHeight;
  overlay.classList.add('active');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

/* ============================================
   LANGUAGE SWITCHING
   ============================================ */

/**
 * Get current language from URL
 * @returns {string} - 'en' or 'es'
 */
function getCurrentLanguage() {
  const path = window.location.pathname;
  return path.includes('/es/') ? 'es' : 'en';
}

/**
 * Switch language
 * @param {string} lang - Target language ('en' or 'es')
 */
function switchLanguage(lang) {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  if (lang === 'es') {
    // Switch to Spanish
    window.location.href = `/es/${currentPage}`;
  } else {
    // Switch to English
    window.location.href = `/${currentPage}`;
  }
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

/**
 * Smooth scroll to element
 * @param {string} elementId - ID of element to scroll to
 */
function smoothScroll(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/* ============================================
   COPY TO CLIPBOARD
   ============================================ */

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @param {string} successMessage - Message to show on success
 */
async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage, 'success');
  } catch (error) {
    console.error('Failed to copy:', error);
    showToast('Failed to copy', 'error');
  }
}

/* ============================================
   DEBOUNCE & THROTTLE
   ============================================ */

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} - Throttled function
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ============================================
   MOBILE DETECTION
   ============================================ */

/**
 * Check if mobile device
 * @returns {boolean} - True if mobile
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if touch device
 * @returns {boolean} - True if touch device
 */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/* ============================================
   LOCAL STORAGE HELPERS
   ============================================ */

/**
 * Save to localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('localStorage save failed:', error);
  }
}

/**
 * Get from localStorage with error handling
 * @param {string} key - Storage key
 * @returns {*} - Stored value or null
 */
function getFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('localStorage get failed:', error);
    return null;
  }
}

/**
 * Remove from localStorage
 * @param {string} key - Storage key
 */
function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('localStorage remove failed:', error);
  }
}

/* ============================================
   ANIMATION OBSERVER (Intersection Observer)
   ============================================ */

/**
 * Initialize animation observer for fade-in effects
 */
function initAnimationObserver() {
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

  // Observe all elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================
   WHATSAPP LINK GENERATOR
   ============================================ */

/**
 * Generate WhatsApp link with pre-filled message
 * @param {string} phone - Phone number (international format)
 * @param {string} message - Pre-filled message
 * @returns {string} - WhatsApp URL
 */
function generateWhatsAppLink(phone, message = '') {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}${message ? '?text=' + encodedMessage : ''}`;
}

/* ============================================
   INITIALIZATION
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize animation observer
  initAnimationObserver();
  
  // Set up language toggle buttons
  const langButtons = document.querySelectorAll('[data-lang]');
  langButtons.forEach(btn => {
    const lang = btn.dataset.lang;
    const currentLang = getCurrentLanguage();
    
    // Mark active language
    if (lang === currentLang) {
      btn.classList.add('active');
    }
    
    // Add click handler
    btn.addEventListener('click', () => {
      switchLanguage(lang);
    });
  });
  
  // Log console message (GitHub style)
  console.log('%c> EDGAR_ROBLEDO', 'color: #7ee787; font-family: monospace; font-size: 16px; font-weight: bold;');
  console.log('%c// Full-Stack Web Developer', 'color: #8b949e; font-family: monospace; font-size: 14px;');
  console.log('%cBuilt with Node.js, Express, MongoDB, EJS', 'color: #58a6ff; font-family: monospace; font-size: 12px;');
});

/* ============================================
   ERROR HANDLING
   ============================================ */

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  hideLoading();
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  hideLoading();
});