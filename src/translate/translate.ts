export const translateEn = {
  'Popular Movies': 'Popular Movies',
};
export const translateUa = {
  'Popular Movies': 'Популярні фільми',
};

export const translate = {
  en: translateEn,
  ua: translateUa,
};

export const getTranslate = (key: string) => {
  return translate[key];
};
