/**
 *
 * @param {String} selector
 * @param {HTMLElement} element
 *
 * @return {[HTMLElement]}
 */


const $$ = (selector, element = document) => {
  const ret = Array.from(element.querySelectorAll(selector));
  ret.addEventListener = (eventName, calback, ...options) => {
    ret.forEach(e => e.addEventListener(eventName, (...params) => {
      calback(params, e);
    }, ...options));
  };
  return ret;
};

module.exports = $$;
