// "Remember me" → localStorage (survives browser restart)
// otherwise      → sessionStorage (cleared when the tab/browser closes)

const stores = () => [window.localStorage, window.sessionStorage];

export const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

export const getUser = () => {
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  stores().forEach((s) => {
    s.removeItem('token');
    s.removeItem('user');
  });
};

export const saveAuth = ({ token, user }, remember = true) => {
  clearAuth();
  const store = remember ? localStorage : sessionStorage;
  store.setItem('token', token);
  store.setItem('user', JSON.stringify(user));
};
