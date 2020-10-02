const fHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char; // eslint-disable-line
    hash &= hash; // eslint-disable-line
  }
  return hash;
};

/**
 *
 * @param {Function} fn The function to be cached
 * @param {Number} storageTime cache time in ms
 * @return {Function}
 */

const cache = (fn, storageTime) => {
  const CALLS = {};
  const isOutOfTime = ms => (storageTime ? +Date.now() - ms > storageTime : false);
  return (...args) => {
    const key = fHash(JSON.stringify(args));
    if (!CALLS[key] || isOutOfTime(CALLS[key].lastCall)) {
      CALLS[key] = {};
      CALLS[key].resp = fn(...args);
      CALLS[key].lastCall = Date.now();
    }
    return CALLS[key].resp;
  };
};

module.exports = cache;