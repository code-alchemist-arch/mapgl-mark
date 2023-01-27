export default function getBrowserLanguage() {
  const browserLang = navigator?.language || 'en-US';
  return browserLang.split('-')[0];
}

export function getTranslation(translations, key, value) {
  const translation = translations?.[key] || '';
  return translation.replaceAll('{value}', value);
}
