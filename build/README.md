# Production Build Process

This directory contains scripts for minifying CSS and JavaScript assets for production deployment.

## Setup

Install the required dependencies:

```bash
npm install
```

## Building for Production

### Minify All Assets

```bash
npm run build
```

This will:
1. Minify all CSS files into `dist/styles.min.css`
2. Minify all JavaScript files into `dist/scripts.min.js`

### Minify CSS Only

```bash
npm run build:css
```

### Minify JavaScript Only

```bash
npm run build:js
```

## Output

Minified files are generated in the `dist/` directory:
- `dist/styles.min.css` - Combined and minified CSS
- `dist/scripts.min.js` - Combined and minified JavaScript

## Using Minified Assets

To use the minified assets in production, update your `index.html` to reference the minified files:

```html
<!-- Replace multiple CSS links with: -->
<link rel="stylesheet" href="dist/styles.min.css">

<!-- Replace multiple JS scripts with: -->
<script src="dist/scripts.min.js" defer></script>
```

## File Processing Order

### CSS Files (in order):
1. css/variables.css
2. css/base.css
3. css/layout.css
4. css/components.css
5. css/sections.css

### JavaScript Files (in order):
1. js/animations.js
2. js/scroll-manager.js
3. js/navigation.js
4. js/scripts.js

## Tools Used

- **clean-css**: CSS minification with level 2 optimization
- **terser**: JavaScript minification with compression and mangling
