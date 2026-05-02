/**
 * Diff Tools Module
 * Text comparison: Diff View and Side-by-side Compare
 */

export default function initDiffTools() {
    const tool = document.body.dataset.tool;
    if (!tool || !['diff-view', 'side-compare'].includes(tool)) return;

    const text1El = document.getElementById('text-1');
    const text2El = document.getElementById('text-2');
    const resultsEl = document.getElementById('results-panel');
    const compareBtn = document.getElementById('compare-btn');

    if (!text1El || !text2El || !resultsEl) return;

    function computeDiff(text1, text2) {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const result = [];
        const maxLen = Math.max(lines1.length, lines2.length);

        for (let i = 0; i < maxLen; i++) {
            const line1 = lines1[i] ?? '';
            const line2 = lines2[i] ?? '';

            if (line1 === line2) {
                result.push({ type: 'same', line1, line2, lineNum: i + 1 });
            } else if (line1 && !line2) {
                result.push({ type: 'removed', line1, line2: '', lineNum: i + 1 });
            } else if (!line1 && line2) {
                result.push({ type: 'added', line1: '', line2, lineNum: i + 1 });
            } else {
                result.push({ type: 'changed', line1, line2, lineNum: i + 1 });
            }
        }
        return result;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderDiffView(diff) {
        let html = '<div class="font-mono text-sm overflow-x-auto">';
        let stats = { added: 0, removed: 0, changed: 0 };

        diff.forEach(d => {
            const lineNum = String(d.lineNum).padStart(3, ' ');
            if (d.type === 'same') {
                html += `<div class="flex"><span class="w-10 text-slate-400 select-none">${lineNum}</span><span class="px-2 text-slate-600 dark:text-slate-300">${escapeHtml(d.line1) || '&nbsp;'}</span></div>`;
            } else if (d.type === 'removed') {
                stats.removed++;
                html += `<div class="flex bg-red-100 dark:bg-red-900/30"><span class="w-10 text-red-500 select-none">${lineNum}</span><span class="px-2 text-red-700 dark:text-red-300">- ${escapeHtml(d.line1)}</span></div>`;
            } else if (d.type === 'added') {
                stats.added++;
                html += `<div class="flex bg-green-100 dark:bg-green-900/30"><span class="w-10 text-green-500 select-none">${lineNum}</span><span class="px-2 text-green-700 dark:text-green-300">+ ${escapeHtml(d.line2)}</span></div>`;
            } else {
                stats.changed++;
                html += `<div class="flex bg-red-100 dark:bg-red-900/30"><span class="w-10 text-red-500 select-none">${lineNum}</span><span class="px-2 text-red-700 dark:text-red-300">- ${escapeHtml(d.line1)}</span></div>`;
                html += `<div class="flex bg-green-100 dark:bg-green-900/30"><span class="w-10 text-green-500 select-none">${lineNum}</span><span class="px-2 text-green-700 dark:text-green-300">+ ${escapeHtml(d.line2)}</span></div>`;
            }
        });

        html += '</div>';

        const statsHtml = `
            <div class="flex gap-4 mb-4 text-sm">
                <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"><i class="fa-solid fa-plus mr-1"></i>${stats.added} added</span>
                <span class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full"><i class="fa-solid fa-minus mr-1"></i>${stats.removed} removed</span>
                <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full"><i class="fa-solid fa-pen mr-1"></i>${stats.changed} changed</span>
            </div>
        `;

        return statsHtml + html;
    }

    function renderSideBySide(diff) {
        let stats = { added: 0, removed: 0, changed: 0, same: 0 };

        let html = `
            <div class="grid grid-cols-2 gap-4 font-mono text-sm">
                <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <div class="bg-slate-100 dark:bg-slate-800 px-3 py-2 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Original</div>
                    <div class="p-2 max-h-96 overflow-y-auto">
        `;

        diff.forEach(d => {
            const bgClass = d.type === 'same' ? '' : d.type === 'removed' || d.type === 'changed' ? 'bg-red-100 dark:bg-red-900/20' : '';
            html += `<div class="py-0.5 px-2 ${bgClass}">${escapeHtml(d.line1) || '&nbsp;'}</div>`;
            if (d.type === 'removed') stats.removed++;
            if (d.type === 'changed') stats.changed++;
            if (d.type === 'same') stats.same++;
        });

        html += `
                    </div>
                </div>
                <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <div class="bg-slate-100 dark:bg-slate-800 px-3 py-2 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Modified</div>
                    <div class="p-2 max-h-96 overflow-y-auto">
        `;

        diff.forEach(d => {
            const bgClass = d.type === 'same' ? '' : d.type === 'added' || d.type === 'changed' ? 'bg-green-100 dark:bg-green-900/20' : '';
            html += `<div class="py-0.5 px-2 ${bgClass}">${escapeHtml(d.line2) || '&nbsp;'}</div>`;
            if (d.type === 'added') stats.added++;
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        const statsHtml = `
            <div class="flex gap-4 mb-4 text-sm">
                <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"><i class="fa-solid fa-plus mr-1"></i>${stats.added} added</span>
                <span class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full"><i class="fa-solid fa-minus mr-1"></i>${stats.removed} removed</span>
                <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full"><i class="fa-solid fa-pen mr-1"></i>${stats.changed} changed</span>
                <span class="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">${stats.same} unchanged</span>
            </div>
        `;

        return statsHtml + html;
    }

    const compare = () => {
        const text1 = text1El.value;
        const text2 = text2El.value;

        if (!text1 && !text2) {
            resultsEl.innerHTML = '<p class="text-slate-500 text-center py-8">Enter text in both panels to compare...</p>';
            return;
        }

        const diff = computeDiff(text1, text2);

        if (tool === 'diff-view') {
            resultsEl.innerHTML = renderDiffView(diff);
        } else {
            resultsEl.innerHTML = renderSideBySide(diff);
        }
    };

    compareBtn?.addEventListener('click', compare);

    // Auto-compare on input (debounced)
    let timeout;
    const debounceCompare = () => {
        clearTimeout(timeout);
        timeout = setTimeout(compare, 500);
    };
    text1El.addEventListener('input', debounceCompare);
    text2El.addEventListener('input', debounceCompare);
}
