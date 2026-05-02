export function renderFooter() {
    const year = new Date().getFullYear();

    return `
    <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
                <div class="col-span-2 md:col-span-1">
                    <span class="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <i class="fa-solid fa-screwdriver-wrench"></i> TextUtils
                    </span>
                    <p class="mt-2 text-sm text-slate-500">The best collection of online text processing utilities.</p>
                </div>
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-4">Writing</h4>
                    <ul class="space-y-2 text-sm text-slate-500">
                        <li><a href="./word-counter.html" class="hover:text-primary-600">Word Counter</a></li>
                        <li><a href="./case-converter.html" class="hover:text-primary-600">Case Converter</a></li>
                        <li><a href="./text-cleaner.html" class="hover:text-primary-600">Text Cleaner</a></li>
                        <li><a href="./find-replace.html" class="hover:text-primary-600">Find & Replace</a></li>
                        <li><a href="./diff-view.html" class="hover:text-primary-600">Diff View</a></li>
                        <li><a href="./side-compare.html" class="hover:text-primary-600">Side-by-Side</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-4">Encoding</h4>
                    <ul class="space-y-2 text-sm text-slate-500">
                        <li><a href="./base64-encode.html" class="hover:text-primary-600">Base64</a></li>
                        <li><a href="./url-encode.html" class="hover:text-primary-600">URL Encoder</a></li>
                        <li><a href="./html-encode.html" class="hover:text-primary-600">HTML Entities</a></li>
                        <li><a href="./hash-generator.html" class="hover:text-primary-600">Hash Generator</a></li>
                        <li><a href="./jwt-decoder.html" class="hover:text-primary-600">JWT Decoder</a></li>
                        <li><a href="./password-strength.html" class="hover:text-primary-600">Password Checker</a></li>
                        <li><a href="./text-ciphers.html" class="hover:text-primary-600">Text Ciphers</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-4">Formatters</h4>
                    <ul class="space-y-2 text-sm text-slate-500">
                        <li><a href="./json-format.html" class="hover:text-primary-600">JSON Formatter</a></li>
                        <li><a href="./json-minify.html" class="hover:text-primary-600">JSON Minifier</a></li>
                        <li><a href="./json-validate.html" class="hover:text-primary-600">JSON Validator</a></li>
                        <li><a href="./xml-format.html" class="hover:text-primary-600">XML Formatter</a></li>
                        <li><a href="./xml-minify.html" class="hover:text-primary-600">XML Minifier</a></li>
                        <li><a href="./yaml-format.html" class="hover:text-primary-600">YAML Formatter</a></li>
                        <li><a href="./sql-format.html" class="hover:text-primary-600">SQL Formatter</a></li>
                        <li><a href="./log-format.html" class="hover:text-primary-600">Log Formatter</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-4">Converters</h4>
                    <ul class="space-y-2 text-sm text-slate-500">
                        <li><a href="./json-to-csv.html" class="hover:text-primary-600">JSON → CSV</a></li>
                        <li><a href="./csv-to-json.html" class="hover:text-primary-600">CSV → JSON</a></li>
                        <li><a href="./yaml-to-json.html" class="hover:text-primary-600">YAML → JSON</a></li>
                        <li><a href="./markdown-to-html.html" class="hover:text-primary-600">MD → HTML</a></li>
                        <li><a href="./html-to-markdown.html" class="hover:text-primary-600">HTML → MD</a></li>
                        <li><a href="./markdown-format.html" class="hover:text-primary-600">MD Formatter</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-4">Generators</h4>
                    <ul class="space-y-2 text-sm text-slate-500">
                        <li><a href="./uuid-generator.html" class="hover:text-primary-600">UUID Generator</a></li>
                        <li><a href="./slug-generator.html" class="hover:text-primary-600">Slug Generator</a></li>
                        <li><a href="./lorem-ipsum.html" class="hover:text-primary-600">Lorem Ipsum</a></li>
                        <li><a href="./random-text.html" class="hover:text-primary-600">Random Text</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold text-slate-900 dark:text-white mb-4">SEO Tools</h4>
                    <ul class="space-y-2 text-sm text-slate-500">
                        <li><a href="./meta-title-checker.html" class="hover:text-primary-600">Title Checker</a></li>
                        <li><a href="./meta-desc-checker.html" class="hover:text-primary-600">Description Checker</a></li>
                        <li><a href="./keyword-extractor.html" class="hover:text-primary-600">Keyword Extractor</a></li>
                        <li><a href="./serp-preview.html" class="hover:text-primary-600">SERP Preview</a></li>
                        <li><a href="./readability-checker.html" class="hover:text-primary-600">Readability</a></li>
                        <li><a href="./content-score.html" class="hover:text-primary-600">Content Score</a></li>
                    </ul>
                </div>
            </div>
            <div class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                <p>&copy; ${year} TextUtils. All rights reserved.</p>
                <div class="flex items-center space-x-4 mt-4 md:mt-0">
                    <a href="./privacy.html" class="hover:text-primary-600">Privacy</a>
                    <a href="./terms.html" class="hover:text-primary-600">Terms</a>
                    <a href="./contact.html" class="hover:text-primary-600">Contact</a>
                    <a href="#" aria-label="Github" class="hover:text-slate-900 dark:hover:text-white"><i class="fa-brands fa-github text-xl"></i></a>
                </div>
            </div>
        </div>
    </footer>
    `;
}
