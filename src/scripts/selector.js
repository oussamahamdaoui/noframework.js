/**
 *
 * @param {String} selector
 * @param {Node} element
 *
 * @return {Node}
 */

const $ = (selector, element = document) => element.querySelector(selector);

module.exports = $;