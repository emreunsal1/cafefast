export const getLocalValue = (key) => {
  if (localStorage.getItem(key)) {
    return localStorage.getItem(key);
  }
  return false;
};
