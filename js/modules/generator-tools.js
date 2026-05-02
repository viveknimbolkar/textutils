/**
 * Generator Tools Module
 * Handles UUID, Slug, Lorem Ipsum, and Random Text generators
 */

export default function initGeneratorTools() {
    const tool = document.body.dataset.tool;
    if (!tool) return;

    const outputEl = document.getElementById('output-text');
    const controlsEl = document.getElementById('dynamic-controls');
    const copyBtn = document.getElementById('copy-result');

    if (!outputEl) return;

    const LOREM_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

    const TOOLS = {
        'uuid-gen': {
            name: 'UUID Generator',
            render: () => `
                <div class="flex flex-wrap gap-4 justify-center items-center mb-4">
                    <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Count:</label>
                    <input type="number" id="uuid-count" value="1" min="1" max="100" class="w-20 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <select id="uuid-version" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                        <option value="v4">UUID v4 (Random)</option>
                    </select>
                    <button id="generate-btn" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all">
                        <i class="fa-solid fa-dice mr-2"></i>Generate
                    </button>
                </div>
            `,
            generate: () => {
                const count = parseInt(document.getElementById('uuid-count')?.value || '1');
                const uuids = [];
                for (let i = 0; i < Math.min(count, 100); i++) {
                    uuids.push(crypto.randomUUID());
                }
                return uuids.join('\n');
            }
        },
        'slug-gen': {
            name: 'Slug Generator',
            render: () => `
                <div class="space-y-4 mb-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Text to Convert</label>
                        <input type="text" id="slug-input" placeholder="Enter text to slugify..." class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    </div>
                    <div class="flex flex-wrap gap-4 items-center">
                        <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Separator:</label>
                        <select id="slug-separator" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                            <option value="-">Hyphen (-)</option>
                            <option value="_">Underscore (_)</option>
                        </select>
                        <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <input type="checkbox" id="slug-lowercase" checked class="rounded">
                            Lowercase
                        </label>
                        <button id="generate-btn" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all">
                            <i class="fa-solid fa-link mr-2"></i>Generate Slug
                        </button>
                    </div>
                </div>
            `,
            generate: () => {
                const input = document.getElementById('slug-input')?.value || '';
                const sep = document.getElementById('slug-separator')?.value || '-';
                const lower = document.getElementById('slug-lowercase')?.checked ?? true;
                let slug = input
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-zA-Z0-9\s]/g, '')
                    .trim()
                    .replace(/\s+/g, sep);
                return lower ? slug.toLowerCase() : slug;
            }
        },
        'lorem-gen': {
            name: 'Lorem Ipsum Generator',
            render: () => `
                <div class="flex flex-wrap gap-4 justify-center items-center mb-4">
                    <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Generate:</label>
                    <input type="number" id="lorem-count" value="3" min="1" max="50" class="w-20 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <select id="lorem-type" class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                        <option value="paragraphs">Paragraphs</option>
                        <option value="sentences">Sentences</option>
                        <option value="words">Words</option>
                    </select>
                    <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <input type="checkbox" id="lorem-start" checked class="rounded">
                        Start with "Lorem ipsum..."
                    </label>
                    <button id="generate-btn" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all">
                        <i class="fa-solid fa-paragraph mr-2"></i>Generate
                    </button>
                </div>
            `,
            generate: () => {
                const count = parseInt(document.getElementById('lorem-count')?.value || '3');
                const type = document.getElementById('lorem-type')?.value || 'paragraphs';
                const startWithLorem = document.getElementById('lorem-start')?.checked ?? true;

                const randomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
                const randomSentence = () => {
                    const len = 8 + Math.floor(Math.random() * 12);
                    const words = Array.from({ length: len }, randomWord);
                    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
                    return words.join(' ') + '.';
                };
                const randomParagraph = () => {
                    const len = 4 + Math.floor(Math.random() * 4);
                    return Array.from({ length: len }, randomSentence).join(' ');
                };

                let result = '';
                if (type === 'words') {
                    result = Array.from({ length: count }, randomWord).join(' ');
                } else if (type === 'sentences') {
                    result = Array.from({ length: count }, randomSentence).join(' ');
                } else {
                    result = Array.from({ length: count }, randomParagraph).join('\n\n');
                }

                if (startWithLorem && result.length > 0) {
                    result = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + result.slice(result.indexOf(' ', 10) + 1);
                }
                return result;
            }
        },
        'random-text': {
            name: 'Random Text Generator',
            render: () => `
                <div class="flex flex-wrap gap-4 justify-center items-center mb-4">
                    <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Length:</label>
                    <input type="number" id="random-length" value="32" min="1" max="1000" class="w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                    <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <input type="checkbox" id="inc-upper" checked class="rounded"> A-Z
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <input type="checkbox" id="inc-lower" checked class="rounded"> a-z
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <input type="checkbox" id="inc-numbers" checked class="rounded"> 0-9
                    </label>
                    <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <input type="checkbox" id="inc-symbols" class="rounded"> !@#$
                    </label>
                    <button id="generate-btn" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all">
                        <i class="fa-solid fa-shuffle mr-2"></i>Generate
                    </button>
                </div>
            `,
            generate: () => {
                const length = parseInt(document.getElementById('random-length')?.value || '32');
                let chars = '';
                if (document.getElementById('inc-upper')?.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                if (document.getElementById('inc-lower')?.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
                if (document.getElementById('inc-numbers')?.checked) chars += '0123456789';
                if (document.getElementById('inc-symbols')?.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
                if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

                const array = new Uint32Array(length);
                crypto.getRandomValues(array);
                return Array.from(array, x => chars[x % chars.length]).join('');
            }
        }
    };

    const config = TOOLS[tool];
    if (!config) return;

    // Render controls
    if (controlsEl && config.render) {
        controlsEl.innerHTML = config.render();
    }

    // Handle generate
    document.getElementById('generate-btn')?.addEventListener('click', () => {
        outputEl.value = config.generate();
    });

    // Auto-generate on load for UUID
    if (tool === 'uuid-gen') {
        outputEl.value = config.generate();
    }

    // Copy handler
    copyBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => { copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 1500);
    });
}
