const locales = {
    "Software Developer": { tr: "Yazılım Geliştirici" },
    "yo": { tr: "yaşında" },
} as const;

type Locales = keyof typeof locales

export function t(label: Locales): string {
    const language = getUserLanguage();
    if (language === 'tr') return locales[label].tr;
    return label;
}

function getUserLanguage(): 'en' | 'tr' {
    // Not using SSR anyway.
    if (!("navigator" in globalThis)) return "en";
    if (navigator.language.startsWith('tr')) {
        return 'tr';
    }
    return 'en';
}
