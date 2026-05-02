import { downloadText, showButtonSuccess } from '../utils/download.js';

export default function initDuplicateLineRemover() {
    const textInput = document.getElementById('text-input');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearBtn = document.getElementById('clear-btn');
    const undoBtn = document.getElementById('undo-btn');
    const removeDuplicatesBtn = document.getElementById('remove-duplicates-btn');
    const showDuplicatesBtn = document.getElementById('show-duplicates-btn');
    const showUniqueBtn = document.getElementById('show-unique-btn');

    // Options
    const caseSensitiveCheckbox = document.getElementById('case-sensitive');
    const trimWhitespaceCheckbox = document.getElementById('trim-whitespace');
    const removeEmptyLinesCheckbox = document.getElementById('remove-empty-lines');
    const sortOutputCheckbox = document.getElementById('sort-output');

    // Stats
    const totalLinesEl = document.getElementById('total-lines');
    const uniqueLinesEl = document.getElementById('unique-lines');
    const duplicateCountEl = document.getElementById('duplicate-count');
    const linesRemovedEl = document.getElementById('lines-removed');

    let history = [];
    const MAX_HISTORY = 10;

    if (!textInput) return;

    const saveHistory = () => {
        history.push(textInput.value);
        if (history.length > MAX_HISTORY) history.shift();
    };

    const getLines = (text) => {
        return text.split('\n');
    };

    const processLine = (line) => {
        let processed = line;
        if (trimWhitespaceCheckbox.checked) {
            processed = processed.trim();
        }
        return processed;
    };

    const getComparisonKey = (line) => {
        let key = processLine(line);
        if (!caseSensitiveCheckbox.checked) {
            key = key.toLowerCase();
        }
        return key;
    };

    const updateStats = () => {
        const text = textInput.value;
        const lines = getLines(text);
        const nonEmptyLines = lines.filter(line => processLine(line) !== '');

        const seenKeys = new Set();
        const duplicateKeys = new Set();

        for (const line of lines) {
            const key = getComparisonKey(line);
            if (key === '' && !removeEmptyLinesCheckbox.checked) continue;
            if (key === '' && removeEmptyLinesCheckbox.checked) continue;

            if (seenKeys.has(key)) {
                duplicateKeys.add(key);
            } else {
                seenKeys.add(key);
            }
        }

        const totalLines = removeEmptyLinesCheckbox.checked ? nonEmptyLines.length : lines.length;
        const uniqueCount = seenKeys.size;
        const duplicateCount = duplicateKeys.size;
        const linesRemoved = totalLines - uniqueCount;

        totalLinesEl.textContent = totalLines;
        uniqueLinesEl.textContent = uniqueCount;
        duplicateCountEl.textContent = duplicateCount;
        linesRemovedEl.textContent = Math.max(0, linesRemoved);
    };

    const removeDuplicates = () => {
        saveHistory();
        const lines = getLines(textInput.value);
        const seen = new Set();
        const result = [];

        for (const line of lines) {
            const key = getComparisonKey(line);

            // Handle empty lines
            if (processLine(line) === '') {
                if (!removeEmptyLinesCheckbox.checked && !seen.has('__EMPTY__')) {
                    result.push(line);
                    seen.add('__EMPTY__');
                }
                continue;
            }

            if (!seen.has(key)) {
                seen.add(key);
                result.push(trimWhitespaceCheckbox.checked ? processLine(line) : line);
            }
        }

        let finalResult = result;
        if (sortOutputCheckbox.checked) {
            finalResult = result.sort((a, b) => {
                const aKey = caseSensitiveCheckbox.checked ? a : a.toLowerCase();
                const bKey = caseSensitiveCheckbox.checked ? b : b.toLowerCase();
                return aKey.localeCompare(bKey);
            });
        }

        textInput.value = finalResult.join('\n');
        updateStats();
    };

    const showOnlyDuplicates = () => {
        saveHistory();
        const lines = getLines(textInput.value);
        const countMap = new Map();

        // Count occurrences
        for (const line of lines) {
            const key = getComparisonKey(line);
            if (processLine(line) === '') continue;
            countMap.set(key, (countMap.get(key) || 0) + 1);
        }

        // Get lines that appear more than once
        const seen = new Set();
        const duplicates = [];

        for (const line of lines) {
            const key = getComparisonKey(line);
            if (processLine(line) === '') continue;

            if (countMap.get(key) > 1 && !seen.has(key)) {
                duplicates.push(trimWhitespaceCheckbox.checked ? processLine(line) : line);
                seen.add(key);
            }
        }

        let finalResult = duplicates;
        if (sortOutputCheckbox.checked) {
            finalResult = duplicates.sort((a, b) => {
                const aKey = caseSensitiveCheckbox.checked ? a : a.toLowerCase();
                const bKey = caseSensitiveCheckbox.checked ? b : b.toLowerCase();
                return aKey.localeCompare(bKey);
            });
        }

        textInput.value = finalResult.join('\n');
        updateStats();
    };

    const showOnlyUnique = () => {
        saveHistory();
        const lines = getLines(textInput.value);
        const countMap = new Map();

        // Count occurrences
        for (const line of lines) {
            const key = getComparisonKey(line);
            if (processLine(line) === '') continue;
            countMap.set(key, (countMap.get(key) || 0) + 1);
        }

        // Get lines that appear exactly once
        const uniqueLines = [];
        const seen = new Set();

        for (const line of lines) {
            const key = getComparisonKey(line);
            if (processLine(line) === '') continue;

            if (countMap.get(key) === 1 && !seen.has(key)) {
                uniqueLines.push(trimWhitespaceCheckbox.checked ? processLine(line) : line);
                seen.add(key);
            }
        }

        let finalResult = uniqueLines;
        if (sortOutputCheckbox.checked) {
            finalResult = uniqueLines.sort((a, b) => {
                const aKey = caseSensitiveCheckbox.checked ? a : a.toLowerCase();
                const bKey = caseSensitiveCheckbox.checked ? b : b.toLowerCase();
                return aKey.localeCompare(bKey);
            });
        }

        textInput.value = finalResult.join('\n');
        updateStats();
    };

    // Event Listeners
    textInput.addEventListener('input', updateStats);

    // Auto-remove duplicates on paste
    textInput.addEventListener('paste', () => {
        setTimeout(() => {
            removeDuplicates();
        }, 0);
    });

    removeDuplicatesBtn.addEventListener('click', removeDuplicates);
    showDuplicatesBtn.addEventListener('click', showOnlyDuplicates);
    showUniqueBtn.addEventListener('click', showOnlyUnique);

    clearBtn.addEventListener('click', () => {
        saveHistory();
        textInput.value = '';
        textInput.focus();
        updateStats();
    });

    undoBtn.addEventListener('click', () => {
        if (history.length > 0) {
            textInput.value = history.pop();
            updateStats();
        }
    });

    copyBtn.addEventListener('click', () => {
        if (!textInput.value) return;
        navigator.clipboard.writeText(textInput.value).then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
            setTimeout(() => copyBtn.innerHTML = original, 2000);
        });
    });

    downloadBtn.addEventListener('click', () => {
        if (!textInput.value) return;
        downloadText(textInput.value, 'unique-lines');
        showButtonSuccess(downloadBtn, 'Downloaded!');
    });

    // Update stats when options change
    [caseSensitiveCheckbox, trimWhitespaceCheckbox, removeEmptyLinesCheckbox].forEach(checkbox => {
        checkbox.addEventListener('change', updateStats);
    });

    // Initial stats update
    updateStats();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDuplicateLineRemover);
} else {
    initDuplicateLineRemover();
}
