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
    return /(.)\1{2,}/.test(pwd); // 3 caràcters iguals seguits
}

export function hasKnownWords(pwd) {
    return /password|admin|123456|qwerty|access/i.test(pwd);
}

export function hasSequentialChars(pwd) {
    return /123|234|345|456|567|678|789|abc|bcd|cde|def|efg/i.test(pwd);
}

export function hasPattern(pwd) {
    return /asdf|zxcv|qwer|jkl|uiop/i.test(pwd);
}