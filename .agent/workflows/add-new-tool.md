---
description: Steps to add a new tool to the project
---

# Adding a New Tool

When adding a new tool to the project, the following files need to be updated:

## 1. Create the Tool Page
- Create a new HTML file in the root directory (e.g., `tool-name.html`)
- Include proper meta tags for SEO
- Add the tool's functionality

## 2. Add to Search Data
- **File**: `js/data.js`
- Add a new entry to the `tools` array with:
  - `id`: Unique identifier
  - `name`: Display name
  - `description`: Short description
  - `category`: Tool category (e.g., 'developer', 'seo', 'utility', 'security', etc.)
  - `url`: Path to the HTML file
  - `icon`: Emoji icon
  - `keywords`: Array of search keywords

## 3. Add to Homepage Grid
- **File**: `index.html`
- Add a new card in the tools grid section (around line 735)
- Follow the existing card template format

## 4. Update Sitemap (Optional)
- **File**: `sitemap.xml`
- Add the new page URL for SEO indexing

## 5. Build and Test
// turbo
```bash
npm run build && npm run serve
```

## Example: Adding a Clock Tool

### js/data.js entry:
```javascript
{
    id: 'clock',
    name: 'Digital Clock',
    description: 'Beautiful full-screen digital clock with real-time display.',
    category: 'utility',
    url: '/clock.html',
    icon: '⏰',
    keywords: ['clock', 'time', 'digital clock', 'timer', 'date', 'fullscreen clock']
}
```

### index.html card:
```html
<!-- Digital Clock Card -->
<a href="/clock.html"
    class="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-primary-500 dark:hover:border-primary-500">
    <div class="flex items-center gap-4 mb-4">
        <span
            class="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-2xl">
            <i class="fa-solid fa-clock"></i>
        </span>
        <h3
            class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
            Digital Clock</h3>
    </div>
    <p class="text-slate-500 dark:text-slate-400 text-sm">Beautiful full-screen clock with real-time display.</p>
</a>
```
