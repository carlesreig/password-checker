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