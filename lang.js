// lang.js — Multilingue statique CMSE
(function () {
  const SUPPORTED = ['fr', 'ar', 'en'];
  const DEFAULT_LANG = 'fr';
  const STORAGE_KEY = 'cmse_lang';

  const FILES = {
    fr: 'index.html',
    ar: 'index-ar.html',
    en: 'index-en.html'
  };

  function currentLang() {
    const p = window.location.pathname;
    if (p.endsWith('index-ar.html')) return 'ar';
    if (p.endsWith('index-en.html')) return 'en';
    return 'fr';
  }

  function goTo(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    if (lang === currentLang()) return;
    const hash = window.location.hash || '';
    window.location.replace(FILES[lang] + hash);
  }

  function detectBrowser() {
    const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : DEFAULT_LANG;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const here = currentLang();

    // Redirection automatique UNIQUEMENT si on est sur la page FR par défaut
    // et que l'utilisateur n'a pas encore choisi manuellement.
    if (!saved && here === DEFAULT_LANG) {
      const browser = detectBrowser();
      if (browser !== DEFAULT_LANG) {
        localStorage.setItem(STORAGE_KEY, browser);
        goTo(browser);
        return;
      }
    }
    // Si une langue est mémorisée et différente de la page courante → on suit
    if (saved && saved !== here) {
      goTo(saved);
      return;
    }

    // Sinon, on lie les boutons de sélection
    document.querySelectorAll('[data-lang]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = el.getAttribute('data-lang');
        localStorage.setItem(STORAGE_KEY, lang);
        goTo(lang);
      });
    });
  });

  // Optionnel : exposer globalement
  window.CMSE_setLang = (lang) => {
    localStorage.setItem(STORAGE_KEY, lang);
    goTo(lang);
  };
})();