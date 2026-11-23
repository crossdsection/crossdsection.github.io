/**
 * Browser Compatibility Testing Script
 * 
 * This script performs automated checks for browser compatibility issues.
 * Run this in the browser console to get a quick compatibility report.
 * 
 * Usage:
 * 1. Open the portfolio website in a browser
 * 2. Open browser DevTools console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter to run
 * 5. Review the compatibility report in the console
 */

(function() {
  'use strict';

  console.log('%c🔍 Browser Compatibility Test Starting...', 'color: #00ff99; font-size: 16px; font-weight: bold;');
  console.log('Browser:', navigator.userAgent);
  console.log('Viewport:', window.innerWidth + 'x' + window.innerHeight);
  console.log('---');

  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // Test 1: Check for required CSS features
  function testCSSFeatures() {
    console.log('%c1. Testing CSS Feature Support...', 'color: #00bfff; font-weight: bold;');
    
    const features = {
      'CSS Grid': CSS.supports('display', 'grid'),
      'CSS Flexbox': CSS.supports('display', 'flex'),
      'CSS Custom Properties': CSS.supports('--test', '0'),
      'CSS Transforms': CSS.supports('transform', 'translateX(0)'),
      'CSS Transitions': CSS.supports('transition', 'all 0.3s'),
      'CSS Animations': CSS.supports('animation', 'test 1s'),
      '3D Transforms': CSS.supports('transform-style', 'preserve-3d'),
      'Backface Visibility': CSS.supports('backface-visibility', 'hidden')
    };

    Object.entries(features).forEach(([feature, supported]) => {
      if (supported) {
        results.passed.push(`CSS: ${feature}`);
        console.log(`  ✅ ${feature}: Supported`);
      } else {
        results.failed.push(`CSS: ${feature}`);
        console.log(`  ❌ ${feature}: NOT Supported`);
      }
    });
  }

  // Test 2: Check for required JavaScript APIs
  function testJavaScriptAPIs() {
    console.log('%c2. Testing JavaScript API Support...', 'color: #00bfff; font-weight: bold;');
    
    const apis = {
      'Intersection Observer': 'IntersectionObserver' in window,
      'requestAnimationFrame': 'requestAnimationFrame' in window,
      'Promise': 'Promise' in window,
      'Fetch API': 'fetch' in window,
      'ES6 Classes': typeof class {} === 'function',
      'Arrow Functions': (() => true)(),
      'Template Literals': true, // If this runs, template literals work
      'Async/Await': (async () => true)() instanceof Promise
    };

    Object.entries(apis).forEach(([api, supported]) => {
      if (supported) {
        results.passed.push(`JS API: ${api}`);
        console.log(`  ✅ ${api}: Supported`);
      } else {
        results.failed.push(`JS API: ${api}`);
        console.log(`  ❌ ${api}: NOT Supported`);
      }
    });
  }

  // Test 3: Check smooth scroll support
  function testSmoothScroll() {
    console.log('%c3. Testing Smooth Scroll Support...', 'color: #00bfff; font-weight: bold;');
    
    const supported = 'scrollBehavior' in document.documentElement.style;
    if (supported) {
      results.passed.push('Smooth Scroll: Native support');
      console.log('  ✅ Smooth Scroll: Native support available');
    } else {
      results.warnings.push('Smooth Scroll: Requires polyfill');
      console.log('  ⚠️ Smooth Scroll: Native support NOT available (polyfill may be needed)');
    }
  }

  // Test 4: Check viewport dimensions
  function testViewport() {
    console.log('%c4. Testing Viewport Configuration...', 'color: #00bfff; font-weight: bold;');
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const deviceType = width < 768 ? 'Mobile' : width < 1024 ? 'Tablet' : 'Desktop';
    
    console.log(`  📱 Device Type: ${deviceType}`);
    console.log(`  📏 Viewport: ${width}x${height}px`);
    
    // Check for horizontal scroll
    const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
    if (hasHorizontalScroll) {
      results.failed.push('Viewport: Horizontal scroll detected');
      console.log('  ❌ Horizontal scroll detected (should be prevented)');
    } else {
      results.passed.push('Viewport: No horizontal scroll');
      console.log('  ✅ No horizontal scroll');
    }

    // Check viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      results.passed.push('Viewport: Meta tag present');
      console.log('  ✅ Viewport meta tag present:', viewportMeta.content);
    } else {
      results.warnings.push('Viewport: Meta tag missing');
      console.log('  ⚠️ Viewport meta tag missing');
    }
  }

  // Test 5: Check for required sections
  function testSections() {
    console.log('%c5. Testing Section Presence...', 'color: #00bfff; font-weight: bold;');
    
    const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'achievements'];
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        results.passed.push(`Section: #${id}`);
        console.log(`  ✅ Section #${id}: Found`);
      } else {
        results.failed.push(`Section: #${id}`);
        console.log(`  ❌ Section #${id}: NOT Found`);
      }
    });
  }

  // Test 6: Check navigation
  function testNavigation() {
    console.log('%c6. Testing Navigation...', 'color: #00bfff; font-weight: bold;');
    
    const nav = document.querySelector('nav');
    if (nav) {
      results.passed.push('Navigation: Element found');
      console.log('  ✅ Navigation element found');
      
      const links = nav.querySelectorAll('a');
      console.log(`  📊 Navigation links: ${links.length}`);
      
      if (links.length >= 6) {
        results.passed.push('Navigation: All links present');
        console.log('  ✅ All expected navigation links present');
      } else {
        results.warnings.push('Navigation: Missing links');
        console.log('  ⚠️ Expected 6+ navigation links, found:', links.length);
      }
    } else {
      results.failed.push('Navigation: Element not found');
      console.log('  ❌ Navigation element NOT found');
    }
  }

  // Test 7: Check animations
  function testAnimations() {
    console.log('%c7. Testing Animation Elements...', 'color: #00bfff; font-weight: bold;');
    
    // Check for stat counters
    const statCounters = document.querySelectorAll('.stat-counter');
    console.log(`  📊 Stat counters found: ${statCounters.length}`);
    if (statCounters.length >= 4) {
      results.passed.push('Animations: Stat counters present');
      console.log('  ✅ Stat counters present');
    } else {
      results.warnings.push('Animations: Stat counters missing');
      console.log('  ⚠️ Expected 4 stat counters, found:', statCounters.length);
    }

    // Check for timeline entries
    const timelineEntries = document.querySelectorAll('.timeline__entry');
    console.log(`  📊 Timeline entries found: ${timelineEntries.length}`);
    if (timelineEntries.length >= 6) {
      results.passed.push('Animations: Timeline entries present');
      console.log('  ✅ Timeline entries present');
    } else {
      results.warnings.push('Animations: Timeline entries missing');
      console.log('  ⚠️ Expected 6 timeline entries, found:', timelineEntries.length);
    }

    // Check for project cards
    const projectCards = document.querySelectorAll('.project-card');
    console.log(`  📊 Project cards found: ${projectCards.length}`);
    if (projectCards.length >= 6) {
      results.passed.push('Animations: Project cards present');
      console.log('  ✅ Project cards present');
    } else {
      results.warnings.push('Animations: Project cards missing');
      console.log('  ⚠️ Expected 6 project cards, found:', projectCards.length);
    }
  }

  // Test 8: Check accessibility features
  function testAccessibility() {
    console.log('%c8. Testing Accessibility Features...', 'color: #00bfff; font-weight: bold;');
    
    // Check for semantic HTML
    const semanticElements = ['header', 'nav', 'main', 'section', 'footer'];
    semanticElements.forEach(tag => {
      const elements = document.querySelectorAll(tag);
      if (elements.length > 0) {
        results.passed.push(`A11y: <${tag}> element`);
        console.log(`  ✅ <${tag}> element found (${elements.length})`);
      } else {
        results.warnings.push(`A11y: <${tag}> element missing`);
        console.log(`  ⚠️ <${tag}> element NOT found`);
      }
    });

    // Check for ARIA labels
    const ariaLabels = document.querySelectorAll('[aria-label]');
    console.log(`  📊 Elements with aria-label: ${ariaLabels.length}`);
    if (ariaLabels.length > 0) {
      results.passed.push('A11y: ARIA labels present');
      console.log('  ✅ ARIA labels present');
    } else {
      results.warnings.push('A11y: No ARIA labels found');
      console.log('  ⚠️ No ARIA labels found');
    }

    // Check for heading hierarchy
    const h1 = document.querySelectorAll('h1');
    const h2 = document.querySelectorAll('h2');
    console.log(`  📊 Heading hierarchy: ${h1.length} h1, ${h2.length} h2`);
    if (h1.length === 1) {
      results.passed.push('A11y: Single h1 element');
      console.log('  ✅ Single h1 element (correct)');
    } else {
      results.warnings.push('A11y: Multiple or no h1 elements');
      console.log('  ⚠️ Expected 1 h1 element, found:', h1.length);
    }
  }

  // Test 9: Check performance
  function testPerformance() {
    console.log('%c9. Testing Performance Metrics...', 'color: #00bfff; font-weight: bold;');
    
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
      
      console.log(`  ⏱️ Page Load Time: ${(loadTime / 1000).toFixed(2)}s`);
      console.log(`  ⏱️ DOM Ready Time: ${(domReady / 1000).toFixed(2)}s`);
      
      if (loadTime < 3000) {
        results.passed.push('Performance: Load time < 3s');
        console.log('  ✅ Load time meets target (<3s)');
      } else {
        results.warnings.push('Performance: Load time > 3s');
        console.log('  ⚠️ Load time exceeds target (>3s)');
      }
    } else {
      console.log('  ℹ️ Performance API not available');
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    console.log(`  🎬 Prefers Reduced Motion: ${prefersReducedMotion}`);
    if (prefersReducedMotion) {
      results.warnings.push('Performance: Reduced motion enabled');
      console.log('  ⚠️ User prefers reduced motion (animations should be minimal)');
    }
  }

  // Test 10: Check fonts
  function testFonts() {
    console.log('%c10. Testing Font Loading...', 'color: #00bfff; font-weight: bold;');
    
    if (document.fonts && document.fonts.check) {
      const fonts = [
        '16px "JetBrains Mono"',
        '16px "Inter"'
      ];
      
      fonts.forEach(font => {
        const loaded = document.fonts.check(font);
        const fontName = font.split('"')[1];
        if (loaded) {
          results.passed.push(`Fonts: ${fontName}`);
          console.log(`  ✅ ${fontName}: Loaded`);
        } else {
          results.warnings.push(`Fonts: ${fontName}`);
          console.log(`  ⚠️ ${fontName}: NOT Loaded (may still be loading)');
        }
      });
    } else {
      console.log('  ℹ️ Font Loading API not available');
    }
  }

  // Run all tests
  testCSSFeatures();
  testJavaScriptAPIs();
  testSmoothScroll();
  testViewport();
  testSections();
  testNavigation();
  testAnimations();
  testAccessibility();
  testPerformance();
  testFonts();

  // Print summary
  console.log('\n%c📊 Test Summary', 'color: #00ff99; font-size: 18px; font-weight: bold;');
  console.log('---');
  console.log(`%c✅ Passed: ${results.passed.length}`, 'color: #00ff99; font-weight: bold;');
  console.log(`%c⚠️ Warnings: ${results.warnings.length}`, 'color: #ffaa00; font-weight: bold;');
  console.log(`%c❌ Failed: ${results.failed.length}`, 'color: #ff6b6b; font-weight: bold;');
  console.log('---');

  if (results.failed.length > 0) {
    console.log('%c❌ Failed Tests:', 'color: #ff6b6b; font-weight: bold;');
    results.failed.forEach(test => console.log(`  • ${test}`));
  }

  if (results.warnings.length > 0) {
    console.log('%c⚠️ Warnings:', 'color: #ffaa00; font-weight: bold;');
    results.warnings.forEach(test => console.log(`  • ${test}`));
  }

  // Overall status
  console.log('\n%c' + (results.failed.length === 0 ? '✅ All Critical Tests Passed!' : '❌ Some Tests Failed'), 
    'color: ' + (results.failed.length === 0 ? '#00ff99' : '#ff6b6b') + '; font-size: 16px; font-weight: bold;');

  // Return results object for programmatic access
  return {
    passed: results.passed.length,
    warnings: results.warnings.length,
    failed: results.failed.length,
    details: results
  };
})();
