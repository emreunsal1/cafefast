export const getLocal = (key) => {
  if (localStorage.getItem(key)) {
    return localStorage.getItem(key);
  }
  return false;
};

export const setLocal = (key, value) => {
  localStorage.setItem(key, value);
};

export const STORAGE = {
  getLocal,
  setLocal,
};
