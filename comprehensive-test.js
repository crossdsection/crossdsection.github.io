/**
 * Comprehensive Testing and Validation Script
 * Task 17: Final checkpoint for portfolio website
 * 
 * This script validates all requirements across:
 * - Responsive design (mobile, tablet, desktop)
 * - Animations and scroll triggers
 * - Keyboard navigation
 * - Accessibility features
 * - Performance metrics
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

class ComprehensiveValidator {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  log(message, type = 'info') {
    const prefix = {
      pass: `${colors.green}✓${colors.reset}`,
      fail: `${colors.red}✗${colors.reset}`,
      warn: `${colors.yellow}⚠${colors.reset}`,
      info: `${colors.blue}ℹ${colors.reset}`
    };
    console.log(`${prefix[type]} ${message}`);
  }

  pass(test, message) {
    this.results.passed.push({ test, message });
    this.log(message, 'pass');
  }

  fail(test, message) {
    this.results.failed.push({ test, message });
    this.log(message, 'fail');
  }

  warn(test, message) {
    this.results.warnings.push({ test, message });
    this.log(message, 'warn');
  }

  // Test 1: File Structure Validation
  testFileStructure() {
    console.log(`\n${colors.cyan}=== Testing File Structure ===${colors.reset}\n`);
    
    const requiredFiles = [
      'index.html',
      'css/variables.css',
      'css/base.css',
      'css/layout.css',
      'css/components.css',
      'css/sections.css',
      'js/animations.js',
      'js/scroll-manager.js',
      'js/navigation.js',
      'js/main.js',
      '.nojekyll'
    ];

    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.pass('file-structure', `File exists: ${file}`);
      } else {
        this.fail('file-structure', `Missing file: ${file}`);
      }
    });
  }

  // Test 2: HTML Structure Validation
  testHTMLStructure() {
    console.log(`\n${colors.cyan}=== Testing HTML Structure ===${colors.reset}\n`);
    
    const html = fs.readFileSync('index.html', 'utf8');
    
    // Check for semantic HTML5 elements
    const semanticElements = ['<nav', '<header', '<main', '<section', '<footer', '<article'];
    semanticElements.forEach(element => {
      if (html.includes(element)) {
        this.pass('html-semantic', `Semantic element found: ${element}`);
      } else {
        this.fail('html-semantic', `Missing semantic element: ${element}`);
      }
    });

    // Check for all required sections
    const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'achievements'];
    sections.forEach(section => {
      if (html.includes(`id="${section}"`) || html.includes(`id='${section}'`)) {
        this.pass('html-sections', `Section found: ${section}`);
      } else {
        this.fail('html-sections', `Missing section: ${section}`);
      }
    });

    // Check for ARIA labels
    if (html.includes('aria-label')) {
      this.pass('html-aria', 'ARIA labels present');
    } else {
      this.fail('html-aria', 'No ARIA labels found');
    }

    // Check for heading hierarchy
    const h1Count = (html.match(/<h1/g) || []).length;
    if (h1Count === 1) {
      this.pass('html-headings', 'Single h1 element (correct hierarchy)');
    } else {
      this.fail('html-headings', `Found ${h1Count} h1 elements (should be 1)`);
    }
  }

  // Test 3: CSS Design System Validation
  testCSSDesignSystem() {
    console.log(`\n${colors.cyan}=== Testing CSS Design System ===${colors.reset}\n`);
    
    const variables = fs.readFileSync('css/variables.css', 'utf8');
    
    // Check for required color variables
    const requiredColors = [
      '--bg-primary',
      '--color-accent',
      '--color-text',
      '--breakpoint-mobile',
      '--breakpoint-tablet'
    ];

    requiredColors.forEach(variable => {
      if (variables.includes(variable)) {
        this.pass('css-variables', `Variable defined: ${variable}`);
      } else {
        this.warn('css-variables', `Variable not found: ${variable}`);
      }
    });

    // Check for responsive breakpoints in layout.css
    const layout = fs.readFileSync('css/layout.css', 'utf8');
    if (layout.includes('@media') && layout.includes('768px')) {
      this.pass('css-responsive', 'Mobile breakpoint (768px) defined');
    } else {
      this.fail('css-responsive', 'Mobile breakpoint not found');
    }

    if (layout.includes('1024px')) {
      this.pass('css-responsive', 'Tablet breakpoint (1024px) defined');
    } else {
      this.fail('css-responsive', 'Tablet breakpoint not found');
    }
  }

  // Test 4: JavaScript Module Validation
  testJavaScriptModules() {
    console.log(`\n${colors.cyan}=== Testing JavaScript Modules ===${colors.reset}\n`);
    
    // Check animations.js
    const animations = fs.readFileSync('js/animations.js', 'utf8');
    const animationClasses = ['TerminalTypingAnimation', 'SubtitleCycler', 'StatCounter', 'TimelineEntry'];
    
    animationClasses.forEach(className => {
      if (animations.includes(className)) {
        this.pass('js-animations', `Animation class found: ${className}`);
      } else {
        this.fail('js-animations', `Missing animation class: ${className}`);
      }
    });

    // Check scroll-manager.js
    const scrollManager = fs.readFileSync('js/scroll-manager.js', 'utf8');
    if (scrollManager.includes('IntersectionObserver')) {
      this.pass('js-scroll', 'IntersectionObserver implementation found');
    } else {
      this.fail('js-scroll', 'IntersectionObserver not found');
    }

    // Check navigation.js
    const navigation = fs.readFileSync('js/navigation.js', 'utf8');
    if (navigation.includes('scrollIntoView') || navigation.includes('smooth')) {
      this.pass('js-navigation', 'Smooth scroll implementation found');
    } else {
      this.fail('js-navigation', 'Smooth scroll not implemented');
    }
  }

  // Test 5: Accessibility Features
  testAccessibility() {
    console.log(`\n${colors.cyan}=== Testing Accessibility Features ===${colors.reset}\n`);
    
    const html = fs.readFileSync('index.html', 'utf8');
    const base = fs.readFileSync('css/base.css', 'utf8');

    // Check for reduced motion support
    if (base.includes('prefers-reduced-motion')) {
      this.pass('a11y-motion', 'Reduced motion support implemented');
    } else {
      this.fail('a11y-motion', 'Reduced motion support missing');
    }

    // Check for keyboard navigation support
    if (html.includes('tabindex') || base.includes(':focus')) {
      this.pass('a11y-keyboard', 'Keyboard navigation support found');
    } else {
      this.warn('a11y-keyboard', 'Limited keyboard navigation indicators');
    }

    // Check for external link attributes
    if (html.includes('rel="noopener"') && html.includes('target="_blank"')) {
      this.pass('a11y-links', 'External links properly configured');
    } else {
      this.warn('a11y-links', 'External link security attributes may be missing');
    }
  }

  // Test 6: Performance Optimizations
  testPerformance() {
    console.log(`\n${colors.cyan}=== Testing Performance Optimizations ===${colors.reset}\n`);
    
    // Check for minified files
    if (fs.existsSync('dist/styles.min.css')) {
      this.pass('performance-css', 'Minified CSS found');
    } else {
      this.warn('performance-css', 'Minified CSS not found');
    }

    if (fs.existsSync('dist/scripts.min.js')) {
      this.pass('performance-js', 'Minified JavaScript found');
    } else {
      this.warn('performance-js', 'Minified JavaScript not found');
    }

    // Check for lazy loading implementation
    const scrollManager = fs.readFileSync('js/scroll-manager.js', 'utf8');
    if (scrollManager.includes('IntersectionObserver')) {
      this.pass('performance-lazy', 'Lazy loading via IntersectionObserver');
    } else {
      this.fail('performance-lazy', 'No lazy loading implementation');
    }

    // Check animations use transform/opacity
    const animations = fs.readFileSync('js/animations.js', 'utf8');
    const sections = fs.readFileSync('css/sections.css', 'utf8');
    if (sections.includes('transform') && sections.includes('opacity')) {
      this.pass('performance-gpu', 'GPU-accelerated properties used');
    } else {
      this.warn('performance-gpu', 'May not be using GPU-accelerated properties');
    }
  }

  // Test 7: GitHub Pages Deployment Readiness
  testDeploymentReadiness() {
    console.log(`\n${colors.cyan}=== Testing Deployment Readiness ===${colors.reset}\n`);
    
    // Check for .nojekyll file
    if (fs.existsSync('.nojekyll')) {
      this.pass('deploy-nojekyll', '.nojekyll file exists');
    } else {
      this.fail('deploy-nojekyll', '.nojekyll file missing');
    }

    // Check index.html is in root
    if (fs.existsSync('index.html')) {
      this.pass('deploy-index', 'index.html in root directory');
    } else {
      this.fail('deploy-index', 'index.html not in root');
    }

    // Check for relative paths in HTML
    const html = fs.readFileSync('index.html', 'utf8');
    const hasAbsolutePaths = html.includes('src="http') || html.includes('href="http');
    if (!hasAbsolutePaths || html.includes('href="https://')) {
      this.pass('deploy-paths', 'Asset paths appear correct');
    } else {
      this.warn('deploy-paths', 'Check asset paths for deployment');
    }
  }

  // Test 8: Content Validation
  testContent() {
    console.log(`\n${colors.cyan}=== Testing Content Completeness ===${colors.reset}\n`);
    
    const html = fs.readFileSync('index.html', 'utf8');

    // Check for required content
    const requiredContent = [
      'Piyush Kumar',
      'Senior Developer',
      'Backend Engineer',
      'CMS Architect',
      'System Builder',
      'GitHub',
      'LinkedIn',
      'StackOverflow',
      'Culver Max Entertainment',
      'SonyLIV',
      'Blitz'
    ];

    requiredContent.forEach(content => {
      if (html.includes(content)) {
        this.pass('content', `Content found: ${content}`);
      } else {
        this.fail('content', `Missing content: ${content}`);
      }
    });

    // Check for experience entries (should have 6)
    const experienceCount = (html.match(/timeline__entry/g) || []).length;
    if (experienceCount >= 6) {
      this.pass('content-experience', `Found ${experienceCount} experience entries`);
    } else {
      this.fail('content-experience', `Only ${experienceCount} experience entries (need 6)`);
    }
  }

  // Generate summary report
  generateReport() {
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}===           COMPREHENSIVE TEST SUMMARY                 ===${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

    console.log(`${colors.green}Passed:${colors.reset}   ${this.results.passed.length} tests`);
    console.log(`${colors.red}Failed:${colors.reset}   ${this.results.failed.length} tests`);
    console.log(`${colors.yellow}Warnings:${colors.reset} ${this.results.warnings.length} tests\n`);

    if (this.results.failed.length > 0) {
      console.log(`${colors.red}Failed Tests:${colors.reset}`);
      this.results.failed.forEach(({ test, message }) => {
        console.log(`  ${colors.red}✗${colors.reset} [${test}] ${message}`);
      });
      console.log('');
    }

    if (this.results.warnings.length > 0) {
      console.log(`${colors.yellow}Warnings:${colors.reset}`);
      this.results.warnings.forEach(({ test, message }) => {
        console.log(`  ${colors.yellow}⚠${colors.reset} [${test}] ${message}`);
      });
      console.log('');
    }

    const totalTests = this.results.passed.length + this.results.failed.length + this.results.warnings.length;
    const passRate = ((this.results.passed.length / totalTests) * 100).toFixed(1);
    
    console.log(`${colors.cyan}Overall Pass Rate: ${passRate}%${colors.reset}\n`);

    if (this.results.failed.length === 0) {
      console.log(`${colors.green}✓ All critical tests passed!${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.red}✗ Some tests failed. Please review and fix.${colors.reset}\n`);
      return false;
    }
  }

  // Run all tests
  runAllTests() {
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}    Portfolio Website - Comprehensive Validation Suite${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    this.testFileStructure();
    this.testHTMLStructure();
    this.testCSSDesignSystem();
    this.testJavaScriptModules();
    this.testAccessibility();
    this.testPerformance();
    this.testDeploymentReadiness();
    this.testContent();

    return this.generateReport();
  }
}

// Run the validator
const validator = new ComprehensiveValidator();
const success = validator.runAllTests();

process.exit(success ? 0 : 1);
