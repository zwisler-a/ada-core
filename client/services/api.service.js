export const ApiService = {
  fetch: (url, options) => {
    return fetch(url, options)
      .then((res) => {
        if (res.redirected) {
          document.cookie = `redirect=${btoa(
            window.location.pathname,
          )}; path=/`;
          console.log(document.cookie);
          window.location.href = res.url;
        }
        return res;
      })
      .then((res) => res.json());
  },
  getProfile: () => {
    return fetch('/auth/profile').then((res) => res.json());
  },
};
