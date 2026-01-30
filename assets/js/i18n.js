const translations = {
    ca: {
        title: "Comprovador de contrasenyes",
        resum_html: "Aquesta eina s'executa <strong>localment</strong>. No s'envien dades enlloc, revisa el <a href='https://github.com/carlesreig/password-checker' target='_blank'>codi font</a>.",
        placeholder: "Escriu la teva contrasenya aquí",
        show_password: "Mostra la contrasenya",
        todo_title: "A FER",
        not_to_title: "A EVITAR",
        rule_length: "Longitud mínima (12)",
        rule_uppercase: "Majúscules",
        rule_lowercase: "Minúscules",
        rule_number: "Números",
        rule_symbol: "Símbols",
        rule_repeat: "Repetició de caràcters",
        rule_sequence: "Seqüències",
        rule_pattern: "Patrons de teclat",
        rule_words: "Paraules conegudes",
        rule_reuse: "Reutilització de contrasenya",
        pwned_warning: "⚠️ Aquesta contrasenya ha aparegut en {count} filtracions de dades!",
        pwned_clean: ""
    },
    es: {
        title: "Comprobador de contraseñas",
        resum_html: "Esta herramienta se ejecuta <strong>localmente</strong>. No se envían datos, revisa el <a href='https://github.com/carlesreig/password-checker' target='_blank'>código fuente</a>.",
        placeholder: "Escribe tu contraseña aquí",
        show_password: "Mostrar contraseña",
        todo_title: "HACER",
        not_to_title: "EVITAR",
        rule_length: "Longitud mínima (12)",
        rule_uppercase: "Mayúsculas",
        rule_lowercase: "Minúsculas",
        rule_number: "Números",
        rule_symbol: "Símbolos",
        rule_repeat: "Repetición de caracteres",
        rule_sequence: "Secuencias",
        rule_pattern: "Patrones de teclado",
        rule_words: "Palabras conocidas",
        rule_reuse: "Reutilización de contraseña",
        pwned_warning: "⚠️ ¡Esta contraseña ha aparecido en {count} filtraciones de datos!",
        pwned_clean: ""
    },
    en: {
        title: "Password Checker",
        resum_html: "This tool runs <strong>locally</strong>. No data sent anywhere, check out the <a href='https://github.com/carlesreig/password-checker' target='_blank'>source code</a>.",
        placeholder: "Type your password here",
        show_password: "Show password",
        todo_title: "TO DO",
        not_to_title: "NOT TO",
        rule_length: "Minimum length (12)",
        rule_uppercase: "Uppercase",
        rule_lowercase: "Lowercase",
        rule_number: "Numbers",
        rule_symbol: "Symbols",
        rule_repeat: "Character repetition",
        rule_sequence: "Sequence",
        rule_pattern: "Patterns",
        rule_words: "Known words",
        rule_reuse: "Password reuse",
        pwned_warning: "⚠️ This password has already appeared in {count} data leaks!",
        pwned_clean: ""
    }
};

export function t(key) {
    const lang = localStorage.getItem("lang") || "ca";
    return translations[lang][key] || key;
}

export function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    
    // Actualitzar selector si cal
    const selector = document.getElementById("language-selector");
    if (selector && selector.value !== lang) {
        selector.value = lang;
    }

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang][key]) {
            // Si la clau acaba en _html, fem servir innerHTML per mantenir enllaços/negretes
            if (key.endsWith('_html')) {
                el.innerHTML = translations[lang][key];
            } else if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = translations[lang][key];
            } else if (el.hasAttribute('aria-label')) {
                el.setAttribute('aria-label', translations[lang][key]);
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Disparar un event personalitzat per si altres scripts necessiten saber que ha canviat l'idioma
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

export function initLanguage() {
    const savedLang = localStorage.getItem("lang");
    const browserLang = navigator.language.slice(0, 2);
    const supportedLangs = ['ca', 'es', 'en'];
    
    let langToUse = 'ca'; // Per defecte
    
    if (savedLang && supportedLangs.includes(savedLang)) {
        langToUse = savedLang;
    } else if (supportedLangs.includes(browserLang)) {
        langToUse = browserLang;
    }

    setLanguage(langToUse);
    return langToUse;
}