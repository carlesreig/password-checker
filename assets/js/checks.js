let commonPasswords = [];

fetch('data/common-passwords.json')
  .then(r => r.json())
  .then(list => {
    commonPasswords = list.map(p => p.toLowerCase());
  });

export function isCommonPassword(pwd) {
  const p = pwd.toLowerCase();
  return commonPasswords.filter(word => p.includes(word)).length;
}

export function hasMinLength(pwd, min = 12) {
    return pwd.length >= min;
}

export function hasUppercase(pwd) {
    return /[A-Z]/.test(pwd);
}

export function hasLowercase(pwd) {
    return /[a-z]/.test(pwd);
}

export function hasNumber(pwd) {
    return /\d/.test(pwd);
}

export function hasSymbol(pwd) {
    return /[^A-Za-z0-9]/.test(pwd);
}

export function hasRepeatedChars(pwd) {
    const matches = pwd.match(/(.)\1{2,}|(.{2,})\2+/g); // 3+ chars iguals o patrons repetits (ex: a1a1)
    return matches ? matches.length : 0;
}

export function hasKnownWords(pwd) {
    return (pwd.match(/password|admin|trump|123456|qwerty|access/gi) || []).length;
}

export function hasSequentialChars(pwd) {
    return (pwd.match(/123|234|345|456|567|678|789|abc|bcd|cde|def|efg/gi) || []).length;
}

export function hasPattern(pwd) {
    return (pwd.match(/asdf|zxcv|qwer|jkl|uiop/gi) || []).length;
}

export async function checkPwnedPassword(pwd) {
    if (!pwd) return 0;

    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();
    
    const lines = text.split('\n');
    for (const line of lines) {
        const [hashSuffix, occurrences] = line.split(':');
        if (hashSuffix === suffix) return parseInt(occurrences, 10);
    }
    return 0;
}