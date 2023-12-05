const boolinize = (value) => {
  if (value === "false") {
    return false;
  }
  if (value === "true") {
    return true;
  }
  return value;
};

export const getLocal = (key) => {
  const value = localStorage.getItem(key);
  if (value) {
    return boolinize(value);
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

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return boolinize(cookie.substring(name.length, cookie.length));
    }
  }
  return null;
}

export const STORAGE = {
  getLocal,
  setLocal,
  getCookie,
};
