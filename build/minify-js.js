const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// JavaScript files to minify (in order)
const jsFiles = [
  'js/animations.js',
  'js/scroll-manager.js',
  'js/navigation.js',
  'js/scripts.js'
];

// Read and concatenate all JS files
let combinedJS = '';
jsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`Reading ${file}...`);
    combinedJS += fs.readFileSync(filePath, 'utf8') + '\n';
  } else {
    console.warn(`Warning: ${file} not found`);
  }
});

// Minify the combined JavaScript
console.log('Minifying JavaScript...');
minify(combinedJS, {
  compress: {
    dead_code: true,
    drop_console: false,
    drop_debugger: true,
    keep_classnames: false,
    keep_fnames: false
  },
  mangle: {
    toplevel: false
  },
  format: {
    comments: false
  }
}).then(minified => {
  if (minified.error) {
    console.error('Error during minification:', minified.error);
    process.exit(1);
  }

  // Write minified JS to dist folder
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const outputPath = path.join(distDir, 'scripts.min.js');
  fs.writeFileSync(outputPath, minified.code);

  console.log(`✓ JavaScript minified successfully!`);
  console.log(`  Original size: ${(combinedJS.length / 1024).toFixed(2)} KB`);
  console.log(`  Minified size: ${(minified.code.length / 1024).toFixed(2)} KB`);
  console.log(`  Saved: ${((1 - minified.code.length / combinedJS.length) * 100).toFixed(2)}%`);
  console.log(`  Output: ${outputPath}`);
}).catch(err => {
  console.error('Error during minification:', err);
  process.exit(1);
});
