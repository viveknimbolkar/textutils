
export default function initEncodingTools() {
    // Elements
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const clearBtn = document.getElementById('clear-all');
    const copyBtn = document.getElementById('copy-result');
    const dynamicControls = document.getElementById('dynamic-controls');
    const toolTip = document.getElementById('tool-tip');

    // Tabs & Buttons
    const tabs = document.querySelectorAll('.btn-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const toolBtns = document.querySelectorAll('.tool-btn');

    let currentTool = 'base64'; // Default

    // Tool Configs & Tips
    const toolConfig = {
        base64: {
            tip: "Base64 encoding converts binary data to ASCII string format. Commonly used for encoding images or data URIs.",
            controls: `
                <div class="flex gap-4 justify-center">
                    <button id="action-encode" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-lock"></i>
                        <span>Encode</span>
                    </button>
                    <button id="action-decode" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-unlock"></i>
                        <span>Decode</span>
                    </button>
                </div>
            `
        },
        url: {
            tip: "URL encoding converts characters into a format that can be transmitted over the Internet. Spaces become %20.",
            controls: `
                <div class="flex gap-4 justify-center">
                    <button id="action-encode" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-lock"></i>
                        <span>Encode</span>
                    </button>
                    <button id="action-decode" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-unlock"></i>
                        <span>Decode</span>
                    </button>
                </div>
            `
        },
        html: {
            tip: "HTML Entity encoding converts reserved characters (like <, >, &) to their HTML entity equivalents.",
            controls: `
                <div class="flex gap-4 justify-center">
                    <button id="action-encode" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-code"></i>
                        <span>Encode</span>
                    </button>
                    <button id="action-decode" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                        <i class="fa-solid fa-font"></i>
                        <span>Decode</span>
                    </button>
                </div>
            `
        },
        hash: {
            tip: "Hashing algorithms create a fixed-size string from input data. Standard for password storage and file integrity.",
            controls: `
                <div class="flex gap-2 justify-center flex-wrap">
                    <button class="hash-btn px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-xs" data-algo="SHA-1">SHA-1</button>
                    <button class="hash-btn px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-xs" data-algo="SHA-256">SHA-256</button>
                    <button class="hash-btn px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-xs" data-algo="SHA-384">SHA-384</button>
                    <button class="hash-btn px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-xs" data-algo="SHA-512">SHA-512</button>
                </div>
            `
        },
        jwt: {
            tip: "Decodes a JSON Web Token (JWT) to show its Header and Claims. Does NOT verify signature (client-side only).",
            controls: `
                <div class="text-center">
                    <button id="action-decode-jwt" class="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-sm">Decode Token</button>
                </div>
            `
        },
        password: {
            tip: " analyzes password strength based on length, complexity, and entropy.",
            controls: `
                <div class="text-center">
                    <button id="action-check-pass" class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm">Analyze Strength</button>
                </div>
            `
        },
        rot13: {
            tip: "ROT13 is a simple substitution cipher that replaces a letter with the 13th letter after it.",
            controls: `
                <div class="text-center">
                    <button id="action-rot13" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm">Apply ROT13</button>
                </div>
            `
        },
        caesar: {
            tip: "Caesar cipher shifts letters by a specified number of positions.",
            controls: `
                <div class="flex gap-2 justify-center items-center">
                    <label class="text-xs font-bold text-slate-500">Shift:</label>
                    <input type="number" id="caesar-shift" value="1" min="1" max="25" class="w-16 p-1 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded">
                    <button id="action-caesar-enc" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs">Encode</button>
                    <button id="action-caesar-dec" class="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-bold text-xs">Decode</button>
                </div>
            `
        },
        obfuscate: {
            tip: "Obfuscates text by converting characters to hex/unicode escape sequences to hide them from casual readers.",
            controls: `
                <div class="flex gap-2 justify-center">
                    <button id="action-obfuscate" class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-bold text-sm">Obfuscate</button>
                    <button id="action-deobfuscate" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-bold text-sm">De-obfuscate</button>
                </div>
            `
        }
    };

    // Initialize UI
    const setTool = (toolName) => {
        currentTool = toolName;
        // Update Tip
        if (toolTip) toolTip.textContent = toolConfig[toolName]?.tip || "";
        // Update Controls
        if (dynamicControls) {
            dynamicControls.innerHTML = toolConfig[toolName]?.controls || "";
            attachDynamicListeners();
        }
    };

    // Check for specific tool page (SEO Mode)
    const specificTool = document.body.dataset.tool;

    if (!specificTool) {
        // Hub Mode: Enable Tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const target = tab.dataset.tab;
                tabContents.forEach(content => {
                    content.id === `tab-${target}` ? content.classList.remove('hidden') : content.classList.add('hidden');
                });
            });
        });

        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                toolBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                setTool(btn.dataset.tool);
            });
        });

        // Set initial for Hub
        setTool('base64');
    } else {
        // Single Tool Mode
        setTool(specificTool);
        // Hide tabs/tool-btns if they exist (though HTML likely won't have them)
        if (tabs.length > 0) tabs.forEach(t => t.closest('.rounded-xl').classList.add('hidden'));
    }

    // --- LOGIC FUNCTIONS ---

    function attachDynamicListeners() {
        const text = inputText ? inputText.value : '';

        // Base64
        const btnB64Enc = document.getElementById('action-encode');
        const btnB64Dec = document.getElementById('action-decode');

        if (currentTool === 'base64' || currentTool === 'url' || currentTool === 'html') {
            btnB64Enc?.addEventListener('click', () => {
                // Read fresh value
                const val = inputText.value;
                if (currentTool === 'base64') outputText.value = btoa(val);
                if (currentTool === 'url') {
                    // Use encodeURI for full URLs, encodeURIComponent for text/parameters
                    try {
                        new URL(val); // Check if it's a valid URL
                        outputText.value = encodeURI(val);
                    } catch {
                        // Not a valid URL, encode as component
                        outputText.value = encodeURIComponent(val);
                    }
                }
                if (currentTool === 'html') outputText.value = val.replace(/[\u00A0-\u9999<>&]/g, i => '&#' + i.charCodeAt(0) + ';');
            });
            btnB64Dec?.addEventListener('click', () => {
                try {
                    const val = inputText.value;
                    if (currentTool === 'base64') outputText.value = atob(val);
                    if (currentTool === 'url') {
                        // Try decodeURI first for full URLs, then decodeURIComponent
                        try {
                            outputText.value = decodeURI(val);
                        } catch {
                            outputText.value = decodeURIComponent(val);
                        }
                    }
                    if (currentTool === 'html') {
                        const txt = document.createElement("textarea");
                        txt.innerHTML = val;
                        outputText.value = txt.value;
                    }
                } catch (e) { outputText.value = "Error: Invalid Input"; }
            });
        }

        // Hashing
        document.querySelectorAll('.hash-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const algo = btn.dataset.algo;
                const msgBuffer = new TextEncoder().encode(inputText.value);
                const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                outputText.value = hashHex;
            });
        });

        // JWT
        document.getElementById('action-decode-jwt')?.addEventListener('click', () => {
            try {
                const token = inputText.value;
                const parts = token.split('.');
                if (parts.length !== 3) throw new Error("Invalid JWT format");
                const header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
                const payload = JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
                outputText.value = `HEADER:\n${header}\n\nPAYLOAD:\n${payload}`;
            } catch (e) { outputText.value = "Error: Invalid JWT Token"; }
        });

        // ROT13
        document.getElementById('action-rot13')?.addEventListener('click', () => {
            outputText.value = inputText.value.replace(/[a-zA-Z]/g, function (c) {
                return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
            });
        });

        // Caesar
        document.getElementById('action-caesar-enc')?.addEventListener('click', () => {
            const shift = parseInt(document.getElementById('caesar-shift').value) || 1;
            outputText.value = caesarCipher(inputText.value, shift);
        });
        document.getElementById('action-caesar-dec')?.addEventListener('click', () => {
            const shift = parseInt(document.getElementById('caesar-shift').value) || 1;
            outputText.value = caesarCipher(inputText.value, (26 - shift) % 26);
        });

        // Obfuscate (Hex)
        document.getElementById('action-obfuscate')?.addEventListener('click', () => {
            outputText.value = inputText.value.split('').map(c => '%' + c.charCodeAt(0).toString(16)).join('');
        });
        document.getElementById('action-deobfuscate')?.addEventListener('click', () => {
            try {
                outputText.value = decodeURIComponent(inputText.value);
            } catch (e) { outputText.value = "Error decoding"; }
        });

        // Pass Strength
        document.getElementById('action-check-pass')?.addEventListener('click', () => {
            const p = inputText.value;
            let score = 0;
            if (p.length > 8) score++;
            if (p.length > 12) score++;
            if (/[A-Z]/.test(p)) score++;
            if (/[0-9]/.test(p)) score++;
            if (/[^A-Za-z0-9]/.test(p)) score++;

            const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong", "Excellent"];
            outputText.value = `Score: ${score}/5\nVerdict: ${labels[score] || "Weak"}`;
        });
    }

    // Helper: Caesar
    function caesarCipher(str, shift) {
        return str.replace(/[a-zA-Z]/g, function (c) {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
        });
    }

    // Common
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            inputText.value = '';
            outputText.value = '';
            inputText.focus();
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            outputText.select();
            document.execCommand('copy');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => copyBtn.innerHTML = originalText, 2000);
        });
    }
}
