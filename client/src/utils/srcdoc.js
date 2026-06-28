const fallbackImage =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill="#e5e7eb"/>
      <rect x="120" y="120" width="960" height="560" rx="32" fill="#d1d5db"/>
      <text x="600" y="412"
            text-anchor="middle"
            font-family="Arial"
            font-size="42"
            fill="#6b7280">
        Image unavailable
      </text>
    </svg>
`);

const storageShim = `
<script>
(function () {
  const store = {};

  const fakeStorage = {
    getItem(key) {
      return store[key] ?? null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      Object.keys(store).forEach(k => delete store[k]);
    }
  };

  try {
    Object.defineProperty(window, "localStorage", {
      value: fakeStorage,
      configurable: true
    });

    Object.defineProperty(window, "sessionStorage", {
      value: fakeStorage,
      configurable: true
    });
  } catch (e) {}
})();
</script>
`;

export const sanitizeSrcDoc = (html = "") =>
  html.replace(
    /https?:\/\/via\.placeholder\.com\/[^"'\s)]+/g,
    fallbackImage
  );

export const buildSrcDoc = (html = "") => {
  const sanitized = sanitizeSrcDoc(html);

  if (/<\/head>/i.test(sanitized)) {
    return sanitized.replace(
      /<\/head>/i,
      storageShim + "</head>"
    );
  }

  return storageShim + sanitized;
};