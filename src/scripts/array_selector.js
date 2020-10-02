/**
 *
 * @param {String} selector
 * @param {Node} element
 *
 * @return {[Node]}
 */


const $$ = (selector, element = document) => {
    const ret = Array.from(element.querySelectorAll(selector));
    ret.addEventListener = (...params) => {
      ret.forEach(e => e.addEventListener(...params));
    };
    return ret;
  };

  module.exports = $$;