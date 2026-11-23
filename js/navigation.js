/**
 * Navigation Component
 * Handles smooth scrolling, hamburger menu toggle, and active section highlighting
 */

class Navigation {
  constructor() {
    this.nav = document.querySelector('.nav');
    this.navToggle = document.querySelector('.nav__toggle');
    this.navList = document.querySelector('.nav__list');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.sections = document.querySelectorAll('section[id]');
    this.focusableElements = null;
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
    
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupHamburgerToggle();
    this.setupActiveHighlighting();
    this.setupMobileMenuClose();
    this.setupFocusTrap();
  }

  /**
   * Setup smooth scrolling for navigation links
   * Uses scrollIntoView API with smooth behavior
   */
  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          // Smooth scroll to target section
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Close mobile menu if open
          if (this.navToggle && this.navToggle.getAttribute('aria-expanded') === 'true') {
            this.closeMobileMenu();
          }

          // Update URL hash without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  /**
   * Setup hamburger menu toggle functionality
   */
  setupHamburgerToggle() {
    if (!this.navToggle) return;

    this.navToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navToggle.getAttribute('aria-expanded') === 'true') {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Toggle mobile menu open/closed
   */
  toggleMobileMenu() {
    const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Set up focus trap when menu opens
    this.updateFocusableElements();
    
    // Focus the first navigation link when menu opens
    if (this.firstFocusableElement) {
      setTimeout(() => {
        this.firstFocusableElement.focus();
      }, 100); // Small delay to ensure menu is visible
    }
  }

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore scrolling
  }

  /**
   * Close mobile menu when clicking on a navigation link
   */
  setupMobileMenuClose() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.navToggle && this.navToggle.getAttribute('aria-expanded') === 'true') {
          this.closeMobileMenu();
        }
      });
    });
  }

  /**
   * Setup active section highlighting based on scroll position
   * Uses Intersection Observer for performance
   */
  setupActiveHighlighting() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is in middle of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          this.updateActiveLink(sectionId);
        }
      });
    }, observerOptions);

    // Observe all sections
    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  /**
   * Update active link styling based on current section
   * @param {string} sectionId - ID of the active section
   */
  updateActiveLink(sectionId) {
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
    });

    // Add active class to current section link
    const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('nav__link--active');
    }
  }

  /**
   * Setup focus trap for mobile menu
   * Prevents tabbing outside the menu when it's open
   */
  setupFocusTrap() {
    if (!this.navToggle || !this.navList) return;

    // Handle Tab key to trap focus within mobile menu
    document.addEventListener('keydown', (e) => {
      // Only trap focus when mobile menu is open
      if (this.navToggle.getAttribute('aria-expanded') !== 'true') return;
      
      // Only handle Tab key
      if (e.key !== 'Tab') return;

      // Update focusable elements in case DOM changed
      this.updateFocusableElements();

      if (!this.firstFocusableElement || !this.lastFocusableElement) return;

      // Shift + Tab (backwards)
      if (e.shiftKey) {
        if (document.activeElement === this.firstFocusableElement) {
          e.preventDefault();
          this.lastFocusableElement.focus();
        }
      } 
      // Tab (forwards)
      else {
        if (document.activeElement === this.lastFocusableElement) {
          e.preventDefault();
          this.firstFocusableElement.focus();
        }
      }
    });
  }

  /**
   * Update the list of focusable elements within the mobile menu
   * Called when menu opens or when focus trap needs to be refreshed
   */
  updateFocusableElements() {
    if (!this.navToggle || !this.navList) return;

    // Get all focusable elements within the navigation
    // Include the toggle button and all navigation links
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    // Get focusable elements from both toggle and nav list
    const toggleElement = [this.navToggle];
    const navElements = Array.from(
      this.navList.querySelectorAll(focusableSelectors.join(','))
    );

    // Combine toggle button with nav links for focus trap
    this.focusableElements = [...toggleElement, ...navElements];
    
    if (this.focusableElements.length > 0) {
      this.firstFocusableElement = this.focusableElements[0];
      this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
    }
  }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
  });
} else {
  new Navigation();
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
