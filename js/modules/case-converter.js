import { downloadText, showButtonSuccess } from '../utils/download.js';

export default function initCaseConverter() {
    const textInput = document.getElementById('text-input');
    const caseButtons = document.querySelectorAll('.btn-case-action');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');

    if (!textInput) return;

    // Conversion Logic
    const convertText = (text, type) => {
        switch (type) {
            case 'upper': return text.toUpperCase();
            case 'lower': return text.toLowerCase();
            case 'title':
                return text.replace(
                    /\w\S*/g,
                    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                );
            case 'sentence':
                return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
            case 'alternating':
                return text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
            case 'inverse':
                return text.split('').map(c =>
                    c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
                ).join('');
            default: return text;
        }
    };

    caseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-case');
            const original = textInput.value;
            textInput.value = convertText(original, type);
        });
    });

    // Copy & Clear
    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        textInput.focus();
    });

    copyBtn.addEventListener('click', () => {
        if (!textInput.value) return;
        navigator.clipboard.writeText(textInput.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        });
    });

    downloadBtn.addEventListener('click', () => {
        if (!textInput.value) return;
        downloadText(textInput.value, 'converted-text');
        showButtonSuccess(downloadBtn, 'Downloaded!');
    });
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCaseConverter);
} else {
    initCaseConverter();
}
