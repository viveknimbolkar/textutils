// Main App Entry Point
// Uses dynamic imports to prevent one missing file from crashing the entire app

const loadModule = async (path) => {
    try {
        const module = await import(path);
        return module;
    } catch (e) {
        console.error(`Failed to load module: ${path}`, e);
        return null;
    }
};

const initApp = async () => {
    console.log('Initializing App...');

    // 1. Load Components (Critical)
    const headerMod = await loadModule('./components/header.js');
    const footerMod = await loadModule('./components/footer.js');

    // 2. Inject Components
    if (headerMod && headerMod.renderHeader) {
        const headerEl = document.getElementById('app-header');
        if (headerEl) headerEl.outerHTML = headerMod.renderHeader();
    }

    if (footerMod && footerMod.renderFooter) {
        const footerEl = document.getElementById('app-footer');
        if (footerEl) footerEl.outerHTML = footerMod.renderFooter();
    }

    // 3. Load Features (Non-Critical)
    const themeMod = await loadModule('./theme.js');
    if (themeMod && themeMod.default) {
        try { themeMod.default(); } catch (e) { console.error('Theme init error', e); }
    }

    const searchMod = await loadModule('./search.js');
    if (searchMod && searchMod.default) {
        try { searchMod.default(); } catch (e) { console.error('Search init error', e); }
    }

    // 4. Load Find & Replace (if on that page)
    if (document.getElementById('find-query') || window.location.pathname.includes('find-replace')) {
        const findMod = await loadModule('./modules/find-replace.js');
        if (findMod && findMod.default) {
            try { findMod.default(); } catch (e) { console.error('FindReplace init error', e); }
        }
    }

    // 5. Load Encoding Tools (Hub or Single)
    // Checks for specific tool data attribute OR the hub page
    if (document.body.dataset.tool || window.location.pathname.includes('encoding-tools') || window.location.pathname.includes('text-ciphers')) {
        const encMod = await loadModule('./modules/encoding-tools.js');
        if (encMod && encMod.default) {
            try { encMod.default(); } catch (e) { console.error('EncodingTools init error', e); }
        }
    }

    // 6. Load Formatter Tools (if on a formatter page)
    const formatterTools = ['json-format', 'json-minify', 'json-validate', 'json-csv', 'csv-json', 'xml-format', 'xml-minify', 'yaml-format', 'yaml-json', 'md-format', 'md-html', 'html-md', 'sql-format', 'log-format'];
    if (formatterTools.includes(document.body.dataset.tool)) {
        const fmtMod = await loadModule('./modules/formatter-tools.js');
        if (fmtMod && fmtMod.default) {
            try { fmtMod.default(); } catch (e) { console.error('FormatterTools init error', e); }
        }
    }

    // 7. Load Generator Tools (if on a generator page)
    const generatorTools = ['uuid-gen', 'slug-gen', 'lorem-gen', 'random-text'];
    if (generatorTools.includes(document.body.dataset.tool)) {
        const genMod = await loadModule('./modules/generator-tools.js');
        if (genMod && genMod.default) {
            try { genMod.default(); } catch (e) { console.error('GeneratorTools init error', e); }
        }
    }

    // 8. Load SEO Tools (if on an SEO page)
    const seoTools = ['meta-title', 'meta-desc', 'keyword-extract', 'keyword-freq', 'ngram-gen', 'serp-preview', 'heading-analyzer', 'content-score', 'readability-seo'];
    if (seoTools.includes(document.body.dataset.tool)) {
        const seoMod = await loadModule('./modules/seo-tools.js');
        if (seoMod && seoMod.default) {
            try { seoMod.default(); } catch (e) { console.error('SeoTools init error', e); }
        }
    }

    // 9. Load Diff Tools (if on a diff page)
    const diffTools = ['diff-view', 'side-compare'];
    if (diffTools.includes(document.body.dataset.tool)) {
        const diffMod = await loadModule('./modules/diff-tools.js');
        if (diffMod && diffMod.default) {
            try { diffMod.default(); } catch (e) { console.error('DiffTools init error', e); }
        }
    }
};

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
