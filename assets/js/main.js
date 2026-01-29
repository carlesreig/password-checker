import * as checks from './checks.js';
import { calculateEntropy } from './entropy.js';

const input = document.getElementById('password');
const results = document.getElementById('results');
const strength = document.getElementById('strength');
const bar = strength.querySelector('.bar');

input.addEventListener('input', () => {
    const pwd = input.value;
    results.innerHTML = '';

    const rules = [
        ['Longitud mínima (12)', checks.hasMinLength(pwd)],
        ['Majúscules', checks.hasUppercase(pwd)],
        ['Minúscules', checks.hasLowercase(pwd)],
        ['Números', checks.hasNumber(pwd)],
        ['Símbols', checks.hasSymbol(pwd)]
    ];

    rules.forEach(([text, ok]) => {
        const p = document.createElement('p');
        p.textContent = (ok ? '✔ ' : '✖ ') + text;
        p.className = ok ? 'ok' : 'bad';
        results.appendChild(p);
    });

    const entropy = calculateEntropy(pwd);
    
    const maxEntropy = 100; // Target entropy for 100%
    const percentage = Math.min((entropy / maxEntropy) * 100, 100);
    const hue = percentage * 1.2; // Map 0-100% to 0-120 hue (Red -> Yellow -> Green)
    
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
});