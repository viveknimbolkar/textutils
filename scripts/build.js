const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const ROOT_DIR = path.join(__dirname, '../');

// Whitelist of files/folders to copy
const INCLUDES = [
    'css',
    'js',
    'assets',
    'robots.txt',
    'sitemap.xml',
    '.html' // Special case: copy all .html files in root
];

// Clean or create dist
if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR);

function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(child => {
            copyRecursive(path.join(src, child), path.join(dest, child));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log('🏗️  Building production assets...');

// Copy specific items
const files = fs.readdirSync(ROOT_DIR);

files.forEach(file => {
    const srcPath = path.join(ROOT_DIR, file);
    const destPath = path.join(DIST_DIR, file);

    // Check if file matches whitelist
    const isHtml = file.endsWith('.html');
    const isWhitelisted = INCLUDES.includes(file);

    if (isHtml || isWhitelisted) {
        if (file === 'dist' || file === 'scripts' || file === 'node_modules') return;

        console.log(`   Copying: ${file}`);
        
        if (file === 'sitemap.xml') {
            const today = new Date().toISOString().split('T')[0];
            let content = fs.readFileSync(srcPath, 'utf8');
            content = content.replace(/<lastmod>.*<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
            fs.writeFileSync(destPath, content);
            console.log(`   ✨ Updated sitemap.xml lastmod to ${today}`);
        } else {
            copyRecursive(srcPath, destPath);
        }
    }
});

console.log('✅ Build complete! Deploy the "dist" folder.');
