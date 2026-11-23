/**
 * HTML and CSS Validation Script
 * Performs basic validation checks on HTML and CSS files
 */

const fs = require('fs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

class Validator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  log(message, type = 'info') {
    const prefix = {
      pass: `${colors.green}✓${colors.reset}`,
      fail: `${colors.red}✗${colors.reset}`,
      warn: `${colors.yellow}⚠${colors.reset}`,
      info: `${colors.cyan}ℹ${colors.reset}`
    };
    console.log(`${prefix[type]} ${message}`);
  }

  // Basic HTML validation
  validateHTML() {
    console.log(`\n${colors.cyan}=== HTML Validation ===${colors.reset}\n`);
    
    const html = fs.readFileSync('index.html', 'utf8');
    
    // Check for basic HTML structure
    if (!html.includes('<!DOCTYPE html>')) {
      this.errors.push('Missing DOCTYPE declaration');
      this.log('Missing DOCTYPE declaration', 'fail');
    } else {
      this.log('DOCTYPE declaration present', 'pass');
    }

    if (!html.includes('<html')) {
      this.errors.push('Missing <html> tag');
      this.log('Missing <html> tag', 'fail');
    } else {
      this.log('<html> tag present', 'pass');
    }

    if (!html.includes('lang=')) {
      this.warnings.push('Missing lang attribute on <html>');
      this.log('Missing lang attribute on <html>', 'warn');
    } else {
      this.log('lang attribute present', 'pass');
    }

    // Check for required meta tags
    if (!html.includes('<meta charset')) {
      this.errors.push('Missing charset meta tag');
      this.log('Missing charset meta tag', 'fail');
    } else {
      this.log('Charset meta tag present', 'pass');
    }

    if (!html.includes('viewport')) {
      this.errors.push('Missing viewport meta tag');
      this.log('Missing viewport meta tag', 'fail');
    } else {
      this.log('Viewport meta tag present', 'pass');
    }

    // Check for title
    if (!html.includes('<title>')) {
      this.errors.push('Missing <title> tag');
      this.log('Missing <title> tag', 'fail');
    } else {
      this.log('<title> tag present', 'pass');
    }

    // Check for unclosed tags (basic check)
    const openTags = html.match(/<(\w+)[^>]*>/g) || [];
    const closeTags = html.match(/<\/(\w+)>/g) || [];
    
    const selfClosingTags = ['meta', 'link', 'img', 'br', 'hr', 'input'];
    const openTagNames = openTags
      .map(tag => tag.match(/<(\w+)/)[1])
      .filter(tag => !selfClosingTags.includes(tag));
    
    const closeTagNames = closeTags.map(tag => tag.match(/<\/(\w+)>/)[1]);
    
    // Count occurrences
    const tagCounts = {};
    openTagNames.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    closeTagNames.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) - 1;
    });

    let unclosedTags = Object.entries(tagCounts).filter(([tag, count]) => count !== 0);
    
    if (unclosedTags.length > 0) {
      this.warnings.push(`Potential unclosed tags: ${unclosedTags.map(([tag]) => tag).join(', ')}`);
      this.log(`Potential unclosed tags detected (may be false positive)`, 'warn');
    } else {
      this.log('Tag balance check passed', 'pass');
    }

    // Check for duplicate IDs
    const ids = html.match(/id=["']([^"']+)["']/g) || [];
    const idValues = ids.map(id => id.match(/id=["']([^"']+)["']/)[1]);
    const duplicateIds = idValues.filter((id, index) => idValues.indexOf(id) !== index);
    
    if (duplicateIds.length > 0) {
      this.errors.push(`Duplicate IDs found: ${[...new Set(duplicateIds)].join(', ')}`);
      this.log(`Duplicate IDs found: ${[...new Set(duplicateIds)].join(', ')}`, 'fail');
    } else {
      this.log('No duplicate IDs found', 'pass');
    }

    // Check for alt attributes on images
    const images = html.match(/<img[^>]*>/g) || [];
    const imagesWithoutAlt = images.filter(img => !img.includes('alt='));
    
    if (imagesWithoutAlt.length > 0) {
      this.warnings.push(`${imagesWithoutAlt.length} images without alt attributes`);
      this.log(`${imagesWithoutAlt.length} images without alt attributes`, 'warn');
    } else if (images.length > 0) {
      this.log('All images have alt attributes', 'pass');
    }
  }

  // Basic CSS validation
  validateCSS() {
    console.log(`\n${colors.cyan}=== CSS Validation ===${colors.reset}\n`);
    
    const cssFiles = [
      'css/variables.css',
      'css/base.css',
      'css/layout.css',
      'css/components.css',
      'css/sections.css'
    ];

    cssFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        this.errors.push(`CSS file not found: ${file}`);
        this.log(`CSS file not found: ${file}`, 'fail');
        return;
      }

      const css = fs.readFileSync(file, 'utf8');
      
      // Check for unclosed braces
      const openBraces = (css.match(/{/g) || []).length;
      const closeBraces = (css.match(/}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        this.errors.push(`${file}: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
        this.log(`${file}: Mismatched braces`, 'fail');
      } else {
        this.log(`${file}: Brace balance correct`, 'pass');
      }

      // Check for empty rules
      const emptyRules = css.match(/[^}]\s*{\s*}/g) || [];
      if (emptyRules.length > 0) {
        this.warnings.push(`${file}: ${emptyRules.length} empty CSS rules`);
        this.log(`${file}: ${emptyRules.length} empty CSS rules`, 'warn');
      }

      // Check for vendor prefixes
      const vendorPrefixes = css.match(/-(webkit|moz|ms|o)-/g) || [];
      if (vendorPrefixes.length > 0) {
        this.log(`${file}: ${vendorPrefixes.length} vendor prefixes found`, 'pass');
      }
    });

    // Check for CSS custom properties in variables.css
    const variables = fs.readFileSync('css/variables.css', 'utf8');
    const customProps = variables.match(/--[\w-]+:/g) || [];
    
    if (customProps.length > 0) {
      this.log(`Found ${customProps.length} CSS custom properties`, 'pass');
    } else {
      this.warnings.push('No CSS custom properties found in variables.css');
      this.log('No CSS custom properties found in variables.css', 'warn');
    }

    // Check for responsive breakpoints
    const layout = fs.readFileSync('css/layout.css', 'utf8');
    const mediaQueries = layout.match(/@media[^{]+/g) || [];
    
    if (mediaQueries.length > 0) {
      this.log(`Found ${mediaQueries.length} media queries`, 'pass');
    } else {
      this.warnings.push('No media queries found in layout.css');
      this.log('No media queries found in layout.css', 'warn');
    }
  }

  // Validate JavaScript syntax (basic)
  validateJavaScript() {
    console.log(`\n${colors.cyan}=== JavaScript Validation ===${colors.reset}\n`);
    
    const jsFiles = [
      'js/animations.js',
      'js/scroll-manager.js',
      'js/navigation.js',
      'js/main.js'
    ];

    jsFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        this.errors.push(`JavaScript file not found: ${file}`);
        this.log(`JavaScript file not found: ${file}`, 'fail');
        return;
      }

      const js = fs.readFileSync(file, 'utf8');
      
      // Check for balanced braces
      const openBraces = (js.match(/{/g) || []).length;
      const closeBraces = (js.match(/}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        this.errors.push(`${file}: Mismatched braces`);
        this.log(`${file}: Mismatched braces`, 'fail');
      } else {
        this.log(`${file}: Brace balance correct`, 'pass');
      }

      // Check for balanced parentheses (basic)
      const openParens = (js.match(/\(/g) || []).length;
      const closeParens = (js.match(/\)/g) || []).length;
      
      if (openParens !== closeParens) {
        this.errors.push(`${file}: Mismatched parentheses`);
        this.log(`${file}: Mismatched parentheses`, 'fail');
      } else {
        this.log(`${file}: Parenthesis balance correct`, 'pass');
      }

      // Check for console.log statements (should be removed in production)
      const consoleLogs = js.match(/console\.log/g) || [];
      if (consoleLogs.length > 0) {
        this.warnings.push(`${file}: ${consoleLogs.length} console.log statements`);
        this.log(`${file}: ${consoleLogs.length} console.log statements (consider removing)`, 'warn');
      }
    });
  }

  // Generate report
  generateReport() {
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}===           VALIDATION SUMMARY                         ===${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

    console.log(`${colors.red}Errors:${colors.reset}   ${this.errors.length}`);
    console.log(`${colors.yellow}Warnings:${colors.reset} ${this.warnings.length}\n`);

    if (this.errors.length > 0) {
      console.log(`${colors.red}Errors:${colors.reset}`);
      this.errors.forEach(error => {
        console.log(`  ${colors.red}✗${colors.reset} ${error}`);
      });
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log(`${colors.yellow}Warnings:${colors.reset}`);
      this.warnings.forEach(warning => {
        console.log(`  ${colors.yellow}⚠${colors.reset} ${warning}`);
      });
      console.log('');
    }

    if (this.errors.length === 0) {
      console.log(`${colors.green}✓ No critical errors found!${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.red}✗ Please fix the errors above.${colors.reset}\n`);
      return false;
    }
  }

  runAll() {
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}         HTML, CSS, and JavaScript Validation${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);

    this.validateHTML();
    this.validateCSS();
    this.validateJavaScript();

    return this.generateReport();
  }
}

const validator = new Validator();
const success = validator.runAll();

process.exit(success ? 0 : 1);
