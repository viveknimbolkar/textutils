/**
 * Formatter Tools Module
 * Handles JSON, XML, YAML, Markdown, SQL, Log formatting and conversions
 */

export default function initFormatterTools() {
    const tool = document.body.dataset.tool;
    if (!tool) return;

    const inputEl = document.getElementById('input-text');
    const outputEl = document.getElementById('output-text');
    const controlsEl = document.getElementById('dynamic-controls');
    const clearBtn = document.getElementById('clear-all');
    const copyBtn = document.getElementById('copy-result');

    if (!inputEl || !outputEl) return;

    const TOOLS = {
        'json-format': {
            name: 'JSON Formatter',
            action: (txt) => {
                try {
                    return JSON.stringify(JSON.parse(txt), null, 2);
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            },
            btnLabel: 'Format JSON',
            placeholder: 'Paste your JSON here...'
        },
        'json-minify': {
            name: 'JSON Minifier',
            action: (txt) => {
                try {
                    return JSON.stringify(JSON.parse(txt));
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            },
            btnLabel: 'Minify JSON',
            placeholder: 'Paste your JSON here...'
        },
        'json-validate': {
            name: 'JSON Validator',
            action: (txt) => {
                try {
                    JSON.parse(txt);
                    return '✅ Valid JSON';
                } catch (e) {
                    return `❌ Invalid JSON: ${e.message}`;
                }
            },
            btnLabel: 'Validate JSON',
            placeholder: 'Paste your JSON here...'
        },
        'json-csv': {
            name: 'JSON → CSV',
            action: (txt) => {
                try {
                    const arr = JSON.parse(txt);
                    if (!Array.isArray(arr) || arr.length === 0) return 'Error: Input must be a JSON array of objects';
                    const headers = Object.keys(arr[0]);
                    const csv = [headers.join(',')];
                    arr.forEach(obj => {
                        csv.push(headers.map(h => `"${String(obj[h] ?? '').replace(/"/g, '""')}"`).join(','));
                    });
                    return csv.join('\n');
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            },
            btnLabel: 'Convert to CSV',
            placeholder: 'Paste JSON array here, e.g. [{"name":"John","age":30}]'
        },
        'csv-json': {
            name: 'CSV → JSON',
            action: (txt) => {
                try {
                    const lines = txt.trim().split('\n');
                    if (lines.length < 2) return 'Error: Need header row and at least one data row';
                    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
                    const result = lines.slice(1).map(line => {
                        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                        const obj = {};
                        headers.forEach((h, i) => obj[h] = values[i] || '');
                        return obj;
                    });
                    return JSON.stringify(result, null, 2);
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            },
            btnLabel: 'Convert to JSON',
            placeholder: 'Paste CSV here...\nname,age\nJohn,30'
        },
        'xml-format': {
            name: 'XML Formatter',
            action: (txt) => {
                try {
                    let formatted = '';
                    let indent = 0;
                    txt.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).forEach(node => {
                        if (!node.trim()) return;
                        if (node.match(/^<\/\w/)) indent--;
                        formatted += '  '.repeat(Math.max(indent, 0)) + node.trim() + '\n';
                        if (node.match(/^<\w[^>]*[^\/]>$/)) indent++;
                    });
                    return formatted.trim();
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            },
            btnLabel: 'Format XML',
            placeholder: 'Paste your XML here...'
        },
        'xml-minify': {
            name: 'XML Minifier',
            action: (txt) => txt.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim(),
            btnLabel: 'Minify XML',
            placeholder: 'Paste your XML here...'
        },
        'yaml-format': {
            name: 'YAML Formatter',
            action: (txt) => {
                // Basic indent normalization
                return txt.split('\n').map(line => {
                    const match = line.match(/^(\s*)-?\s*/);
                    if (match) {
                        const spaces = Math.floor(match[1].length / 2) * 2;
                        return ' '.repeat(spaces) + line.trim();
                    }
                    return line;
                }).join('\n');
            },
            btnLabel: 'Format YAML',
            placeholder: 'Paste your YAML here...'
        },
        'yaml-json': {
            name: 'YAML → JSON',
            action: (txt) => {
                // Simple YAML parser for flat structures
                try {
                    const result = {};
                    txt.split('\n').forEach(line => {
                        const match = line.match(/^(\w+):\s*(.*)$/);
                        if (match) {
                            let val = match[2].trim();
                            if (val === 'true') val = true;
                            else if (val === 'false') val = false;
                            else if (!isNaN(val) && val !== '') val = Number(val);
                            result[match[1]] = val;
                        }
                    });
                    return JSON.stringify(result, null, 2);
                } catch (e) {
                    return `Error: ${e.message}`;
                }
            },
            btnLabel: 'Convert to JSON',
            placeholder: 'Paste simple YAML here...\nname: John\nage: 30'
        },
        'md-format': {
            name: 'Markdown Formatter',
            action: (txt) => {
                // Normalize headers and lists
                return txt
                    .replace(/^(#+)\s*/gm, (m, h) => h + ' ')
                    .replace(/^(\s*[-*])\s*/gm, '$1 ')
                    .replace(/\n{3,}/g, '\n\n');
            },
            btnLabel: 'Format Markdown',
            placeholder: 'Paste your Markdown here...'
        },
        'md-html': {
            name: 'Markdown → HTML',
            action: (txt) => {
                return txt
                    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
                    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
                    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                    .replace(/`(.+?)`/g, '<code>$1</code>')
                    .replace(/^\- (.+)$/gm, '<li>$1</li>')
                    .replace(/\n/g, '<br>\n');
            },
            btnLabel: 'Convert to HTML',
            placeholder: '# Heading\n**bold** and *italic*'
        },
        'html-md': {
            name: 'HTML → Markdown',
            action: (txt) => {
                return txt
                    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
                    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
                    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
                    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                    .replace(/<code>(.*?)<\/code>/gi, '`$1`')
                    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<[^>]+>/g, '');
            },
            btnLabel: 'Convert to Markdown',
            placeholder: '<h1>Title</h1>\n<strong>Bold</strong>'
        },
        'sql-format': {
            name: 'SQL Formatter',
            action: (txt) => {
                const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'LIMIT', 'OFFSET'];
                let result = txt;
                keywords.forEach(kw => {
                    result = result.replace(new RegExp(`\\b${kw}\\b`, 'gi'), `\n${kw.toUpperCase()}`);
                });
                return result.trim().replace(/^\n/, '');
            },
            btnLabel: 'Format SQL',
            placeholder: 'select * from users where id=1'
        },
        'log-format': {
            name: 'Log Formatter',
            action: (txt) => {
                // Parse common log formats and align
                const lines = txt.split('\n');
                return lines.map(line => {
                    // Try to extract timestamp and message
                    const match = line.match(/^(\[?\d{4}[-\/]\d{2}[-\/]\d{2}[T\s]\d{2}:\d{2}:\d{2}[^\]]*\]?)\s*(.*)/);
                    if (match) {
                        return `${match[1].padEnd(30)} ${match[2]}`;
                    }
                    return line;
                }).join('\n');
            },
            btnLabel: 'Format Logs',
            placeholder: '[2024-01-15 10:30:00] Error: Something happened'
        }
    };

    const config = TOOLS[tool];
    if (!config) return;

    // Set placeholder
    inputEl.placeholder = config.placeholder || 'Enter input...';

    // Render controls
    if (controlsEl) {
        controlsEl.innerHTML = `
            <div class="flex gap-4 justify-center">
                <button id="action-primary" class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>${config.btnLabel}</span>
                </button>
            </div>
        `;
    }

    // Event listeners
    document.getElementById('action-primary')?.addEventListener('click', () => {
        outputEl.value = config.action(inputEl.value);
    });

    clearBtn?.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.value = '';
    });

    copyBtn?.addEventListener('click', () => {
        navigator.clipboard.writeText(outputEl.value);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => { copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 1500);
    });

    // File Upload Handler
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Smart Size Limit based on Browser Capacity (Heuristic)
            // Uses navigator.deviceMemory (RAM in GB) if available, defaulting to conservative 4GB
            const deviceRAM = navigator.deviceMemory || 4;
            const thresholdMB = deviceRAM >= 8 ? 50 : 10; // Allow 50MB for high-end, 10MB for low-end
            const thresholdBytes = thresholdMB * 1024 * 1024;

            if (file.size > thresholdBytes) {
                const msg = `This file is ${(file.size / 1024 / 1024).toFixed(2)}MB.\n` +
                    `Based on your device's estimated RAM (~${deviceRAM}GB), processing this large file may freeze your browser.\n\n` +
                    `Do you want to continue?`;
                if (!confirm(msg)) return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                inputEl.value = e.target.result;
                // Auto-trigger conversion
                if (config.action) {
                    outputEl.value = config.action(inputEl.value);
                }
            };
            reader.readAsText(file);
        });
    }

    // File Download Handler
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const content = outputEl.value;
            if (!content) return;

            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Determine extension based on tool default
            let ext = 'txt';
            if (tool === 'csv-json') ext = 'json';
            else if (tool === 'json-csv') ext = 'csv';
            else if (tool === 'json-format' || tool === 'json-minify') ext = 'json';
            else if (tool === 'xml-format' || tool === 'xml-minify') ext = 'xml';
            else if (tool === 'sql-format') ext = 'sql';

            a.download = `converted.${ext}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}
