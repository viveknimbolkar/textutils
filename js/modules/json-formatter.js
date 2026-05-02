import { downloadJson, showButtonSuccess } from '../utils/download.js';

export default function initJsonFormatter() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const btnFormat = document.getElementById('btn-format');
    const btnMinify = document.getElementById('btn-minify');
    const btnClear = document.getElementById('btn-clear');
    const btnSample = document.getElementById('btn-sample');
    const btnCopy = document.getElementById('btn-copy');
    const btnDownload = document.getElementById('btn-download');
    const errorMsg = document.getElementById('error-msg');

    if (!input) return;

    let debounceTimer = null;

    const showError = (msg) => {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
        output.value = '';
    };

    const clearError = () => {
        errorMsg.classList.add('hidden');
        errorMsg.textContent = '';
    };

    const processJson = (minify = false) => {
        const raw = input.value.trim();
        if (!raw) {
            output.value = '';
            clearError();
            return;
        }

        try {
            clearError();
            const obj = JSON.parse(raw);
            output.value = minify ? JSON.stringify(obj) : JSON.stringify(obj, null, 4);
        } catch (e) {
            showError(`Invalid JSON: ${e.message}`);
        }
    };

    // Auto-beautify with debouncing for smooth typing experience
    const autoBeautify = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            processJson(false);
        }, 300); // 300ms delay for debouncing
    };

    // Listen for input (typing) and paste events
    input.addEventListener('input', autoBeautify);
    input.addEventListener('paste', () => {
        // Use setTimeout to ensure paste content is available
        setTimeout(() => processJson(false), 0);
    });

    btnFormat.addEventListener('click', () => processJson(false));
    btnMinify.addEventListener('click', () => processJson(true));

    btnClear.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        clearError();
        input.focus();
    });

    btnSample.addEventListener('click', () => {
        input.value = '{"name":"TextUtils","users":1000,"active":true,"features":["SEO","Fast"]}';
        processJson(false);
    });

    btnCopy.addEventListener('click', () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value).then(() => {
            const original = btnCopy.textContent;
            btnCopy.textContent = 'Copied!';
            setTimeout(() => btnCopy.textContent = original, 2000);
        });
    });

    btnDownload.addEventListener('click', () => {
        if (!output.value) return;
        downloadJson(output.value, 'formatted-json');
        showButtonSuccess(btnDownload, 'Downloaded!');
    });
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJsonFormatter);
} else {
    initJsonFormatter();
}
