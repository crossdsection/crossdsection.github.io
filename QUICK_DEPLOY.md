# Quick Deploy to GitHub Pages

Fast reference guide for deploying to `crossdsection.github.io`.

## Prerequisites Check

```bash
# Run verification script
./verify-deployment.sh
```

## Deploy in 4 Steps

### 1. Build Production Assets

```bash
npm run build
```

**Output**: Creates `dist/styles.min.css` and `dist/scripts.min.js`

### 2. Switch to Production HTML

```bash
cp index.prod.html index.html
```

**What it does**: Replaces development version with production version that uses minified assets

### 3. Commit and Push

```bash
git add dist/ index.html README.md GITHUB_PAGES_SETUP.md GITHUB_PAGES_TEST.md verify-deployment.sh
git commit -m "chore: prepare for GitHub Pages deployment"
git push origin main
```

**Note**: Replace `main` with `master` if your default branch is `master`

### 4. Configure GitHub Pages (One-Time Setup)

1. Go to: `https://github.com/crossdsection/crossdsection.github.io/settings/pages`
2. Under **Source**:
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
3. Click **Save**
4. Check **Enforce HTTPS** (should be enabled by default)

## Verify Deployment

Wait 2-3 minutes, then:

```bash
# Check if site is live
curl -I https://crossdsection.github.io/

# Expected: HTTP/2 200 OK
```

Or visit in browser: [https://crossdsection.github.io/](https://crossdsection.github.io/)

## Test Checklist

- [ ] Site loads at `https://crossdsection.github.io/`
- [ ] HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] All assets load (check DevTools Network tab)
- [ ] Navigation works
- [ ] Animations work
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] No console errors

## Troubleshooting

### Site shows 404
- Wait 5-10 minutes for deployment to complete
- Check GitHub Actions tab for deployment status
- Verify `index.html` exists in repository root

### Assets not loading (404 errors)
- Verify `dist/` folder is committed: `git ls-files dist/`
- Check file paths in `index.html` match actual files
- Clear browser cache: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Styles/animations broken
- Verify you're using production HTML: `grep "dist/" index.html`
- Rebuild assets: `npm run build`
- Check browser console for JavaScript errors

## Rollback to Development

If you need to rollback:

```bash
git checkout HEAD~1 index.html
git push origin main
```

Or restore from git:

```bash
git restore index.html
git push origin main
```

## Update Deployment

When making changes:

```bash
# 1. Make your changes to source files (css/, js/)
# 2. Rebuild
npm run build

# 3. Update production HTML
cp index.prod.html index.html

# 4. Commit and push
git add .
git commit -m "feat: your changes description"
git push origin main

# 5. Wait 2-3 minutes for automatic redeployment
```

## Full Documentation

- **Setup Guide**: [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)
- **Testing Guide**: [GITHUB_PAGES_TEST.md](GITHUB_PAGES_TEST.md)
- **Build Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

## Support

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Status](https://www.githubstatus.com/)

---

**Repository**: https://github.com/crossdsection/crossdsection.github.io  
**Live Site**: https://crossdsection.github.io/
