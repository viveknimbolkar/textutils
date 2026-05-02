import { downloadText, showButtonSuccess } from '../utils/download.js';

export default function initTextCleaner() {
    const textInput = document.getElementById('text-input');
    const actions = document.querySelectorAll('[data-action]');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const clearBtn = document.getElementById('clear-btn');
    const undoBtn = document.getElementById('undo-btn');

    let history = [];
    const MAX_HISTORY = 10;

    if (!textInput) return;

    const saveHistory = () => {
        history.push(textInput.value);
        if (history.length > MAX_HISTORY) history.shift();
    };

    const processText = (action) => {
        saveHistory();
        const original = textInput.value;
        let result = original;

        switch (action) {
            case 'trim':
                result = original.trim();
                break;
            case 'remove-extra-spaces':
                result = original.replace(/[ \t]+/g, ' ').trim();
                break;
            case 'remove-tabs':
                result = original.replace(/\t/g, '');
                break;
            case 'normalize-whitespace':
                result = original.replace(/\s+/g, ' ');
                break;
            case 'remove-empty-lines':
                result = original.split('\n').filter(line => line.trim() !== '').join('\n');
                break;
            case 'remove-duplicate-lines':
                result = [...new Set(original.split('\n'))].join('\n');
                break;
            case 'normalize-line-endings':
                result = original.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
                break;
            case 'remove-non-printable':
                result = original.replace(/[^\x20-\x7E\n\r\t]/g, '');
                break;
            case 'remove-emojis':
                // Regex range for emojis (surrogates and other ranges)
                result = original.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
                break;
            case 'remove-punctuation':
                result = original.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
                break;
            case 'remove-special-chars':
                result = original.replace(/[^a-zA-Z0-9\s\n]/g, '');
                break;
            case 'remove-html-tags':
                result = original.replace(/<[^>]*>?/g, '');
                break;
            case 'decode-html-entities':
                const txt = document.createElement("textarea");
                txt.innerHTML = original;
                result = txt.value;
                break;
            case 'normalize-unicode':
                result = original.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                break;
            case 'remove-zero-width':
                result = original.replace(/[\u200B-\u200D\uFEFF]/g, '');
                break;
        }

        textInput.value = result;
    };

    actions.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            processText(action);
        });
    });

    // Auto-cleanup on paste: trim and remove extra spaces
    textInput.addEventListener('paste', () => {
        setTimeout(() => {
            saveHistory();
            let text = textInput.value;
            // Trim and remove extra spaces
            text = text.trim().replace(/[ \t]+/g, ' ');
            textInput.value = text;
        }, 0);
    });

    clearBtn.addEventListener('click', () => {
        saveHistory();
        textInput.value = '';
        textInput.focus();
    });

    undoBtn.addEventListener('click', () => {
        if (history.length > 0) {
            textInput.value = history.pop();
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
        downloadText(textInput.value, 'cleaned-text');
        showButtonSuccess(downloadBtn, 'Downloaded!');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextCleaner);
} else {
    initTextCleaner();
}
