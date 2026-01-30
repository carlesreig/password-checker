import * as checks from './checks.js';
import { calculateEntropy } from './entropy.js';

const input = document.getElementById('password');
const results = document.getElementById('results');
const strength = document.getElementById('strength');
const toggleBtn = document.getElementById('toggle-password');
let pwnedDebounce;

let bar = strength.querySelector('.bar');
if (!bar) {
    strength.innerHTML = ''; // Neteja contingut previ si n'hi ha
    bar = document.createElement('div');
    bar.className = 'bar';
    strength.appendChild(bar);
}

toggleBtn.addEventListener('click', () => {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    toggleBtn.innerHTML = type === 'password' 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>` 
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><line x1="3" y1="21" x2="21" y2="3"/></svg>`;
});

input.addEventListener('input', () => {
    const pwd = input.value;
    
    // Actualitzar regles TO DO
    updateRule('rule-length', checks.hasMinLength(pwd));
    updateRule('rule-uppercase', checks.hasUppercase(pwd));
    updateRule('rule-lowercase', checks.hasLowercase(pwd));
    updateRule('rule-number', checks.hasNumber(pwd));
    updateRule('rule-symbol', checks.hasSymbol(pwd));

    // Actualitzar regles NOT TO i calcular penalització
    let penalty = 0;
    let nextPenalty = 20; // Punts inicials per error
    let totalIncidents = 0;
    
    const checkPenalty = (id, count) => {
        if (count > 0) {
            // Apliquem penalització per CADA vegada que es trenca la regla
            for (let i = 0; i < count; i++) {
                penalty += nextPenalty;
                nextPenalty *= 2; // El següent error costarà el doble
                totalIncidents++;
            }
        }
        updateRule(id, count === 0);
    };

    checkPenalty('rule-repeat', checks.hasRepeatedChars(pwd));
    const wordCount = checks.hasKnownWords(pwd) + checks.isCommonPassword(pwd);
    checkPenalty('rule-words', wordCount);
    checkPenalty('rule-sequence', checks.hasSequentialChars(pwd));
    checkPenalty('rule-pattern', checks.hasPattern(pwd));
    updateRule('rule-reuse', true); // Reiniciem l'estat visual mentre esperem la comprovació

    let baseEntropy = calculateEntropy(pwd) - penalty;

    const updateVisuals = (pwnedCount) => {
        let entropy = baseEntropy;
        if (wordCount > 0 || pwnedCount > 0) {
            entropy *= 0.2;
        }
        if (totalIncidents >= 2) {
            entropy /= 2;
        }
        if (entropy < 0) entropy = 0;

        const maxEntropy = 100;
        const percentage = Math.min((entropy / maxEntropy) * 100, 100);
        const hue = percentage * 1.2;
        
        bar.style.width = `${percentage}%`;
        bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
    };

    updateVisuals(0);

    // Comprovació HIBP (Have I Been Pwned)
    clearTimeout(pwnedDebounce);
    let warning = document.getElementById('pwned-warning');
    if (!warning) {
        warning = document.createElement('div');
        warning.id = 'pwned-warning';
        warning.style.cssText = 'color: #dc3545; margin-top: 10px; font-weight: bold;';
        strength.after(warning);
    }
    warning.textContent = '';

    if (pwd) {
        pwnedDebounce = setTimeout(async () => {
            const count = await checks.checkPwnedPassword(pwd);
            if (input.value !== pwd) return;

            updateRule('rule-reuse', count === 0);
            if (count > 0) {
                warning.textContent = `⚠️ This password has already appeared in ${count} data leaks!`;
            }
            updateVisuals(count);
        }, 500);
    }
});

function updateRule(id, isOk) {
    const el = document.getElementById(id);
    if (el) {
        el.className = isOk ? 'ok' : 'bad';
        const icon = el.querySelector('.icon');
        if (icon) icon.textContent = isOk ? '✔' : '✖';
    }
}