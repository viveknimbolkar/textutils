
export default function initFindReplace() {
    // Elements
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const highlightView = document.getElementById('highlight-view');
    const clearInputBtn = document.getElementById('clear-input');
    const copyBtn = document.getElementById('copy-result');
    const matchCount = document.getElementById('match-count');

    // Tabs
    const tabs = document.querySelectorAll('.btn-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab Logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.dataset.tab;
            tabContents.forEach(content => {
                content.id === `tab-${target}` ? content.classList.remove('hidden') : content.classList.add('hidden');
            });

            // Reset Output on switch
            highlightView.classList.add('hidden');
            highlightView.innerHTML = '';
        });
    });

    // --- UTILS ---
    const getRegex = (pattern, isRegex, isCase, isGlobal = true) => {
        try {
            let flags = isGlobal ? 'g' : '';
            if (!isCase) flags += 'i'; // If "Match Case" is UNCHECKED, we add 'i' (ignore case). Wait, usually UI says "Match Case" -> if check, we WANT case sensitivity. 
            // My UI: "Match Case". Checked = Case Sensitive (no 'i' flag). Unchecked = Case Insensitive ('i' flag).

            if (isRegex) {
                return new RegExp(pattern, flags + 'm'); // 'm' for multiline anchors
            } else {
                // Escape regex characters for plain text search
                const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                return new RegExp(escaped, flags);
            }
        } catch (e) {
            alert('Invalid Regex: ' + e.message);
            return null;
        }
    };

    const updateCount = (count) => {
        matchCount.textContent = `${count} matches`;
    };

    const escapeHtml = (str) => {
        return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Debug
    console.log('Find & Replace Module Loaded');

    // --- MODE 1: FIND & REPLACE ---
    const findQuery = document.getElementById('find-query');
    const replaceString = document.getElementById('replace-string');
    const optRegex = document.getElementById('opt-regex');
    const optCase = document.getElementById('opt-case');

    document.getElementById('btn-replace-all').addEventListener('click', () => {
        const text = inputText.value;
        const query = findQuery.value;
        if (!query) return;

        const regex = getRegex(query, optRegex.checked, optCase.checked);
        if (!regex) return;

        const matches = text.match(regex);
        updateCount(matches ? matches.length : 0);

        const result = text.replace(regex, replaceString.value);
        outputText.value = result;

        // Hide highlight
        highlightView.classList.add('hidden');
    });

    document.getElementById('btn-highlight').addEventListener('click', () => {
        const text = inputText.value;
        const query = findQuery.value;
        if (!query) return;

        const regex = getRegex(query, optRegex.checked, optCase.checked);
        if (!regex) return;

        // Use exec loop to safely identify matches and indices
        // This avoids issues with String.replace callback arguments shifting when capture groups exist
        const segments = [];
        let lastPos = 0;
        let match;

        // Ensure regex is global for loop
        if (!regex.global) {
            // Should be handled by getRegex, but double check
        }

        while ((match = regex.exec(text)) !== null) {
            // Text before match
            if (match.index > lastPos) {
                segments.push({ type: 'text', content: text.slice(lastPos, match.index) });
            }
            // The match itself
            segments.push({ type: 'match', content: match[0] });

            lastPos = regex.lastIndex;

            // Prevent infinite loop for zero-width assertions if needed (though match[0] usually handles it)
            if (match.index === regex.lastIndex) {
                regex.lastIndex++;
            }
        }

        // Remaining text
        if (lastPos < text.length) {
            segments.push({ type: 'text', content: text.slice(lastPos) });
        }

        const rendered = segments.map(seg => {
            if (seg.type === 'match') return `<mark class="mark-highlight">${escapeHtml(seg.content)}</mark>`;
            return escapeHtml(seg.content);
        }).join('');

        highlightView.innerHTML = rendered;
        highlightView.classList.remove('hidden');

        // Update count
        const totalMatches = segments.filter(s => s.type === 'match').length;
        updateCount(totalMatches);
    });

    // --- MODE 2: FILTER ---
    const filterQuery = document.getElementById('filter-query');
    const filterRegex = document.getElementById('filter-opt-regex');
    const filterCase = document.getElementById('filter-opt-case');

    const filterLines = (keepMatching) => {
        const text = inputText.value;
        const lines = text.split('\n');
        const query = filterQuery.value;
        if (!query && lines.length > 0) return;

        const regex = getRegex(query, filterRegex.checked, filterCase.checked, false); // No global flag needed for test()
        if (!regex) return;

        let count = 0;
        const filtered = lines.filter(line => {
            const isMatch = regex.test(line);
            if ((keepMatching && isMatch) || (!keepMatching && !isMatch)) {
                if (isMatch) count++; // Count "matches" found? 
                // If keepMatching=true, we count kept lines. If keepMatching=false, we count removed lines?
                // Let's just count matches of the criteria.
                return true;
            }
            if (isMatch) count++;
            return false;
        });

        updateCount(count); // Count of lines that MATCHED the query (regardless of keep/remove)
        outputText.value = filtered.join('\n');
        highlightView.classList.add('hidden');
    };

    document.getElementById('btn-keep-lines').addEventListener('click', () => filterLines(true));
    document.getElementById('btn-remove-lines').addEventListener('click', () => filterLines(false));

    // --- MODE 3: EXTRACT ---
    const extractPattern = document.getElementById('extract-pattern');

    document.getElementById('btn-extract').addEventListener('click', () => {
        const text = inputText.value;
        const pattern = extractPattern.value;
        if (!pattern) return;

        const regex = getRegex(pattern, true, true, true); // Always regex, always global
        if (!regex) return;

        const matches = text.match(regex);
        if (matches) {
            updateCount(matches.length);
            outputText.value = matches.join('\n'); // One match per line
        } else {
            updateCount(0);
            outputText.value = '';
        }
        highlightView.classList.add('hidden');
    });

    // Presets
    document.querySelectorAll('.preset-extract').forEach(btn => {
        btn.addEventListener('click', () => {
            extractPattern.value = btn.dataset.regex;
        });
    });

    // Clear Input
    clearInputBtn.addEventListener('click', () => {
        inputText.value = '';
        inputText.focus();
    });

    // Copy
    copyBtn.addEventListener('click', () => {
        outputText.select();
        document.execCommand('copy'); // Fallback or use Clipboard API
        // navigator.clipboard.writeText(outputText.value); // Better
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => copyBtn.innerHTML = originalText, 2000);
    });
}
