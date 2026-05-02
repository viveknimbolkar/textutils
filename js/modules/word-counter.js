export default function initWordCounter() {
    const textInput = document.getElementById('text-input');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');

    // UI Elements Mapped by IDs
    const els = {
        words: document.getElementById('stat-words'),
        chars: document.getElementById('stat-chars'),
        charsNoSpace: document.getElementById('stat-chars-no-space'),
        sentences: document.getElementById('stat-sentences'),
        paragraphs: document.getElementById('stat-paragraphs'),
        lines: document.getElementById('stat-lines'),

        uniqueWords: document.getElementById('stat-unique'),
        repeatedWords: document.getElementById('stat-repeated'),
        avgWordLen: document.getElementById('stat-avg-len'),
        lexicalDiversity: document.getElementById('stat-diversity'),

        longestWord: document.getElementById('stat-longest'),
        shortestWord: document.getElementById('stat-shortest'),

        readTime: document.getElementById('stat-read-time'),
        speakTime: document.getElementById('stat-speak-time'),

        entropy: document.getElementById('stat-entropy'),
        densityContainer: document.getElementById('density-table-body')
    };

    if (!textInput) return;

    // Common Stop Words (English)
    const STOP_WORDS = new Set(['a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves']);

    const calculateEntropy = (text) => {
        if (!text) return 0;
        const len = text.length;
        const frequencies = {};
        for (let char of text) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }
        let entropy = 0;
        for (let char in frequencies) {
            const p = frequencies[char] / len;
            entropy -= p * Math.log2(p);
        }
        return entropy.toFixed(2);
    };

    const updateStats = () => {
        const text = textInput.value;
        const trimmed = text.trim();

        if (!trimmed) {
            // Reset all stats to 0 or -
            Object.values(els).forEach(el => { if (el) el.textContent = '0' });
            if (els.longestWord) els.longestWord.textContent = '-';
            if (els.shortestWord) els.shortestWord.textContent = '-';
            if (els.densityContainer) els.densityContainer.innerHTML = '';
            return;
        }

        // --- Basic Counts ---
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const lines = text.split(/\r\n|\r|\n/).length;
        // Improved Sentence split
        const sentences = (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (trimmed ? 1 : 0);
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

        // --- Word Analysis ---
        // Split by non-word characters but keep internal apostrophes for contractions if needed, 
        // strictly speaking simply splitting by whitespace is often enough for general counters, 
        // but let's do a robust split stripping punctuation.
        const wordsArray = trimmed.toLowerCase().match(/\b[\w']+\b/g) || [];
        const totalWords = wordsArray.length;

        if (totalWords === 0) {
            Object.values(els).forEach(el => { if (el && el !== els.densityContainer) el.textContent = '0' });
            return;
        }

        // Vocabulary Stats
        const uniqueWordsSet = new Set(wordsArray);
        const uniqueWords = uniqueWordsSet.size;
        const RepeatedWords = totalWords - uniqueWords;
        const lexicalDiversity = (uniqueWords / totalWords * 100).toFixed(1); // %

        let longest = '';
        let shortest = wordsArray[0] || '';
        let totalLen = 0;

        const freqMap = {};

        wordsArray.forEach(w => {
            if (w.length > longest.length) longest = w;
            if (w.length < shortest.length) shortest = w;
            totalLen += w.length;

            // Freq map (excluding stop words)
            if (!STOP_WORDS.has(w) && w.length > 1) { // Filter single chars too usually
                freqMap[w] = (freqMap[w] || 0) + 1;
            }
        });

        const avgLen = (totalLen / totalWords).toFixed(1);

        // --- Time ---
        const readTime = Math.ceil(totalWords / 200);
        const speakTime = Math.ceil(totalWords / 130);

        // --- Advanced ---
        const entropy = calculateEntropy(text);

        // --- UI Updates ---
        if (els.words) els.words.textContent = totalWords.toLocaleString();
        if (els.chars) els.chars.textContent = chars.toLocaleString();
        if (els.charsNoSpace) els.charsNoSpace.textContent = charsNoSpace.toLocaleString();
        if (els.sentences) els.sentences.textContent = sentences.toLocaleString();
        if (els.paragraphs) els.paragraphs.textContent = paragraphs.toLocaleString();
        if (els.lines) els.lines.textContent = lines.toLocaleString();

        if (els.uniqueWords) els.uniqueWords.textContent = uniqueWords.toLocaleString();
        if (els.repeatedWords) els.repeatedWords.textContent = RepeatedWords.toLocaleString();
        if (els.avgWordLen) els.avgWordLen.textContent = avgLen;
        if (els.lexicalDiversity) els.lexicalDiversity.textContent = `${lexicalDiversity}%`;

        if (els.longestWord) els.longestWord.textContent = longest.length > 15 ? longest.substring(0, 12) + '...' : longest;
        if (els.shortestWord) els.shortestWord.textContent = shortest;

        if (els.readTime) els.readTime.textContent = `${readTime} min`;
        if (els.speakTime) els.speakTime.textContent = `${speakTime} min`;

        if (els.entropy) els.entropy.textContent = entropy;

        // --- Keyword Density Table ---
        if (els.densityContainer) {
            const sortedKeywords = Object.entries(freqMap)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10); // Top 10

            els.densityContainer.innerHTML = sortedKeywords.map(([word, count]) => {
                const percentage = ((count / totalWords) * 100).toFixed(1);
                return `
                    <tr class="border-b border-slate-100 dark:border-slate-700">
                        <td class="py-2 text-slate-800 dark:text-slate-200 capitalize">${word}</td>
                        <td class="py-2 text-right text-slate-600 dark:text-slate-400">${count}</td>
                        <td class="py-2 text-right text-slate-500 text-xs">(${percentage}%)</td>
                        <td class="py-2 pl-4">
                            <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                                <div class="bg-primary-500 h-1.5 rounded-full" style="width: ${percentage}%"></div>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }
    };

    // Listeners
    textInput.addEventListener('input', updateStats);

    // Initial run
    updateStats();

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateStats();
        textInput.focus();
    });

    copyBtn.addEventListener('click', () => {
        if (!textInput.value) return;
        navigator.clipboard.writeText(textInput.value).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => copyBtn.innerHTML = originalText, 2000);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWordCounter);
} else {
    initWordCounter();
}
