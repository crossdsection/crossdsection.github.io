# GitHub Pages Testing Guide

This guide provides comprehensive testing procedures to verify your GitHub Pages deployment at `crossdsection.github.io`.

## Pre-Deployment Testing

Before deploying to GitHub Pages, test locally to ensure everything works correctly.

### Local Testing with Python HTTP Server

```bash
# Prepare production build
npm run build
cp index.prod.html index.html

# Start local server
python3 -m http.server 8000

# Or use Python 2
python -m SimpleHTTPServer 8000
```

Visit `http://localhost:8000` in your browser and perform the tests below.

### Local Testing with Node.js

```bash
# Install http-server globally (one-time)
npm install -g http-server

# Start server
http-server -p 8000

# Or use npx (no installation needed)
npx http-server -p 8000
```

Visit `http://localhost:8000` in your browser.

## Post-Deployment Testing

After deploying to GitHub Pages, perform these tests on the live site.

### 1. Accessibility Test

**URL**: `https://crossdsection.github.io/`

**Expected Result**: Site loads successfully with HTTPS

**Test Steps**:
```bash
# Test HTTP to HTTPS redirect
curl -I http://crossdsection.github.io/

# Expected: 301 Moved Permanently or 302 redirect to HTTPS
# Location: https://crossdsection.github.io/

# Test HTTPS access
curl -I https://crossdsection.github.io/

# Expected: HTTP/2 200 OK
```

**Browser Test**:
1. Open `http://crossdsection.github.io/` (without 's')
2. Verify automatic redirect to `https://crossdsection.github.io/`
3. Check for secure padlock icon in address bar

### 2. Asset Loading Test

**Test Steps**:
1. Open `https://crossdsection.github.io/` in Chrome/Firefox
2. Open DevTools (F12) → Network tab
3. Reload page (Ctrl+R or Cmd+R)
4. Verify all assets return 200 OK:
   - `index.html` (200 OK)
   - `dist/styles.min.css` (200 OK)
   - `dist/scripts.min.js` (200 OK)
   - All images in `assets/` or `img/` (200 OK)

**Expected Results**:
- No 404 errors
- No CORS errors
- All assets load from `crossdsection.github.io` domain
- Total page size < 100 KB (with minified assets)

**Command Line Test**:
```bash
# Test CSS loading
curl -I https://crossdsection.github.io/dist/styles.min.css
# Expected: HTTP/2 200 OK, Content-Type: text/css

# Test JS loading
curl -I https://crossdsection.github.io/dist/scripts.min.js
# Expected: HTTP/2 200 OK, Content-Type: application/javascript
```

### 3. Functionality Test

Test all interactive features on the live site.

#### Navigation Menu
- [ ] Navigation bar is visible at top
- [ ] All navigation links are clickable
- [ ] Clicking a link smoothly scrolls to the section
- [ ] Active section is highlighted in navigation
- [ ] Mobile: Hamburger menu opens/closes correctly
- [ ] Mobile: Menu links work and close menu after click

#### Hero Section
- [ ] Hero section occupies full viewport height
- [ ] Name "Piyush Kumar" types out with animation
- [ ] Blinking cursor appears after name
- [ ] Subtitle cycles through all four roles:
  - "Senior Developer"
  - "Backend Engineer"
  - "CMS Architect"
  - "System Builder"
- [ ] Subtitle typing animation works smoothly
- [ ] CTA buttons (GitHub, LinkedIn, StackOverflow) are visible
- [ ] CTA buttons open correct URLs in new tabs
- [ ] Contact information (phone, email) is displayed
- [ ] Background animation (particles/code-rain) is visible

#### About Section
- [ ] Professional summary is readable
- [ ] Education history displays all three entries
- [ ] Stat counters animate when section enters viewport
- [ ] Stat counters count from 0 to target values:
  - 9+ Years Experience
  - 6 Companies
  - 15+ Technologies
  - 10+ Products Built
- [ ] Animation completes in ~2 seconds

#### Experience Timeline
- [ ] Timeline displays vertical center line (desktop/tablet)
- [ ] All six experience entries are visible
- [ ] Entries are in reverse chronological order (newest first)
- [ ] "CURRENT" badge appears on Culver Max Entertainment entry
- [ ] "CURRENT" badge has glow effect
- [ ] The Utopia Academy entry has special styling
- [ ] Desktop: Entries alternate left/right
- [ ] Mobile: All entries in single column
- [ ] Clicking an entry expands it to show details
- [ ] Clicking again collapses the entry
- [ ] Chevron/plus icon indicates expandable state
- [ ] Entries slide in when scrolling into view

#### Skills Section
- [ ] Skills display as tag cloud
- [ ] Skills are color-coded by category:
  - Backend (Python, NodeJS, Golang, etc.)
  - Frontend (HTML5, CSS3, JavaScript, etc.)
  - Databases (MongoDB, MySQL, etc.)
  - Cloud & DevOps (AWS Lambda, Docker, etc.)
  - Mobile (Cordova, Ionic, etc.)
  - Tools (Puppeteer, Jest, Git, etc.)
- [ ] Hovering over a skill tag shows glow effect
- [ ] Tags are readable and properly spaced

#### Projects Section
- [ ] Projects display in grid layout
- [ ] Desktop: 3 columns
- [ ] Tablet: 2 columns
- [ ] Mobile: 1 column
- [ ] All six projects are visible:
  - Blitz
  - Core Platform
  - Talkstock
  - Tribepod
  - Sputnik
  - Bizom
- [ ] Hovering over a project card flips it
- [ ] Back of card shows technology stack
- [ ] Flip animation is smooth (~0.6 seconds)
- [ ] Cards flip back when hover ends

#### Achievements Section
- [ ] Achievements display in git commit log style
- [ ] Each achievement has a checkmark icon
- [ ] All achievements are visible (minimum 5)
- [ ] Achievements fade in when scrolling into view
- [ ] Fade-in animation duration is ~0.4 seconds

#### Footer
- [ ] Footer is visible at bottom of page
- [ ] All links are present:
  - GitHub
  - LinkedIn
  - StackOverflow
  - Email
  - Phone
- [ ] Links open in new tabs (external links)
- [ ] Tagline "Currently building Blitz @ SonyLIV" is displayed

### 4. Responsive Design Test

Test the site on different viewport sizes.

#### Desktop (>1024px)
- [ ] Navigation bar is horizontal
- [ ] Hero section is full viewport
- [ ] About section uses two-column layout
- [ ] Timeline has center line with alternating entries
- [ ] Projects grid shows 3 columns
- [ ] All text is readable
- [ ] No horizontal scrolling

#### Tablet (768px - 1024px)
- [ ] Navigation bar is horizontal
- [ ] About section adapts layout
- [ ] Timeline has center line
- [ ] Projects grid shows 2 columns
- [ ] All touch targets are accessible
- [ ] No horizontal scrolling

#### Mobile (<768px)
- [ ] Navigation shows hamburger menu
- [ ] Hamburger menu expands to full screen
- [ ] All sections display in single column
- [ ] Timeline entries are left-aligned
- [ ] Projects grid shows 1 column
- [ ] Stats display in 2x2 grid
- [ ] Text size is minimum 16px
- [ ] Touch targets are minimum 44x44px
- [ ] No horizontal scrolling

**Testing Tools**:
- Chrome DevTools: Toggle device toolbar (Ctrl+Shift+M)
- Test on actual devices: iPhone, iPad, Android phone/tablet
- Browser window resize: Drag to different widths

### 5. Performance Test

#### Lighthouse Audit

1. Open `https://crossdsection.github.io/` in Chrome
2. Open DevTools (F12) → Lighthouse tab
3. Select:
   - Mode: Navigation
   - Device: Mobile and Desktop
   - Categories: All
4. Click "Analyze page load"

**Expected Scores** (Mobile):
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**Expected Scores** (Desktop):
- Performance: 95+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

#### Load Time Test

```bash
# Test page load time
curl -w "@curl-format.txt" -o /dev/null -s https://crossdsection.github.io/

# Create curl-format.txt with:
# time_namelookup:  %{time_namelookup}\n
# time_connect:  %{time_connect}\n
# time_starttransfer:  %{time_starttransfer}\n
# time_total:  %{time_total}\n
```

**Expected Results**:
- Total load time: < 3 seconds
- Time to first byte: < 1 second
- DOM content loaded: < 2 seconds

#### Network Performance

**Test in DevTools Network Tab**:
- [ ] Total page size: < 100 KB (with minified assets)
- [ ] Number of requests: < 20
- [ ] CSS file size: ~36 KB (minified)
- [ ] JS file size: ~13 KB (minified)
- [ ] All assets use compression (gzip/brotli)
- [ ] Caching headers are present

### 6. Accessibility Test

#### Keyboard Navigation
- [ ] Tab key navigates through all interactive elements
- [ ] Focus indicators are visible
- [ ] Enter key activates buttons and links
- [ ] Escape key closes mobile menu
- [ ] No keyboard traps

#### Screen Reader Test
- [ ] All images have alt text
- [ ] Headings follow logical hierarchy (h1 → h2 → h3)
- [ ] ARIA labels are present on icon-only buttons
- [ ] Semantic HTML elements are used (header, nav, main, section, footer)
- [ ] Links have descriptive text

#### Reduced Motion Test
```css
/* Test by enabling reduced motion in OS settings */
/* Or use browser DevTools to emulate */
```

- [ ] Animations respect `prefers-reduced-motion` media query
- [ ] Site is still functional with animations disabled

**Testing Tools**:
- Chrome DevTools: Rendering → Emulate CSS media feature prefers-reduced-motion
- WAVE browser extension
- axe DevTools extension

### 7. Cross-Browser Test

Test on multiple browsers to ensure compatibility.

#### Chrome/Chromium
- [ ] All features work correctly
- [ ] Animations are smooth
- [ ] Layout is correct

#### Firefox
- [ ] All features work correctly
- [ ] Animations are smooth
- [ ] Layout is correct

#### Safari (macOS/iOS)
- [ ] All features work correctly
- [ ] Animations are smooth
- [ ] Layout is correct
- [ ] Touch interactions work on iOS

#### Edge
- [ ] All features work correctly
- [ ] Animations are smooth
- [ ] Layout is correct

**Testing Tools**:
- BrowserStack (cross-browser testing service)
- Local browser installations
- Virtual machines for different OS

### 8. SEO Test

#### Meta Tags
```bash
# Check meta tags
curl -s https://crossdsection.github.io/ | grep -i "<meta"
```

**Expected Meta Tags**:
- [ ] `<meta charset="UTF-8">`
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] `<meta name="description" content="...">`
- [ ] `<title>` tag is present and descriptive

#### Social Media Tags (Optional)
- [ ] Open Graph tags for Facebook/LinkedIn
- [ ] Twitter Card tags

#### Structured Data (Optional)
- [ ] JSON-LD schema for Person/Portfolio

**Testing Tools**:
- Google Search Console
- Facebook Sharing Debugger
- Twitter Card Validator

### 9. Security Test

#### HTTPS Configuration
```bash
# Test SSL certificate
openssl s_client -connect crossdsection.github.io:443 -servername crossdsection.github.io

# Check SSL Labs rating
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=crossdsection.github.io
```

**Expected Results**:
- [ ] Valid SSL certificate
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] No mixed content warnings
- [ ] Secure headers present

#### Content Security
- [ ] No inline JavaScript (all in external files)
- [ ] External links use `rel="noopener"` or `rel="noreferrer"`
- [ ] No sensitive data exposed in source code

### 10. Error Handling Test

#### 404 Page
```bash
# Test non-existent page
curl -I https://crossdsection.github.io/nonexistent-page
```

**Expected**: 404 error (GitHub Pages default 404 page)

**Optional**: Create custom `404.html` for better UX

#### JavaScript Errors
- [ ] Open browser console (F12)
- [ ] No JavaScript errors in console
- [ ] No CSS errors or warnings
- [ ] No network errors

## Testing Checklist Summary

Use this quick checklist for deployment verification:

- [ ] Site accessible at `https://crossdsection.github.io/`
- [ ] HTTPS enforced (HTTP redirects)
- [ ] All assets load (no 404 errors)
- [ ] Navigation works (smooth scrolling)
- [ ] All animations work correctly
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Lighthouse score 90+ (all categories)
- [ ] Page loads in < 3 seconds
- [ ] Keyboard navigation works
- [ ] Cross-browser compatible
- [ ] No console errors

## Automated Testing (Optional)

For continuous testing, consider setting up automated tests:

### Playwright/Cypress Tests
```javascript
// Example test
test('homepage loads correctly', async ({ page }) => {
  await page.goto('https://crossdsection.github.io/');
  await expect(page).toHaveTitle(/Piyush Kumar/);
  await expect(page.locator('.hero__name')).toBeVisible();
});
```

### Lighthouse CI
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: treosh/lighthouse-ci-action@v8
        with:
          urls: 'https://crossdsection.github.io/'
          uploadArtifacts: true
```

## Troubleshooting

If any tests fail, refer to the troubleshooting section in `GITHUB_PAGES_SETUP.md`.

## Reporting Issues

If you find issues during testing:

1. Document the issue:
   - What you expected
   - What actually happened
   - Steps to reproduce
   - Browser/device information
   - Screenshots/videos if applicable

2. Check browser console for errors

3. Verify the issue exists on the live site (not just locally)

4. Create a GitHub issue with the documentation

---

**Last Updated**: 2024
**Repository**: https://github.com/crossdsection/crossdsection.github.io
