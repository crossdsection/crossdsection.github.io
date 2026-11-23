/**
 * Animation Module
 * 
 * This module handles all animations for the portfolio website with lazy loading optimization.
 * 
 * LAZY LOADING STRATEGY (Requirements 12.2, 12.3):
 * - Hero section animations initialize immediately (above the fold)
 * - Below-the-fold section animations are deferred until sections enter viewport
 * - Uses Intersection Observer to detect when sections become visible
 * - Animations are initialized once per section, then observers are disconnected
 * 
 * PERFORMANCE BENEFITS:
 * - Reduces initial JavaScript execution time on page load
 * - Defers DOM queries and event listener setup until needed
 * - Improves Time to Interactive (TTI) metric
 * - Only processes animations for content user actually views
 * 
 * ANIMATION TYPES:
 * - Terminal typing: Character-by-character text animation for hero section
 * - Stat counters: Animated number counting for statistics
 * - Timeline entries: Slide-in animations for experience timeline
 * - Achievement items: Fade-in animations for achievement list
 * - Project cards: Keyboard interaction support for flip cards
 */

/**
 * Terminal Typing Animation
 * Simulates character-by-character typing effect
 */
class TerminalTypingAnimation {
  constructor(element, text, speed = 100) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.currentIndex = 0;
  }

  /**
   * Type out the text character by character
   */
  async type() {
    this.element.textContent = '';
    for (let char of this.text) {
      this.element.textContent += char;
      await this.delay(this.speed);
    }
  }

  /**
   * Utility method to create a delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Subtitle Cycler
 * Cycles through multiple subtitles with typing and erasing effects
 */
class SubtitleCycler {
  constructor(element, subtitles, typingSpeed = 100, pauseDuration = 2000) {
    this.element = element;
    this.subtitles = subtitles;
    this.typingSpeed = typingSpeed;
    this.pauseDuration = pauseDuration;
    this.currentIndex = 0;
    this.isRunning = false;
  }

  /**
   * Start the subtitle cycling animation
   */
  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.isRunning) {
      await this.typeSubtitle(this.subtitles[this.currentIndex]);
      await this.delay(this.pauseDuration);
      await this.eraseSubtitle();
      this.currentIndex = (this.currentIndex + 1) % this.subtitles.length;
    }
  }

  /**
   * Type out a subtitle character by character
   */
  async typeSubtitle(text) {
    this.element.textContent = '';
    for (let char of text) {
      if (!this.isRunning) break;
      this.element.textContent += char;
      await this.delay(this.typingSpeed);
    }
  }

  /**
   * Erase the current subtitle character by character
   */
  async eraseSubtitle() {
    const text = this.element.textContent;
    for (let i = text.length; i >= 0; i--) {
      if (!this.isRunning) break;
      this.element.textContent = text.substring(0, i);
      await this.delay(this.typingSpeed / 2); // Erase faster than typing
    }
  }

  /**
   * Stop the cycling animation
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Utility method to create a delay
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Stat Counter Animation
 * Animates a number from 0 to target value with easing
 */
class StatCounter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = target;
    this.duration = duration;
    this.current = 0;
  }

  /**
   * Animate the counter with easeOutQuad easing
   */
  animate() {
    const startTime = performance.now();
    const valueElement = this.element.querySelector('.stat-counter__value');
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      
      // Easing function (easeOutQuad)
      const eased = 1 - Math.pow(1 - progress, 2);
      this.current = Math.floor(eased * this.target);
      
      if (valueElement) {
        const suffix = this.element.dataset.suffix || '';
        valueElement.textContent = this.current + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}

/**
 * Timeline Entry
 * Handles expand/collapse functionality for timeline entries
 */
class TimelineEntry {
  constructor(element) {
    this.element = element;
    this.toggle = element.querySelector('.timeline__toggle');
    this.details = element.querySelector('.timeline__details');
    this.chevron = element.querySelector('.timeline__chevron');
    this.isExpanded = false;

    if (this.toggle && this.details) {
      this.toggle.addEventListener('click', () => this.toggleExpand());
      // Initialize collapsed state
      this.details.style.maxHeight = '0';
      this.details.style.overflow = 'hidden';
      this.details.style.transition = 'max-height 0.4s ease';
    }
  }

  /**
   * Toggle expand/collapse state
   */
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.element.setAttribute('data-expanded', this.isExpanded);
    this.toggle.setAttribute('aria-expanded', this.isExpanded);
    
    if (this.isExpanded) {
      this.details.style.maxHeight = `${this.details.scrollHeight}px`;
    } else {
      this.details.style.maxHeight = '0';
    }
  }
}

/**
 * Initialize Hero Animations
 * Sets up the terminal typing effect for the hero section
 */
function initHeroAnimations() {
  const nameElement = document.querySelector('.hero__name');
  const subtitleElement = document.querySelector('.hero__subtitle');

  if (nameElement) {
    const nameText = nameElement.dataset.text || 'Piyush Kumar';
    const nameAnimation = new TerminalTypingAnimation(nameElement, nameText, 100);
    nameAnimation.type();
  }

  if (subtitleElement) {
    const subtitlesData = subtitleElement.dataset.subtitles;
    if (subtitlesData) {
      try {
        const subtitles = JSON.parse(subtitlesData);
        const subtitleCycler = new SubtitleCycler(subtitleElement, subtitles, 100, 2000);
        // Start subtitle cycling after name animation completes
        setTimeout(() => {
          subtitleCycler.start();
        }, 1500); // Delay to let name finish typing
      } catch (error) {
        console.error('Error parsing subtitles data:', error);
      }
    }
  }
}

/**
 * Initialize Timeline Interactions
 * Sets up expand/collapse functionality for timeline entries
 */
function initTimelineInteractions() {
  const timelineEntries = document.querySelectorAll('.timeline__entry');
  timelineEntries.forEach(entry => {
    new TimelineEntry(entry);
  });
}

/**
 * Initialize Stat Counter Animations
 * Sets up Intersection Observer to trigger stat counter animations when About section enters viewport
 */
function initStatCounters() {
  const statCounters = document.querySelectorAll('.stat-counter');
  
  if (statCounters.length === 0) return;

  // Create Intersection Observer to trigger animations when stat counters enter viewport
  const observerOptions = {
    threshold: 0.5, // Trigger when 50% of the element is visible
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        // Mark as animated to prevent re-triggering
        entry.target.dataset.animated = 'true';
        
        // Get target value from data attribute
        const target = parseInt(entry.target.dataset.target, 10);
        
        // Create and start animation
        const counter = new StatCounter(entry.target, target, 2000);
        counter.animate();
      }
    });
  }, observerOptions);

  // Observe all stat counter elements
  statCounters.forEach(counter => observer.observe(counter));
}

/**
 * Initialize Timeline Scroll Animations
 * Sets up Intersection Observer to trigger slide-in animations for timeline entries
 */
function initTimelineScrollAnimations() {
  const timelineEntries = document.querySelectorAll('.timeline__entry');
  
  if (timelineEntries.length === 0) return;

  // Create Intersection Observer to trigger animations when timeline entries enter viewport
  const observerOptions = {
    threshold: 0.3, // Trigger when 30% of the element is visible
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class to trigger CSS animation
        entry.target.classList.add('timeline__entry--visible');
      }
    });
  }, observerOptions);

  // Observe all timeline entry elements
  timelineEntries.forEach(entry => observer.observe(entry));
}

/**
 * Lazy Animation Initializer
 * Defers animation initialization for below-the-fold sections until they enter viewport
 * Improves initial load performance by reducing work on page load
 * 
 * Performance Benefits:
 * - Reduces initial JavaScript execution time
 * - Defers Intersection Observer setup until needed
 * - Prevents unnecessary DOM queries on page load
 * - Only initializes animations for sections that user actually views
 * 
 * Validates: Requirements 12.2, 12.3
 */
class LazyAnimationInitializer {
  constructor() {
    this.initializedSections = new Set();
    this.sectionInitializers = new Map([
      ['about', () => {
        initStatCounters();
      }],
      ['experience', () => {
        initTimelineInteractions();
        initTimelineScrollAnimations();
      }],
      ['skills', () => {
        // Skills section uses CSS-only hover effects, no JS initialization needed
        // This entry exists for future enhancements
      }],
      ['projects', () => {
        initProjectCardKeyboardInteractions();
      }],
      ['achievements', () => {
        initAchievementScrollAnimations();
      }]
    ]);
  }

  /**
   * Initialize lazy loading for below-the-fold sections
   */
  init() {
    // Create observer for section initialization
    const observerOptions = {
      root: null,
      rootMargin: '50px', // Start initializing slightly before section enters viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          this.initializeSection(sectionId);
          // Stop observing once initialized
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections that have initializers
    this.sectionInitializers.forEach((initializer, sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });
  }

  /**
   * Initialize animations for a specific section
   * @param {string} sectionId - ID of the section to initialize
   */
  initializeSection(sectionId) {
    // Skip if already initialized
    if (this.initializedSections.has(sectionId)) {
      return;
    }

    // Get and execute the initializer function
    const initializer = this.sectionInitializers.get(sectionId);
    if (initializer) {
      console.log(`[LazyLoad] Initializing animations for section: ${sectionId}`);
      initializer();
      this.initializedSections.add(sectionId);
    }
  }
}

/**
 * Initialize all animations when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero animations immediately (above the fold)
    initHeroAnimations();
    
    // Setup lazy initialization for below-the-fold sections
    const lazyInitializer = new LazyAnimationInitializer();
    lazyInitializer.init();
  });
} else {
  // DOM is already ready
  initHeroAnimations();
  
  // Setup lazy initialization for below-the-fold sections
  const lazyInitializer = new LazyAnimationInitializer();
  lazyInitializer.init();
}

// Export classes for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TerminalTypingAnimation,
    SubtitleCycler,
    StatCounter,
    TimelineEntry
  };
}

/**
 * Initialize Achievement Scroll Animations
 * Sets up Intersection Observer to trigger fade-in animations for achievement items
 */
function initAchievementScrollAnimations() {
  const achievementItems = document.querySelectorAll('.achievement-item');
  
  if (achievementItems.length === 0) return;

  // Create Intersection Observer to trigger animations when achievement items enter viewport
  const observerOptions = {
    threshold: 0.5, // Trigger when 50% of the element is visible
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class to trigger CSS fade-in animation
        entry.target.classList.add('achievement-item--visible');
      }
    });
  }, observerOptions);

  // Observe all achievement item elements
  achievementItems.forEach(item => observer.observe(item));
}

/**
 * Initialize Project Card Keyboard Interactions
 * Enables keyboard navigation (Enter/Space) to flip project cards
 */
function initProjectCardKeyboardInteractions() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // Track flip state
    let isFlipped = false;
    
    // Handle keyboard events
    card.addEventListener('keydown', (e) => {
      // Trigger flip on Enter or Space key
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        isFlipped = !isFlipped;
        
        const inner = card.querySelector('.project-card__inner');
        if (inner) {
          if (isFlipped) {
            inner.style.transform = 'rotateY(180deg)';
          } else {
            inner.style.transform = 'rotateY(0deg)';
          }
        }
      }
    });
    
    // Reset flip state when mouse leaves (for consistency)
    card.addEventListener('mouseleave', () => {
      if (!document.activeElement || document.activeElement !== card) {
        isFlipped = false;
        const inner = card.querySelector('.project-card__inner');
        if (inner) {
          inner.style.transform = 'rotateY(0deg)';
        }
      }
    });
    
    // Reset flip state when focus leaves
    card.addEventListener('blur', () => {
      isFlipped = false;
      const inner = card.querySelector('.project-card__inner');
      if (inner) {
        inner.style.transform = 'rotateY(0deg)';
      }
    });
  });
}
