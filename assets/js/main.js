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
    results.innerHTML = '';

    // Crear columnes
    const colTodo = document.createElement('div');
    colTodo.className = 'rules-column';
    colTodo.innerHTML = '<h3>TODO</h3>';
    const colNotTo = document.createElement('div');
    colNotTo.className = 'rules-column';
    colNotTo.innerHTML = '<h3>NOT TO</h3>';

    const rules = [
        ['Longitud mínima (12)', checks.hasMinLength(pwd)],
        ['Majúscules', checks.hasUppercase(pwd)],
        ['Minúscules', checks.hasLowercase(pwd)],
        ['Números', checks.hasNumber(pwd)],
        ['Símbols', checks.hasSymbol(pwd)]
    ];

        const rulesNot = [
        ['Repetició', checks.hasRepeatedChars(pwd)],
        ['Paraules conegudes', checks.hasKnownWords(pwd)],
        ['Seqüència', checks.hasSequentialChars(pwd)],
        ['Patrons', checks.hasPattern(pwd)]
    ];

    // Renderitzar regles positives (TODO)
    rules.forEach(([text, ok]) => {
        const p = document.createElement('p');
        p.textContent = (ok ? '✔ ' : '✖ ') + text;
        p.className = ok ? 'ok' : 'bad';
        colTodo.appendChild(p);
    });

    // Renderitzar regles negatives (NOT TO) i calcular penalització
    let penalty = 0;
    rulesNot.forEach(([text, found]) => {
        const ok = !found; // És bo si NO es troba
        if (found) penalty += 15; // Resta 15 bits per error
        const p = document.createElement('p');
        p.textContent = (ok ? '✔ ' : '✖ ') + text;
        p.className = ok ? 'ok' : 'bad';
        colNotTo.appendChild(p);
    });

    results.appendChild(colTodo);
    results.appendChild(colNotTo);

    let entropy = calculateEntropy(pwd) - penalty;
    if (entropy < 0) entropy = 0;
    
    const maxEntropy = 100; // Target entropy for 100%
    const percentage = Math.min((entropy / maxEntropy) * 100, 100);
    const hue = percentage * 1.2; // Map 0-100% to 0-120 hue (Red -> Yellow -> Green)
    
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
});