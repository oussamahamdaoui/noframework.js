/**
 *
 * @param {String} selector
 * @param {HTMLElement} element
 *
 * @return {HTMLElement}
 */

const $ = (selector, element = document) => element.querySelector(selector);

module.exports = $;
