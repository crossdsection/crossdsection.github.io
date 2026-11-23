const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

// CSS files to minify (in order)
const cssFiles = [
  'css/variables.css',
  'css/base.css',
  'css/layout.css',
  'css/components.css',
  'css/sections.css'
];

// Read and concatenate all CSS files
let combinedCSS = '';
cssFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`Reading ${file}...`);
    combinedCSS += fs.readFileSync(filePath, 'utf8') + '\n';
  } else {
    console.warn(`Warning: ${file} not found`);
  }
});

// Minify the combined CSS
console.log('Minifying CSS...');
const minified = new CleanCSS({
  level: 2,
  returnPromise: false
}).minify(combinedCSS);

if (minified.errors.length > 0) {
  console.error('Errors during minification:');
  minified.errors.forEach(err => console.error(err));
  process.exit(1);
}

// Write minified CSS to dist folder
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const outputPath = path.join(distDir, 'styles.min.css');
fs.writeFileSync(outputPath, minified.styles);

console.log(`✓ CSS minified successfully!`);
console.log(`  Original size: ${(combinedCSS.length / 1024).toFixed(2)} KB`);
console.log(`  Minified size: ${(minified.styles.length / 1024).toFixed(2)} KB`);
console.log(`  Saved: ${((1 - minified.styles.length / combinedCSS.length) * 100).toFixed(2)}%`);
console.log(`  Output: ${outputPath}`);
