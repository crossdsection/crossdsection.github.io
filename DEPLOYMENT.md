# Deployment Guide

This guide explains how to deploy the portfolio website to production with minified assets.

## Production Build Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Minified Assets

```bash
npm run build
```

This command will:
- Minify all CSS files into `dist/styles.min.css` (saves ~33%)
- Minify all JavaScript files into `dist/scripts.min.js` (saves ~56%)

### 3. Use Production HTML

For production deployment, use `index.prod.html` which references the minified assets:

```bash
# Option 1: Rename for deployment
cp index.prod.html index.html

# Option 2: Deploy index.prod.html directly
# (configure your web server to serve index.prod.html as the default)
```

## File Structure

```
portfolio-website/
├── dist/                    # Minified production assets
│   ├── styles.min.css      # Combined & minified CSS (36 KB)
│   └── scripts.min.js      # Combined & minified JS (13 KB)
├── css/                     # Source CSS files
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── sections.css
├── js/                      # Source JavaScript files
│   ├── animations.js
│   ├── scroll-manager.js
│   ├── navigation.js
│   └── scripts.js
├── build/                   # Build scripts
│   ├── minify-css.js
│   ├── minify-js.js
│   └── README.md
├── index.html              # Development version (unminified)
├── index.prod.html         # Production version (minified)
└── package.json            # Build configuration
```

## GitHub Pages Deployment

### Method 1: Direct Deployment

1. Build the minified assets:
   ```bash
   npm run build
   ```

2. Rename production HTML:
   ```bash
   cp index.prod.html index.html
   ```

3. Commit and push:
   ```bash
   git add dist/ index.html
   git commit -m "Build: Add minified production assets"
   git push origin main
   ```

4. Configure GitHub Pages:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/" (root) folder
   - Save

### Method 2: Separate Production Branch

1. Create a production branch:
   ```bash
   git checkout -b production
   ```

2. Build and prepare:
   ```bash
   npm run build
   cp index.prod.html index.html
   ```

3. Commit production files:
   ```bash
   git add dist/ index.html
   git commit -m "Production build"
   git push origin production
   ```

4. Configure GitHub Pages to deploy from the `production` branch

## Performance Optimization Results

### CSS Minification
- **Original size**: 53.92 KB
- **Minified size**: 35.88 KB
- **Savings**: 33.46%

### JavaScript Minification
- **Original size**: 29.09 KB
- **Minified size**: 12.94 KB
- **Savings**: 55.53%

### Total Savings
- **Combined original**: 83.01 KB
- **Combined minified**: 48.82 KB
- **Total savings**: 41.2%

## Development vs Production

### Development (index.html)
- Uses separate, unminified CSS and JS files
- Easier debugging with readable code
- Faster development iteration
- Larger file sizes

### Production (index.prod.html)
- Uses combined, minified assets from `dist/`
- Optimized for performance
- Smaller file sizes
- Faster page load times

## Continuous Deployment

To automate the build process, you can add a GitHub Actions workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build assets
        run: npm run build
      
      - name: Prepare production
        run: cp index.prod.html index.html
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## Verification

After deployment, verify:

1. **Assets are loading**: Check browser DevTools Network tab
2. **File sizes**: Confirm minified files are being served
3. **Functionality**: Test all interactive features
4. **Performance**: Run Lighthouse audit (target: 90+ score)

## Troubleshooting

### Assets not loading
- Verify `dist/` folder is committed to repository
- Check file paths in `index.prod.html`
- Ensure GitHub Pages is configured correctly

### Styles/Scripts not working
- Clear browser cache
- Check browser console for errors
- Verify minification didn't break functionality

### Build errors
- Delete `node_modules/` and run `npm install` again
- Check Node.js version (requires v14+)
- Review error messages in build output

## Rollback

To rollback to development version:

```bash
git checkout index.html
git push origin main
```

## Support

For issues or questions:
- Check build logs: `npm run build`
- Review browser console errors
- Verify all source files are present
