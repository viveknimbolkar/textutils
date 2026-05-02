/**
 * SEO Tools Module
 * Meta title/desc checkers, keyword tools, SERP preview, heading analyzer, content score, readability
 */

export default function initSeoTools() {
    const tool = document.body.dataset.tool;
    if (!tool) return;

    const outputEl = document.getElementById('output-text');
    const inputEl = document.getElementById('input-text');
    const controlsEl = document.getElementById('dynamic-controls');
    const resultsEl = document.getElementById('results-panel');
    const copyBtn = document.getElementById('copy-result');

    // Common words to filter for keyword extraction
    const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'as', 'if', 'then', 'because', 'while', 'although', 'though', 'after', 'before', 'since', 'until', 'unless', 'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'during', 'except', 'inside', 'into', 'near', 'off', 'onto', 'out', 'outside', 'over', 'past', 'through', 'throughout', 'toward', 'under', 'underneath', 'up', 'upon', 'within', 'without']);

    const TOOLS = {
        'meta-title': {
            name: 'Meta Title Checker',
            process: () => {
                const title = inputEl?.value || '';
                const len = title.length;
                const pixelWidth = len * 6; // Approximate
                let status, color;
                if (len === 0) { status = 'Empty'; color = 'gray'; }
                else if (len < 30) { status = 'Too Short'; color = 'orange'; }
                else if (len <= 60) { status = 'Perfect!'; color = 'green'; }
                else if (len <= 70) { status = 'Slightly Long'; color = 'yellow'; }
                else { status = 'Too Long - Will Truncate'; color = 'red'; }

                return `
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-800">
                            <span class="font-bold text-${color}-700 dark:text-${color}-300">${status}</span>
                            <span class="text-2xl font-bold ${color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : 'text-orange-600'}">${len}/60</span>
                        </div>
                        <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                            <div class="text-sm text-slate-500 mb-1">Google Preview:</div>
                            <div class="text-blue-600 text-lg font-medium truncate">${title || 'Your title here...'}</div>
                            <div class="text-green-700 text-sm">https://example.com/page</div>
                        </div>
                        <div class="text-sm text-slate-500">
                            <strong>Best Practice:</strong> Keep titles 50-60 characters for optimal display in search results.
                        </div>
                    </div>
                `;
            }
        },
        'meta-desc': {
            name: 'Meta Description Checker',
            process: () => {
                const desc = inputEl?.value || '';
                const len = desc.length;
                let status, color;
                if (len === 0) { status = 'Empty'; color = 'gray'; }
                else if (len < 120) { status = 'Too Short'; color = 'orange'; }
                else if (len <= 160) { status = 'Perfect!'; color = 'green'; }
                else if (len <= 200) { status = 'Slightly Long'; color = 'yellow'; }
                else { status = 'Too Long - Will Truncate'; color = 'red'; }

                return `
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-200 dark:border-${color}-800">
                            <span class="font-bold text-${color}-700 dark:text-${color}-300">${status}</span>
                            <span class="text-2xl font-bold ${color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : 'text-orange-600'}">${len}/160</span>
                        </div>
                        <div class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                            <div class="text-sm text-slate-500 mb-1">Google Preview:</div>
                            <div class="text-blue-600 text-lg font-medium">Page Title Here</div>
                            <div class="text-green-700 text-sm">https://example.com/page</div>
                            <div class="text-slate-600 dark:text-slate-300 text-sm mt-1">${desc.slice(0, 160) || 'Your description here...'}</div>
                        </div>
                        <div class="text-sm text-slate-500">
                            <strong>Best Practice:</strong> Keep descriptions 150-160 characters with a clear call-to-action.
                        </div>
                    </div>
                `;
            }
        },
        'keyword-extract': {
            name: 'Keyword Extractor',
            process: () => {
                const text = inputEl?.value || '';
                const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
                const freq = {};
                words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
                const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);

                if (sorted.length === 0) return '<p class="text-slate-500">Enter text to extract keywords...</p>';

                return `
                    <div class="space-y-3">
                        <div class="flex flex-wrap gap-2">
                            ${sorted.map(([word, count]) => `<span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">${word} <span class="text-xs opacity-70">(${count})</span></span>`).join('')}
                        </div>
                        <div class="text-sm text-slate-500 mt-4">Found ${sorted.length} unique keywords from ${words.length} total words.</div>
                    </div>
                `;
            }
        },
        'keyword-freq': {
            name: 'Keyword Frequency',
            process: () => {
                const text = inputEl?.value || '';
                const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 0);
                const totalWords = words.length;
                const freq = {};
                words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
                const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30);

                if (sorted.length === 0) return '<p class="text-slate-500">Enter text to analyze keyword frequency...</p>';

                return `
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead><tr class="border-b border-slate-200 dark:border-slate-700">
                                <th class="text-left py-2 px-3">Keyword</th>
                                <th class="text-right py-2 px-3">Count</th>
                                <th class="text-right py-2 px-3">Density</th>
                                <th class="py-2 px-3 w-1/3">Distribution</th>
                            </tr></thead>
                            <tbody>
                                ${sorted.map(([word, count]) => {
                    const density = ((count / totalWords) * 100).toFixed(2);
                    return `<tr class="border-b border-slate-100 dark:border-slate-800">
                                        <td class="py-2 px-3 font-medium">${word}</td>
                                        <td class="text-right py-2 px-3">${count}</td>
                                        <td class="text-right py-2 px-3">${density}%</td>
                                        <td class="py-2 px-3"><div class="bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div class="bg-primary-500 h-2 rounded-full" style="width: ${Math.min(density * 10, 100)}%"></div></div></td>
                                    </tr>`;
                }).join('')}
                            </tbody>
                        </table>
                        <div class="text-sm text-slate-500 mt-4">Total words: ${totalWords} | Unique words: ${Object.keys(freq).length}</div>
                    </div>
                `;
            }
        },
        'ngram-gen': {
            name: 'N-gram Generator',
            process: () => {
                const text = inputEl?.value || '';
                const n = parseInt(document.getElementById('ngram-size')?.value || '2');
                const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 0);

                if (words.length < n) return '<p class="text-slate-500">Enter more text to generate n-grams...</p>';

                const ngrams = {};
                for (let i = 0; i <= words.length - n; i++) {
                    const gram = words.slice(i, i + n).join(' ');
                    ngrams[gram] = (ngrams[gram] || 0) + 1;
                }
                const sorted = Object.entries(ngrams).sort((a, b) => b[1] - a[1]).slice(0, 25);

                return `
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead><tr class="border-b border-slate-200 dark:border-slate-700">
                                <th class="text-left py-2 px-3">${n}-gram</th>
                                <th class="text-right py-2 px-3">Frequency</th>
                            </tr></thead>
                            <tbody>
                                ${sorted.map(([gram, count]) => `<tr class="border-b border-slate-100 dark:border-slate-800">
                                    <td class="py-2 px-3 font-mono">"${gram}"</td>
                                    <td class="text-right py-2 px-3 font-bold">${count}</td>
                                </tr>`).join('')}
                            </tbody>
                        </table>
                        <div class="text-sm text-slate-500 mt-4">Found ${sorted.length} unique ${n}-grams</div>
                    </div>
                `;
            },
            controls: `
                <div class="flex items-center gap-4 mb-4">
                    <label class="text-sm font-bold text-slate-700 dark:text-slate-300">N-gram size:</label>
                    <select id="ngram-size" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                        <option value="2">Bigrams (2)</option>
                        <option value="3">Trigrams (3)</option>
                        <option value="4">4-grams</option>
                        <option value="5">5-grams</option>
                    </select>
                </div>
            `
        },
        'serp-preview': {
            name: 'SERP Snippet Preview',
            process: () => {
                const title = document.getElementById('serp-title')?.value || 'Page Title';
                const desc = document.getElementById('serp-desc')?.value || 'Page description...';
                const url = document.getElementById('serp-url')?.value || 'https://example.com/page';

                return `
                    <div class="space-y-6">
                        <div class="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div class="text-xs text-slate-500 mb-2">Desktop Preview</div>
                            <div class="text-blue-600 hover:underline text-xl font-medium cursor-pointer" style="max-width: 600px;">${title.slice(0, 60)}${title.length > 60 ? '...' : ''}</div>
                            <div class="text-green-700 text-sm mt-1">${url}</div>
                            <div class="text-slate-600 dark:text-slate-400 text-sm mt-1" style="max-width: 600px;">${desc.slice(0, 160)}${desc.length > 160 ? '...' : ''}</div>
                        </div>
                        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-sm">
                            <div class="text-xs text-slate-500 mb-2">Mobile Preview</div>
                            <div class="text-blue-600 text-lg font-medium">${title.slice(0, 50)}${title.length > 50 ? '...' : ''}</div>
                            <div class="text-green-700 text-xs mt-1">${url.slice(0, 40)}...</div>
                            <div class="text-slate-600 dark:text-slate-400 text-xs mt-1">${desc.slice(0, 120)}${desc.length > 120 ? '...' : ''}</div>
                        </div>
                        <div class="grid grid-cols-3 gap-4 text-center text-sm">
                            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div class="font-bold ${title.length <= 60 ? 'text-green-600' : 'text-red-600'}">${title.length}/60</div>
                                <div class="text-slate-500 text-xs">Title</div>
                            </div>
                            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div class="font-bold ${desc.length <= 160 ? 'text-green-600' : 'text-red-600'}">${desc.length}/160</div>
                                <div class="text-slate-500 text-xs">Description</div>
                            </div>
                            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div class="font-bold text-blue-600">${url.length}</div>
                                <div class="text-slate-500 text-xs">URL Length</div>
                            </div>
                        </div>
                    </div>
                `;
            },
            controls: `
                <div class="space-y-4 mb-6">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Page Title</label>
                        <input type="text" id="serp-title" placeholder="Your page title..." class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Meta Description</label>
                        <textarea id="serp-desc" rows="2" placeholder="Your meta description..." class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white resize-none"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">URL</label>
                        <input type="text" id="serp-url" placeholder="https://example.com/page" class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    </div>
                </div>
            `
        },
        'heading-analyzer': {
            name: 'Heading Structure Analyzer',
            process: () => {
                const html = inputEl?.value || '';
                const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
                const headings = [];
                let match;
                while ((match = headingRegex.exec(html)) !== null) {
                    headings.push({ level: parseInt(match[1]), text: match[2].replace(/<[^>]*>/g, '') });
                }

                if (headings.length === 0) return '<p class="text-slate-500">Paste HTML content to analyze heading structure...</p>';

                const h1Count = headings.filter(h => h.level === 1).length;
                const issues = [];
                if (h1Count === 0) issues.push('⚠️ Missing H1 tag');
                if (h1Count > 1) issues.push('⚠️ Multiple H1 tags found');

                // Check for skipped levels
                let prevLevel = 0;
                headings.forEach((h, i) => {
                    if (h.level > prevLevel + 1 && prevLevel > 0) {
                        issues.push(`⚠️ Skipped heading level: H${prevLevel} → H${h.level}`);
                    }
                    prevLevel = h.level;
                });

                return `
                    <div class="space-y-4">
                        ${issues.length > 0 ? `<div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <div class="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Issues Found</div>
                            ${issues.map(i => `<div class="text-yellow-700 dark:text-yellow-400 text-sm">${i}</div>`).join('')}
                        </div>` : '<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"><div class="font-bold text-green-700 dark:text-green-300">✅ Heading structure looks good!</div></div>'}
                        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            <div class="font-bold text-slate-700 dark:text-slate-300 mb-3">Heading Outline</div>
                            ${headings.map(h => `<div class="py-1 text-sm" style="padding-left: ${(h.level - 1) * 16}px;">
                                <span class="inline-block w-8 text-xs font-mono bg-slate-200 dark:bg-slate-700 rounded px-1">H${h.level}</span>
                                <span class="text-slate-600 dark:text-slate-300 ml-2">${h.text.slice(0, 50)}${h.text.length > 50 ? '...' : ''}</span>
                            </div>`).join('')}
                        </div>
                        <div class="grid grid-cols-6 gap-2 text-center text-xs">
                            ${[1, 2, 3, 4, 5, 6].map(l => `<div class="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                <div class="font-bold text-lg">${headings.filter(h => h.level === l).length}</div>
                                <div class="text-slate-500">H${l}</div>
                            </div>`).join('')}
                        </div>
                    </div>
                `;
            }
        },
        'content-score': {
            name: 'Content Score',
            process: () => {
                const text = inputEl?.value || '';
                const words = text.split(/\s+/).filter(w => w.length > 0);
                const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
                const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

                const wordCount = words.length;
                const sentenceCount = sentences.length;
                const avgWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;

                // Simple scoring
                let score = 0;
                let feedback = [];

                if (wordCount >= 300) { score += 20; feedback.push('✅ Good word count (300+)'); }
                else if (wordCount >= 100) { score += 10; feedback.push('⚠️ Consider adding more content'); }
                else { feedback.push('❌ Content too short'); }

                if (paragraphs.length >= 3) { score += 20; feedback.push('✅ Good paragraph structure'); }
                else { score += 10; feedback.push('⚠️ Add more paragraphs'); }

                if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 20) { score += 20; feedback.push('✅ Good sentence length'); }
                else if (avgWordsPerSentence > 25) { feedback.push('⚠️ Sentences are too long'); }
                else { score += 10; }

                // Keyword variety
                const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ''))).size;
                const variety = wordCount > 0 ? (uniqueWords / wordCount * 100).toFixed(0) : 0;
                if (variety >= 40) { score += 20; feedback.push('✅ Good vocabulary variety'); }
                else { score += 10; feedback.push('⚠️ Consider using more varied vocabulary'); }

                score += 20; // Base score

                const scoreColor = score >= 80 ? 'green' : score >= 60 ? 'yellow' : score >= 40 ? 'orange' : 'red';

                return `
                    <div class="space-y-6">
                        <div class="text-center">
                            <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-${scoreColor}-100 dark:bg-${scoreColor}-900/30 border-4 border-${scoreColor}-500">
                                <span class="text-4xl font-bold text-${scoreColor}-600">${score}</span>
                            </div>
                            <div class="mt-2 text-lg font-bold text-slate-700 dark:text-slate-300">Content Score</div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div class="text-2xl font-bold text-primary-600">${wordCount}</div>
                                <div class="text-xs text-slate-500">Words</div>
                            </div>
                            <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div class="text-2xl font-bold text-primary-600">${sentenceCount}</div>
                                <div class="text-xs text-slate-500">Sentences</div>
                            </div>
                            <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div class="text-2xl font-bold text-primary-600">${paragraphs.length}</div>
                                <div class="text-xs text-slate-500">Paragraphs</div>
                            </div>
                            <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div class="text-2xl font-bold text-primary-600">${avgWordsPerSentence}</div>
                                <div class="text-xs text-slate-500">Avg Words/Sentence</div>
                            </div>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            <div class="font-bold text-slate-700 dark:text-slate-300 mb-3">Feedback</div>
                            ${feedback.map(f => `<div class="text-sm py-1">${f}</div>`).join('')}
                        </div>
                    </div>
                `;
            }
        },
        'readability-seo': {
            name: 'Readability for SEO',
            process: () => {
                const text = inputEl?.value || '';
                const words = text.split(/\s+/).filter(w => w.length > 0);
                const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
                const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

                const wordCount = words.length;
                const sentenceCount = sentences.length || 1;
                const syllableCount = syllables;

                // Flesch Reading Ease
                const flesch = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount));
                const fleschScore = Math.max(0, Math.min(100, Math.round(flesch)));

                // Flesch-Kincaid Grade Level
                const gradeLevel = (0.39 * (wordCount / sentenceCount)) + (11.8 * (syllableCount / wordCount)) - 15.59;
                const grade = Math.max(0, Math.round(gradeLevel));

                let readability, color;
                if (fleschScore >= 80) { readability = 'Very Easy'; color = 'green'; }
                else if (fleschScore >= 60) { readability = 'Standard'; color = 'blue'; }
                else if (fleschScore >= 40) { readability = 'Fairly Difficult'; color = 'yellow'; }
                else if (fleschScore >= 20) { readability = 'Difficult'; color = 'orange'; }
                else { readability = 'Very Difficult'; color = 'red'; }

                return `
                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div class="text-center p-6 bg-${color}-50 dark:bg-${color}-900/20 rounded-xl border border-${color}-200 dark:border-${color}-800">
                                <div class="text-5xl font-bold text-${color}-600">${fleschScore}</div>
                                <div class="text-lg font-medium text-${color}-700 dark:text-${color}-300 mt-2">${readability}</div>
                                <div class="text-sm text-slate-500 mt-1">Flesch Reading Ease</div>
                            </div>
                            <div class="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div class="text-5xl font-bold text-slate-700 dark:text-slate-300">${grade}</div>
                                <div class="text-lg font-medium text-slate-600 dark:text-slate-400 mt-2">Grade Level</div>
                                <div class="text-sm text-slate-500 mt-1">Flesch-Kincaid</div>
                            </div>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                            <div class="font-bold text-slate-700 dark:text-slate-300 mb-3">Statistics</div>
                            <div class="grid grid-cols-3 gap-4 text-center text-sm">
                                <div><span class="font-bold">${wordCount}</span> words</div>
                                <div><span class="font-bold">${sentenceCount}</span> sentences</div>
                                <div><span class="font-bold">${syllableCount}</span> syllables</div>
                            </div>
                        </div>
                        <div class="text-sm text-slate-500">
                            <strong>SEO Tip:</strong> For optimal SEO, aim for a Flesch score of 60-70 (8th-9th grade level). This ensures your content is accessible to a wide audience.
                        </div>
                    </div>
                `;
            }
        }
    };

    function countSyllables(word) {
        word = word.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }

    const config = TOOLS[tool];
    if (!config) return;

    // Render controls
    if (controlsEl && config.controls) {
        controlsEl.innerHTML = config.controls;
    }

    // Common analyze function
    const analyze = () => {
        if (resultsEl && config.process) {
            resultsEl.innerHTML = config.process();
        }
    };

    // Bind events
    inputEl?.addEventListener('input', analyze);
    document.querySelectorAll('#dynamic-controls input, #dynamic-controls select, #dynamic-controls textarea').forEach(el => {
        el.addEventListener('input', analyze);
    });

    // Initial analysis
    analyze();

    // Copy handler
    copyBtn?.addEventListener('click', () => {
        const text = resultsEl?.innerText || outputEl?.value || '';
        navigator.clipboard.writeText(text);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => { copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 1500);
    });
}
