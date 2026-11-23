/**
 * Scroll Animation Manager
 * Centralized manager for scroll-triggered animations using Intersection Observer API
 * Coordinates animations for stat counters, timeline entries, and achievement items
 */
class ScrollAnimationManager {
  constructor() {
    this.observers = new Map();
    this.animatedElements = new Set();
  }

  /**
   * Initialize all Intersection Observer instances
   */
  initializeObservers() {
    this.createStatCounterObserver();
    this.createTimelineObserver();
    this.createAchievementObserver();
  }

  /**
   * Create observer for stat counters
   * Threshold: 0.5 (50% visible), triggers once
   */
  createStatCounterObserver() {
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animatedElements.add(entry.target);
          this.animateStatCounter(entry.target);
        }
      });
    };

    const options = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver(callback, options);
    this.observers.set('stat-counter', observer);

    // Observe all stat counter elements
    const statCounters = document.querySelectorAll('.stat-counter');
    statCounters.forEach(counter => observer.observe(counter));
  }

  /**
   * Create observer for timeline entries
   * Threshold: 0.3 (30% visible)
   */
  createTimelineObserver() {
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline__entry--visible');
        }
      });
    };

    const options = {
      threshold: 0.3,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver(callback, options);
    this.observers.set('timeline__entry', observer);

    // Observe all timeline entry elements
    const timelineEntries = document.querySelectorAll('.timeline__entry');
    timelineEntries.forEach(entry => observer.observe(entry));
  }

  /**
   * Create observer for achievement items
   * Threshold: 0.5 (50% visible)
   */
  createAchievementObserver() {
    const callback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('achievement-item--visible');
        }
      });
    };

    const options = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver(callback, options);
    this.observers.set('achievement-item', observer);

    // Observe all achievement item elements
    const achievementItems = document.querySelectorAll('.achievement-item');
    achievementItems.forEach(item => observer.observe(item));
  }

  /**
   * Animate stat counter from 0 to target value
   * @param {HTMLElement} element - The stat counter element
   */
  animateStatCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const valueElement = element.querySelector('.stat-counter__value');

    if (!valueElement) return;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuad)
      const eased = 1 - Math.pow(1 - progress, 2);
      const current = Math.floor(eased * target);

      const suffix = element.dataset.suffix || '';
      valueElement.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Disconnect all observers (cleanup)
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.animatedElements.clear();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollAnimationManager;
}
