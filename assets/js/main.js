import * as checks from './checks.js';
import { calculateEntropy } from './entropy.js';

const input = document.getElementById('password');
const results = document.getElementById('results');
const strength = document.getElementById('strength');

let bar = strength.querySelector('.bar');
if (!bar) {
    strength.innerHTML = ''; // Neteja contingut previ si n'hi ha
    bar = document.createElement('div');
    bar.className = 'bar';
    strength.appendChild(bar);
}

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
    
    const checkPenalty = (id, found) => {
        if (found) penalty += 15;
        updateRule(id, !found);
    };

    checkPenalty('rule-repeat', checks.hasRepeatedChars(pwd));
    checkPenalty('rule-words', checks.hasKnownWords(pwd));
    checkPenalty('rule-sequence', checks.hasSequentialChars(pwd));
    checkPenalty('rule-pattern', checks.hasPattern(pwd));

    let entropy = calculateEntropy(pwd) - penalty;
    if (entropy < 0) entropy = 0;
    
    const maxEntropy = 100; // Target entropy for 100%
    const percentage = Math.min((entropy / maxEntropy) * 100, 100);
    const hue = percentage * 1.2; // Map 0-100% to 0-120 hue (Red -> Yellow -> Green)
    
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
});

function updateRule(id, isOk) {
    const el = document.getElementById(id);
    if (el) {
        el.className = isOk ? 'ok' : 'bad';
        const icon = el.querySelector('.icon');
        if (icon) icon.textContent = isOk ? '✔' : '✖';
    }
}