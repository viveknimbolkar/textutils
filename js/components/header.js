export function renderHeader() {
    return `
    <header class="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
            <a href="./" class="flex items-center space-x-2 font-bold text-xl text-slate-900 dark:text-white">
                <i class="fa-solid fa-screwdriver-wrench text-primary-600"></i>
                <span class="hidden sm:inline-block">TextUtils</span>
            </a>

            <!-- Search Bar (Desktop) -->
            <div class="flex-1 max-w-md mx-4 relative hidden sm:block">
                <div class="relative group">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input type="search" id="global-search" class="block w-full p-2 pl-10 text-sm text-slate-900 border border-slate-300 rounded-lg bg-slate-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Search tools (Cmd+K)..." required>
                    <div id="search-results" class="hidden absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto z-50"></div>
                </div>
            </div>

            <!-- Theme Toggle -->
            <button id="theme-toggle" class="p-2 text-slate-500 rounded-lg hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700">
                <i class="fa-solid fa-moon hidden dark:block"></i>
                <i class="fa-solid fa-sun block dark:hidden"></i>
            </button>
        </div>
    </header>
    `;
}
