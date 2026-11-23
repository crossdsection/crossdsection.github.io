/**
 * Main Application Entry Point
 * 
 * This module serves as the central initialization point for the portfolio website.
 * It coordinates the initialization of all component modules and ensures proper
 * loading order and dependency management.
 * 
 * INITIALIZATION STRATEGY:
 * - Uses DOMContentLoaded to ensure DOM is ready before initialization
 * - Initializes components in dependency order
 * - Provides centralized error handling for initialization failures
 * - Supports both modern and legacy browser environments
 * 
 * COMPONENTS INITIALIZED:
 * 1. ScrollAnimationManager - Manages scroll-triggered animations
 * 2. Navigation - Handles smooth scrolling and menu interactions
 * 3. Hero Animations - Terminal typing effects (handled by animations.js)
 * 4. Timeline Interactions - Expand/collapse functionality (handled by animations.js)
 * 5. Lazy Animation Loading - Deferred initialization for below-the-fold content
 * 
 * Validates: Requirements 1-15 (All requirements integrated)
 */

/**
 * Application class
 * Manages the lifecycle and initialization of all application components
 */
class PortfolioApp {
  constructor() {
    this.initialized = false;
    this.components = {
      scrollManager: null,
      navigation: null
    };
  }

  /**
   * Initialize the application
   * Called when DOM is ready
   */
  init() {
    if (this.initialized) {
      console.warn('[PortfolioApp] Application already initialized');
      return;
    }

    console.log('[PortfolioApp] Initializing application...');

    try {
      // Initialize ScrollAnimationManager if available
      // Note: animations.js handles its own initialization via LazyAnimationInitializer
      // ScrollAnimationManager is available as an alternative/backup approach
      if (typeof ScrollAnimationManager !== 'undefined') {
        this.components.scrollManager = new ScrollAnimationManager();
        // Note: We don't call initializeObservers() here because animations.js
        // already handles scroll animations via LazyAnimationInitializer
        console.log('[PortfolioApp] ScrollAnimationManager available');
      }

      // Navigation is initialized by navigation.js automatically
      // We just verify it's loaded
      if (typeof Navigation !== 'undefined') {
        console.log('[PortfolioApp] Navigation module loaded');
      }

      // Hero animations are initialized by animations.js automatically
      console.log('[PortfolioApp] Hero animations initialized by animations.js');

      // Timeline interactions are initialized lazily by animations.js
      console.log('[PortfolioApp] Timeline interactions will be initialized lazily');

      // Mark as initialized
      this.initialized = true;
      console.log('[PortfolioApp] Application initialization complete');

      // Dispatch custom event to signal app is ready
      this.dispatchReadyEvent();

    } catch (error) {
      console.error('[PortfolioApp] Initialization error:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Dispatch custom event when app is ready
   * Allows other scripts to hook into the initialization lifecycle
   */
  dispatchReadyEvent() {
    const event = new CustomEvent('portfolioAppReady', {
      detail: {
        timestamp: Date.now(),
        components: Object.keys(this.components)
      }
    });
    document.dispatchEvent(event);
    console.log('[PortfolioApp] portfolioAppReady event dispatched');
  }

  /**
   * Handle initialization errors gracefully
   * @param {Error} error - The error that occurred during initialization
   */
  handleInitializationError(error) {
    // Log error for debugging
    console.error('[PortfolioApp] Failed to initialize:', error);

    // In production, you might want to:
    // - Send error to analytics/monitoring service
    // - Display user-friendly error message
    // - Attempt graceful degradation

    // For now, we'll just ensure the page remains functional
    // even if some JavaScript features fail
    console.log('[PortfolioApp] Attempting graceful degradation...');
  }

  /**
   * Cleanup method for destroying the application
   * Useful for testing or if app needs to be reinitialized
   */
  destroy() {
    if (this.components.scrollManager && typeof this.components.scrollManager.destroy === 'function') {
      this.components.scrollManager.destroy();
    }

    this.components = {
      scrollManager: null,
      navigation: null
    };

    this.initialized = false;
    console.log('[PortfolioApp] Application destroyed');
  }
}

/**
 * Initialize application when DOM is ready
 * Supports both loading and interactive/complete states
 */
function initializeApp() {
  const app = new PortfolioApp();
  app.init();

  // Make app instance available globally for debugging
  if (typeof window !== 'undefined') {
    window.portfolioApp = app;
  }
}

// Check if DOM is already ready
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded event
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already ready (interactive or complete state)
  // This can happen if script is loaded with defer or at end of body
  initializeApp();
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}
