//Imports
const $$ = require('./array_selector');

// templating
const allNodes = arr => Array.isArray(arr)
  && arr.reduce((acc, current) => acc && current instanceof Node, true);


/**
 * Creates an Node element from string
 * Warning: you should escape any untreated string
 * @param {[String]} stringParts
 * @param {[Promise|Node|[Node]]} inBetweens
 *
 * @return {Node}
 */
const html = (stringParts, ...inBetweens) => {
  let ht = '';
  stringParts.forEach((part, index) => {
    if (allNodes(inBetweens[index])) {
      ht += part + inBetweens[index].map((e, i) => `<template style="display:none" temp-id='${index}' arr-id="${i}"></template>`).join('');
    } else if (!(inBetweens[index] instanceof Node) && !(inBetweens[index] instanceof Promise)) {
      ht += inBetweens[index] ? part + inBetweens[index] : part;
    } else {
      ht += inBetweens[index] ? `${part}<template style="display:none" temp-id='${index}'></template>` : part;
    }
  });
  const template = document.createElement('template');
  template.innerHTML = ht.trim();
  const ret = template.content.firstChild;
  $$('[temp-id]', ret).forEach((e) => {
    const id = parseInt(e.getAttribute('temp-id'), 10);
    const arrId = parseInt(e.getAttribute('arr-id'), 10);
    const target = inBetweens[id][arrId] ? inBetweens[id][arrId] : inBetweens[id];
    if (target instanceof Promise) {
      target.then((resp) => {
        if (resp instanceof Node) {
          e.parentElement.replaceChild(resp, e);
        } else {
          e.parentElement.replaceChild(document.createTextNode(resp), e);
        }
      });
    } else {
      e.parentElement.replaceChild(target, e);
    }
  });
  return ret;
};

module.exports = html;