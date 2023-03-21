class Storage {
  getLocal(name) {
    const result = localStorage.getItem(name);
    return result;
  }
  setLocal(name, value) {
    localStorage.setItem(name, value);
  }

  getCookie(name) {}
  setCookie(name, value) {}
}
