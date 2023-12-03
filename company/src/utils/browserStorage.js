/* eslint-disable no-plusplus */
export const getLocal = (key) => {
  const value = localStorage.getItem(key);
  if (localStorage.getItem(key)) {
    if (value === "false" || value === "true") {
      if (value === "false") {
        return false;
      }
      return true;
    }
    return value;
  }
  return null;
};

export const setLocal = (key, value) => {
  localStorage.setItem(key, value);
};

function getCookie(cookieName) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

export const STORAGE = {
  getLocal,
  setLocal,
  getCookie,
};
