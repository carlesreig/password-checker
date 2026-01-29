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