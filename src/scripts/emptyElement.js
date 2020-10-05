/**
 * empties a node
 * @param {HTMLElement} element
 *
 */

const emptyElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

module.exports = emptyElement;
