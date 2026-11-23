# GitHub Pages Setup Guide

This guide provides step-by-step instructions for configuring the repository for GitHub Pages deployment at `crossdsection.github.io`.

## Prerequisites

- Repository must be named `crossdsection.github.io` (GitHub Pages user site format)
- You must have admin access to the repository
- Production build must be completed (`npm run build`)

## Configuration Steps

### 1. Prepare Production Build

Before configuring GitHub Pages, ensure the production build is ready:

```bash
# Install dependencies (if not already done)
npm install

# Build minified assets
npm run build

# Prepare production HTML
cp index.prod.html index.html

# Commit production files
git add dist/ index.html
git commit -m "chore: prepare production build for GitHub Pages"
git push origin main
```

### 2. Configure Repository Settings

1. Navigate to your repository on GitHub: `https://github.com/crossdsection/crossdsection.github.io`

2. Click on **Settings** (gear icon in the top menu)

3. In the left sidebar, click on **Pages** (under "Code and automation")

4. Under **Source**, configure the following:
   - **Branch**: Select `main`
   - **Folder**: Select `/ (root)`
   - Click **Save**

5. GitHub will display a message: "Your site is ready to be published at `https://crossdsection.github.io/`"

### 3. Enable HTTPS

HTTPS should be enabled by default for GitHub Pages, but verify:

1. In the same **Pages** settings section, scroll down to **Enforce HTTPS**

2. Ensure the checkbox **"Enforce HTTPS"** is checked ✓

3. If it's not available immediately, wait a few minutes for the initial deployment to complete

**Note**: HTTPS enforcement may take a few minutes to become available after the first deployment.

### 4. Verify Deployment

After configuration, GitHub Pages will automatically build and deploy your site. This typically takes 1-3 minutes.

#### Check Deployment Status

1. In the **Pages** settings, you'll see a deployment status message:
   - "Your site is live at `https://crossdsection.github.io/`" (when ready)
   - Or a building/queued message (if still deploying)

2. You can also check the **Actions** tab in your repository to see the deployment workflow

#### Test the Live Site

Once deployed, verify the following:

1. **Site Accessibility**
   ```bash
   # Test if site is accessible
   curl -I https://crossdsection.github.io/
   ```
   Expected: HTTP 200 OK response

2. **HTTPS Enforcement**
   - Visit `http://crossdsection.github.io/` (without 's')
   - Should automatically redirect to `https://crossdsection.github.io/`

3. **Asset Loading**
   - Open `https://crossdsection.github.io/` in a browser
   - Open DevTools (F12) → Network tab
   - Verify all assets load successfully:
     - `dist/styles.min.css` (200 OK)
     - `dist/scripts.min.js` (200 OK)
     - All images and fonts (200 OK)

4. **Functionality Testing**
   - Test navigation menu (smooth scrolling)
   - Test hero section animations (typing effect)
   - Test timeline entry expansion
   - Test project card flips
   - Test responsive design (resize browser window)
   - Test on mobile device

5. **Performance Verification**
   - Run Lighthouse audit in Chrome DevTools
   - Target scores: Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+

## Repository Files for GitHub Pages

Ensure these files are present in your repository:

### Required Files

- ✓ `.nojekyll` - Prevents Jekyll processing (already present)
- ✓ `index.html` - Main entry point (production version)
- ✓ `dist/styles.min.css` - Minified CSS
- ✓ `dist/scripts.min.js` - Minified JavaScript
- ✓ `css/` - Source CSS files (optional, for development)
- ✓ `js/` - Source JavaScript files (optional, for development)
- ✓ `assets/` or `img/` - Images and media files

### Optional Files

- `CNAME` - Custom domain configuration (if using custom domain)
- `404.html` - Custom 404 error page
- `robots.txt` - Search engine crawling instructions
- `sitemap.xml` - Site structure for search engines

## Custom Domain (Optional)

If you want to use a custom domain instead of `crossdsection.github.io`:

1. Create a `CNAME` file in the repository root:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push origin main
   ```

2. Configure DNS records with your domain provider:
   - Add an `A` record pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a `CNAME` record pointing to `crossdsection.github.io`

3. In GitHub Pages settings, enter your custom domain and save

4. Wait for DNS propagation (can take up to 48 hours)

## Troubleshooting

### Site Not Loading

**Problem**: 404 error when visiting `crossdsection.github.io`

**Solutions**:
- Verify `index.html` exists in the repository root
- Check GitHub Pages settings are configured correctly
- Wait 5-10 minutes for deployment to complete
- Check the Actions tab for deployment errors

### Assets Not Loading (404 errors)

**Problem**: CSS/JS files return 404 errors

**Solutions**:
- Verify `dist/` folder is committed to the repository
- Check file paths in `index.html` match actual file locations
- Ensure `.gitignore` is not excluding `dist/` folder
- Run `git add dist/ -f` if needed to force-add

### HTTPS Not Available

**Problem**: "Enforce HTTPS" option is grayed out

**Solutions**:
- Wait 10-15 minutes after initial deployment
- Ensure the site is accessible via HTTP first
- Check that DNS is properly configured (if using custom domain)
- Try disabling and re-enabling GitHub Pages

### Styles/Animations Not Working

**Problem**: Site loads but looks broken or animations don't work

**Solutions**:
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for JavaScript errors
- Verify minified files were built correctly: `npm run build`
- Test locally first: `python3 -m http.server 8000`

### Build Failures

**Problem**: GitHub Actions deployment fails

**Solutions**:
- Check the Actions tab for error messages
- Verify all files are committed and pushed
- Ensure no syntax errors in HTML/CSS/JS
- Check that file names are case-sensitive correct

## Deployment Checklist

Use this checklist to verify your GitHub Pages setup:

- [ ] Repository is named `crossdsection.github.io`
- [ ] Production build completed (`npm run build`)
- [ ] `index.html` contains production version (references `dist/` files)
- [ ] `.nojekyll` file exists in repository root
- [ ] `dist/` folder with minified assets is committed
- [ ] GitHub Pages source set to `main` branch, `/ (root)` folder
- [ ] HTTPS enforcement is enabled
- [ ] Site is accessible at `https://crossdsection.github.io/`
- [ ] HTTP redirects to HTTPS
- [ ] All assets load without 404 errors
- [ ] Navigation and interactions work correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Lighthouse performance score is 90+

## Continuous Deployment (Optional)

For automatic deployments on every push, see the GitHub Actions workflow in `DEPLOYMENT.md`.

## Support Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)
- [Custom Domain Configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## Next Steps

After successful deployment:

1. Share your portfolio URL: `https://crossdsection.github.io/`
2. Monitor site performance with Google Analytics (optional)
3. Set up custom domain (optional)
4. Configure SEO metadata and sitemap (optional)
5. Submit to search engines for indexing (optional)

---

**Last Updated**: 2024
**Repository**: https://github.com/crossdsection/crossdsection.github.io
