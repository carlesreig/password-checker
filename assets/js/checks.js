let commonPasswords = [];

fetch('data/common-passwords.json')
  .then(r => r.json())
  .then(list => {
    commonPasswords = list.map(p => p.toLowerCase());
  });

export function isCommonPassword(pwd) {
  const p = pwd.toLowerCase();
  return commonPasswords.some(word => p.includes(word));
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
    return matches ? matches.reduce((acc, curr) => acc + curr.length, 0) : 0;
}

export function hasKnownWords(pwd) {
    return /password|admin|trump|123456|qwerty|access/i.test(pwd);
}

export function hasSequentialChars(pwd) {
    return /123|234|345|456|567|678|789|abc|bcd|cde|def|efg/i.test(pwd);
}

export function hasPattern(pwd) {
    return /asdf|zxcv|qwer|jkl|uiop/i.test(pwd);
}