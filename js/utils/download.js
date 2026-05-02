/**
 * Download Utility - Shared download functionality for TextUtils
 */

/**
 * Downloads text content as a file
 * @param {string} content - The text content to download
 * @param {string} filename - The filename (with extension)
 * @param {string} mimeType - The MIME type (default: text/plain)
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    if (!content) return;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Downloads content as a JSON file
 * @param {string} content - The JSON content to download
 * @param {string} filename - The filename (without extension)
 */
export function downloadJson(content, filename = 'output') {
    downloadFile(content, `${filename}.json`, 'application/json');
}

/**
 * Downloads content as a text file
 * @param {string} content - The text content to download
 * @param {string} filename - The filename (without extension)
 */
export function downloadText(content, filename = 'output') {
    downloadFile(content, `${filename}.txt`, 'text/plain');
}

/**
 * Downloads content as an XML file
 * @param {string} content - The XML content to download
 * @param {string} filename - The filename (without extension)
 */
export function downloadXml(content, filename = 'output') {
    downloadFile(content, `${filename}.xml`, 'application/xml');
}

/**
 * Downloads content as a YAML file
 * @param {string} content - The YAML content to download
 * @param {string} filename - The filename (without extension)
 */
export function downloadYaml(content, filename = 'output') {
    downloadFile(content, `${filename}.yaml`, 'text/yaml');
}

/**
 * Downloads content as a CSV file
 * @param {string} content - The CSV content to download
 * @param {string} filename - The filename (without extension)
 */
export function downloadCsv(content, filename = 'output') {
    downloadFile(content, `${filename}.csv`, 'text/csv');
}

/**
 * Downloads content as an HTML file
 * @param {string} content - The HTML content to download
 * @param {string} filename - The filename (without extension)
 */
export function downloadHtml(content, filename = 'output') {
    downloadFile(content, `${filename}.html`, 'text/html');
}

/**
 * Downloads content as a Markdown file
 * @param {string} content - The Markdown content to download
 * @param {string} filename - The filename (without extension)
 */
export function downloadMarkdown(content, filename = 'output') {
    downloadFile(content, `${filename}.md`, 'text/markdown');
}

/**
 * Downloads content as an SQL file
 * @param {string} content - The SQL content to download
 * @param {string} filename - The filename (without extension)
 */
export function downloadSql(content, filename = 'output') {
    downloadFile(content, `${filename}.sql`, 'application/sql');
}

/**
 * Shows a temporary success message on a button
 * @param {HTMLElement} button - The button element
 * @param {string} successText - The success message
 * @param {number} duration - Duration in ms
 */
export function showButtonSuccess(button, successText = 'Downloaded!', duration = 2000) {
    const original = button.innerHTML;
    button.innerHTML = `<i class="fa-solid fa-check"></i> ${successText}`;
    setTimeout(() => button.innerHTML = original, duration);
}
