module.exports = {
  locales: ['en', 'pt-BR'], 
  defaultLocale: 'en', 
  localeDetection: false, 
  pages: {
    '*': ['common'], 
  },
  loadLocaleFrom: (lang, ns) => {
    return import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default)
  }
}