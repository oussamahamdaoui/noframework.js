/**
 * empties a node
 * @param {Node} element
 *
 */

const emptyElement = (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };
  
module.exports = emptyElement;  