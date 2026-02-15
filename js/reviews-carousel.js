/* ============================================
   REVIEWS CAROUSEL (CODE BLOCK STYLE)
   Purpose: Carousel for code-style reviews
   ============================================ */

let currentReviewIndex = 0;
let reviewItems = [];
let reviewDots = [];
let autoplayInterval;

/**
 * Initialize reviews carousel
 */
function initReviewsCarousel() {
  reviewItems = document.querySelectorAll('.review-item');
  reviewDots = document.querySelectorAll('.carousel-dots .dot');
  
  if (reviewItems.length === 0) return;

  // Button controls
  const prevBtn = document.querySelector('.prev-review');
  const nextBtn = document.querySelector('.next-review');

  if (prevBtn) prevBtn.addEventListener('click', () => changeReview(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => changeReview(1));

  // Dot controls
  reviewDots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToReview(index));
  });

  // Auto-advance every 6 seconds
  startAutoplay();

  // Pause on hover
  const reviewsBlock = document.querySelector('.reviews-block');
  if (reviewsBlock) {
    reviewsBlock.addEventListener('mouseenter', stopAutoplay);
    reviewsBlock.addEventListener('mouseleave', startAutoplay);
  }

  // Show first review
  updateReviewDisplay();
}

/**
 * Change review (next/prev)
 * @param {number} direction - 1 for next, -1 for prev
 */
function changeReview(direction) {
  currentReviewIndex += direction;

  if (currentReviewIndex < 0) {
    currentReviewIndex = reviewItems.length - 1;
  } else if (currentReviewIndex >= reviewItems.length) {
    currentReviewIndex = 0;
  }

  updateReviewDisplay();
}

/**
 * Go to specific review
 * @param {number} index - Review index
 */
function goToReview(index) {
  currentReviewIndex = index;
  updateReviewDisplay();
}

/**
 * Update review display
 */
function updateReviewDisplay() {
  // Update review items
  reviewItems.forEach((item, index) => {
    if (index === currentReviewIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update dots
  reviewDots.forEach((dot, index) => {
    if (index === currentReviewIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

/**
 * Start autoplay
 */
function startAutoplay() {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    changeReview(1);
  }, 6000); // 6 seconds
}

/**
 * Stop autoplay
 */
function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', initReviewsCarousel);