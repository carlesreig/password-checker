export function calculateEntropy(password) {
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/\d/.test(password)) pool += 10;
    if (/[^A-Za-z0-9]/.test(password)) pool += 32;
    return password.length * Math.log2(pool || 1);
}