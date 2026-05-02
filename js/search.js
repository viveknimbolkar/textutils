import { tools } from './data.js';

export default function initSearch() {
    const searchInput = document.getElementById('global-search');
    const resultsContainer = document.getElementById('search-results');

    if (!searchInput || !resultsContainer) return;

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            resultsContainer.classList.add('hidden');
            return;
        }

        const matches = tools.filter(tool => {
            return tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query) ||
                tool.keywords.some(k => k.includes(query));
        });

        if (matches.length > 0) {
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = matches.map(tool => `
                <a href="${tool.url}" class="block p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b last:border-0 border-slate-100 dark:border-slate-700">
                    <div class="flex items-center gap-3">
                        <span class="text-xl">${tool.icon || '🛠️'}</span>
                        <div>
                            <div class="font-bold text-slate-900 dark:text-white text-sm">${tool.name}</div>
                            <div class="text-xs text-slate-500 truncate">${tool.description}</div>
                        </div>
                    </div>
                </a>
            `).join('');
        } else {
            resultsContainer.classList.remove('hidden');
            resultsContainer.innerHTML = `
                <div class="p-3 text-sm text-slate-500 text-center">No tools found for "${query}"</div>
            `;
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });

    // Keyboard Shortcut (Cmd+K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}
