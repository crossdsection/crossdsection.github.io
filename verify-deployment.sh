#!/bin/bash

# GitHub Pages Deployment Verification Script
# This script verifies that all necessary files are in place for GitHub Pages deployment

echo "🔍 GitHub Pages Deployment Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 is missing"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Function to check directory existence
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 directory exists"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 directory is missing"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Function to check file content
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 contains '$2'"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 does not contain '$2'"
        ((CHECKS_FAILED++))
        return 1
    fi
}

echo "📁 Checking Required Files"
echo "-------------------------"
check_file ".nojekyll"
check_file "index.html"
check_file "index.prod.html"
check_file "README.md"
echo ""

echo "📦 Checking Production Assets"
echo "----------------------------"
check_dir "dist"
check_file "dist/styles.min.css"
check_file "dist/scripts.min.js"
echo ""

echo "🎨 Checking Source Files"
echo "----------------------"
check_dir "css"
check_dir "js"
echo ""

echo "🔧 Checking Production Configuration"
echo "-----------------------------------"

# Check if index.html is using production assets
if grep -q "dist/styles.min.css" index.html; then
    echo -e "${GREEN}✓${NC} index.html is using production assets (dist/)"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠${NC} index.html is using development assets (css/ and js/)"
    echo -e "  ${YELLOW}→${NC} Run: cp index.prod.html index.html"
    ((CHECKS_FAILED++))
fi

# Check if production HTML references minified files
if grep -q "dist/scripts.min.js" index.prod.html; then
    echo -e "${GREEN}✓${NC} index.prod.html references minified JavaScript"
    ((CHECKS_PASSED++))
else
    echo -e "${RED}✗${NC} index.prod.html does not reference minified JavaScript"
    ((CHECKS_FAILED++))
fi
echo ""

echo "📊 Checking File Sizes"
echo "--------------------"
if [ -f "dist/styles.min.css" ]; then
    CSS_SIZE=$(du -h dist/styles.min.css | cut -f1)
    echo -e "${GREEN}✓${NC} Minified CSS: $CSS_SIZE"
fi

if [ -f "dist/scripts.min.js" ]; then
    JS_SIZE=$(du -h dist/scripts.min.js | cut -f1)
    echo -e "${GREEN}✓${NC} Minified JS: $JS_SIZE"
fi
echo ""

echo "🌐 Repository Information"
echo "-----------------------"
if git remote -v | grep -q "crossdsection.github.io"; then
    echo -e "${GREEN}✓${NC} Repository is crossdsection.github.io"
    ((CHECKS_PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Repository name may not match GitHub Pages format"
    echo -e "  ${YELLOW}→${NC} Expected: crossdsection.github.io"
fi

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ -n "$CURRENT_BRANCH" ]; then
    echo -e "${GREEN}✓${NC} Current branch: $CURRENT_BRANCH"
    if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
        echo -e "${GREEN}✓${NC} Branch is suitable for GitHub Pages"
        ((CHECKS_PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} GitHub Pages typically deploys from 'main' or 'master'"
    fi
fi
echo ""

echo "📋 Summary"
echo "--------"
echo -e "Checks passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Checks failed: ${RED}$CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for GitHub Pages deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Ensure production build: npm run build"
    echo "2. Switch to production HTML: cp index.prod.html index.html"
    echo "3. Commit changes: git add . && git commit -m 'chore: prepare for GitHub Pages'"
    echo "4. Push to GitHub: git push origin main"
    echo "5. Configure GitHub Pages in repository settings"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please review the issues above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "- Run 'npm run build' to generate minified assets"
    echo "- Run 'cp index.prod.html index.html' to use production version"
    echo "- Ensure all source files are present in css/ and js/ directories"
    echo ""
    exit 1
fi
