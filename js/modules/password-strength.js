/**
 * Password Strength Checker Module
 * Real-time password analysis with entropy calculation and crack time estimation
 */

export default function initPasswordStrength() {
    // DOM Elements
    const passwordInput = document.getElementById('password-input');
    const toggleVisibility = document.getElementById('toggle-visibility');
    const copyButton = document.getElementById('copy-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthLabel = document.getElementById('strength-label');
    const crackTime = document.getElementById('crack-time');

    // Stats
    const statLength = document.getElementById('stat-length');
    const statEntropy = document.getElementById('stat-entropy');
    const statCharset = document.getElementById('stat-charset');
    const statScore = document.getElementById('stat-score');

    // Checklist items
    const checkLength = document.getElementById('check-length');
    const checkUppercase = document.getElementById('check-uppercase');
    const checkLowercase = document.getElementById('check-lowercase');
    const checkNumber = document.getElementById('check-number');
    const checkSpecial = document.getElementById('check-special');
    const checkLong = document.getElementById('check-long');

    if (!passwordInput) return;

    // Common passwords to check against
    const COMMON_PASSWORDS = [
        'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'letmein',
        'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine',
        'master', 'welcome', 'shadow', 'ashley', 'football', 'jesus', 'michael',
        'ninja', 'mustang', 'password1', '123456789', 'password123'
    ];

    // Strength levels configuration
    const STRENGTH_LEVELS = [
        { min: 0, max: 20, label: 'Very Weak', color: 'bg-red-500', labelBg: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
        { min: 21, max: 40, label: 'Weak', color: 'bg-orange-500', labelBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
        { min: 41, max: 60, label: 'Fair', color: 'bg-yellow-500', labelBg: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' },
        { min: 61, max: 80, label: 'Strong', color: 'bg-lime-500', labelBg: 'bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400' },
        { min: 81, max: 100, label: 'Very Strong', color: 'bg-emerald-500', labelBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' }
    ];

    /**
     * Calculate charset size based on characters used
     */
    function getCharsetSize(password) {
        let size = 0;
        if (/[a-z]/.test(password)) size += 26;
        if (/[A-Z]/.test(password)) size += 26;
        if (/[0-9]/.test(password)) size += 10;
        if (/[^a-zA-Z0-9]/.test(password)) size += 32; // Approximate special chars
        return size;
    }

    /**
     * Calculate password entropy in bits
     */
    function calculateEntropy(password) {
        if (!password.length) return 0;
        const charsetSize = getCharsetSize(password);
        if (charsetSize === 0) return 0;
        return Math.round(password.length * Math.log2(charsetSize));
    }

    /**
     * Calculate estimated crack time
     */
    function calculateCrackTime(entropy) {
        // Assume 10 billion guesses per second (high-end GPU cluster)
        const guessesPerSecond = 10e9;
        const totalCombinations = Math.pow(2, entropy);
        const seconds = totalCombinations / guessesPerSecond / 2; // Average case

        if (seconds < 1) return 'Instantly';
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
        if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;

        const years = seconds / 31536000;
        if (years < 1000) return `${Math.round(years)} years`;
        if (years < 1e6) return `${Math.round(years / 1000)} thousand years`;
        if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
        if (years < 1e12) return `${Math.round(years / 1e9)} billion years`;
        return `${(years / 1e12).toFixed(1)} trillion years`;
    }

    /**
     * Calculate overall password score (0-100)
     */
    function calculateScore(password) {
        if (!password.length) return 0;

        let score = 0;
        const length = password.length;
        const entropy = calculateEntropy(password);

        // Length scoring (up to 30 points)
        if (length >= 8) score += 10;
        if (length >= 12) score += 10;
        if (length >= 16) score += 10;

        // Character variety (up to 40 points)
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^a-zA-Z0-9]/.test(password)) score += 10;

        // Entropy bonus (up to 20 points)
        if (entropy >= 40) score += 5;
        if (entropy >= 60) score += 5;
        if (entropy >= 80) score += 5;
        if (entropy >= 100) score += 5;

        // Bonus for very long passwords (up to 10 points)
        if (length >= 20) score += 5;
        if (length >= 24) score += 5;

        // Penalties
        // Repeated characters
        if (/(.)\1{2,}/.test(password)) score -= 10;
        // Sequential characters
        if (/(?:abc|bcd|cde|def|efg|123|234|345|456|567|678|789)/i.test(password)) score -= 10;
        // Common passwords
        if (COMMON_PASSWORDS.includes(password.toLowerCase())) score = Math.min(score, 10);
        // Only numbers
        if (/^\d+$/.test(password)) score -= 15;
        // Only letters
        if (/^[a-zA-Z]+$/.test(password)) score -= 10;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Update check item visual state
     */
    function updateCheckItem(element, passed) {
        if (!element) return;
        const icon = element.querySelector('i');

        if (passed) {
            element.classList.remove('fail');
            element.classList.add('pass');
            icon.className = 'fa-solid fa-circle-check';
        } else {
            element.classList.remove('pass');
            element.classList.add('fail');
            icon.className = 'fa-solid fa-circle-xmark';
        }
    }

    /**
     * Get strength level based on score
     */
    function getStrengthLevel(score) {
        return STRENGTH_LEVELS.find(level => score >= level.min && score <= level.max) || STRENGTH_LEVELS[0];
    }

    /**
     * Analyze password and update UI
     */
    function analyzePassword() {
        const password = passwordInput.value;

        if (!password) {
            // Reset UI
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar h-full rounded-full bg-slate-300';
            strengthLabel.textContent = 'Enter password';
            strengthLabel.className = 'text-sm font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500';
            crackTime.textContent = 'Enter a password to analyze';

            statLength.textContent = '0';
            statEntropy.textContent = '0';
            statCharset.textContent = '0';
            statScore.textContent = '0';

            updateCheckItem(checkLength, false);
            updateCheckItem(checkUppercase, false);
            updateCheckItem(checkLowercase, false);
            updateCheckItem(checkNumber, false);
            updateCheckItem(checkSpecial, false);
            updateCheckItem(checkLong, false);
            return;
        }

        const score = calculateScore(password);
        const entropy = calculateEntropy(password);
        const charsetSize = getCharsetSize(password);
        const level = getStrengthLevel(score);

        // Update strength bar
        strengthBar.style.width = `${score}%`;
        strengthBar.className = `strength-bar h-full rounded-full ${level.color}`;

        // Update strength label
        strengthLabel.textContent = level.label;
        strengthLabel.className = `text-sm font-bold px-3 py-1 rounded-full ${level.labelBg}`;

        // Update stats
        statLength.textContent = password.length;
        statEntropy.textContent = entropy;
        statCharset.textContent = charsetSize;
        statScore.textContent = score;

        // Update crack time
        crackTime.textContent = calculateCrackTime(entropy);

        // Update checklist
        updateCheckItem(checkLength, password.length >= 8);
        updateCheckItem(checkUppercase, /[A-Z]/.test(password));
        updateCheckItem(checkLowercase, /[a-z]/.test(password));
        updateCheckItem(checkNumber, /[0-9]/.test(password));
        updateCheckItem(checkSpecial, /[^a-zA-Z0-9]/.test(password));
        updateCheckItem(checkLong, password.length >= 12);
    }

    // Event Listeners

    // Real-time password analysis
    passwordInput.addEventListener('input', analyzePassword);

    // Toggle password visibility
    toggleVisibility?.addEventListener('click', () => {
        const icon = toggleVisibility.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fa-solid fa-eye-slash text-xl';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fa-solid fa-eye text-xl';
        }
    });

    // Copy password to clipboard
    copyButton?.addEventListener('click', async () => {
        const password = passwordInput.value;
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            const icon = copyButton.querySelector('i');
            const originalClass = icon.className;

            // Show success feedback
            icon.className = 'fa-solid fa-check text-lg';
            copyButton.classList.remove('text-slate-400');
            copyButton.classList.add('text-emerald-500');

            setTimeout(() => {
                icon.className = originalClass;
                copyButton.classList.remove('text-emerald-500');
                copyButton.classList.add('text-slate-400');
            }, 1500);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });

    // Initialize
    analyzePassword();
}

// Auto-initialize if on password strength page
if (document.querySelector('#password-input')) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPasswordStrength);
    } else {
        initPasswordStrength();
    }
}
