/* eslint-disable no-underscore-dangle */
// Selectors

/**
 *
 * @param {String} selector
 * @param {Node} element
 *
 * @return {Node}
 */

const $ = (selector, element = document) => element.querySelector(selector);

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


/**
 * A simple EventManager class that allows you to dispatch events and subscribe to them
 */

class EventManager {
  constructor() {
    this.events = {
      '*': [],
    };
  }

  /**
   *
   * @param {String} eventName
   * @param {Function} callback
   */

  unsubscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName].filter(e => e !== callback);
  }

  /**
   *
   * @param {String} eventName
   * @param {Function} callback
   */

  subscribe(eventName, callback) {
    this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
    this.events[`before-${eventName}`] = this.events[`before-${eventName}`] ? this.events[`before-${eventName}`] : [];
    this.events[`after-${eventName}`] = this.events[`after-${eventName}`] ? this.events[`after-${eventName}`] : [];

    this.events[eventName].push(callback);
  }

  /**
   *
   * @param {String} eventName
   */
  clearEvent(eventName) {
    delete this.events[`before-${eventName}`];
    delete this.events[`after-${eventName}`];
    delete this.events[eventName];
  }

  /**
   *
   * @param {String} eventName
   * @param {any} params
   */


  emit(eventName, ...params) {
    this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
    this.events[`before-${eventName}`] = this.events[`before-${eventName}`] ? this.events[`before-${eventName}`] : [];
    this.events[`after-${eventName}`] = this.events[`after-${eventName}`] ? this.events[`after-${eventName}`] : [];

    this.events[`before-${eventName}`].forEach((callback) => {
      callback(...params);
    });
    this.events[eventName].forEach((callback) => {
      callback(...params);
    });
    this.events[`after-${eventName}`].forEach((callback) => {
      callback(...params);
    });
    this.events['*'].forEach((callback) => {
      callback(eventName, ...params);
    });
  }
}

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


/**
 *
 * @param {String} string
 * @return {String}
 */

const escape = (string) => {
  const htmlReg = /["'&<>]/;
  const str = `${string}`;
  const match = htmlReg.exec(str);
  if (!match) {
    return str;
  }
  let escaped = '';
  let ret = '';
  let index = 0;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index += 1) { //eslint-disable-line
    switch (str.charCodeAt(index)) {
      case 34:
        escaped = '&quot;';
        break;
      case 38:
        escaped = '&amp;';
        break;
      case 39:
        escaped = '&#39;';
        break;
      case 60:
        escaped = '&lt;';
        break;
      case 62:
        escaped = '&gt;';
        break;
      default:
        // eslint-disable-next-line no-continue
        continue;
    }
    if (lastIndex !== index) {
      ret += str.substring(lastIndex, index);
    }
    lastIndex = index + 1;
    ret += escaped;
  }
  return lastIndex !== index ? ret + str.substring(lastIndex, index) : ret;
};


class Router {
  /**
   * @callback routingFunction Specifies if routing should happen to this pageName
   * @param {Location} url the value of document.location
   * @param {String} pageName the name of the page
   * @returns {Boolean} if true routes to pageName
   * */

  /**
   * @callback animationFunction Specifies the transition on routing
   * @param {Node} currentPage the current page element
   * @param {Node} destinationPage the destinationPage element
   * (this element is not in the dom if you want to animate you should first add it to the dom)
   * */

  /**
   * Creates a router element
   * @param {EventManager} eventManager an event manager object
   * @param {String} pageNotFound the name of the 404 page
   */
  constructor(eventManager, pageNotFound) {
    this.eventManager = eventManager;
    this.ROUTES = {};
    this.currentPage = html`<div></div>`;
    this.pageNotFound = pageNotFound;
    this.eventManager.subscribe('reroute', (url, title, data) => {
      window.history.pushState(data, title, url);
      this.onReroute(document.location);
    });
    window.addEventListener('popstate', (...params) => {
      this.onReroute(document.location, ...params);
    });
  }

  /**
 *
 * @param {String} pageName the name of the page
 * @param {Node} component the page Node element
 * @param {routingFunction} routingFunction Specifies if routing should happen to this pageName
 * @param {animationFunction} animationFunction Specifies the transition on routing
 */
  set(pageName, component, routingFunction, animationFunction) {
    this.ROUTES[pageName] = {
      component,
      pageName,
      routingFunction: routingFunction || Router.defaultRoutingFunction,
      animationFunction: animationFunction || Router.defaultAnimationFunction,
    };
  }

  static defaultRoutingFunction(url, pageName) {
    return pageName === url.pathname;
  }

  static defaultAnimationFunction(from, to) {
    from.replaceWith(to);
  }

  onReroute(url) {
    let rerouted = false;
    Object.values(this.ROUTES).forEach((route) => {
      if (route.routingFunction(url, route.pageName)) {
        route.animationFunction(this.currentPage, route.component);
        this.currentPage = route.component;
        this.eventManager.emit('rerouted', url, route.component, route.pageName);
        rerouted = true;
      }
    });
    if (rerouted === false) {
      const route = this.ROUTES[this.pageNotFound];
      route.animationFunction(this.currentPage, route.component);
      this.currentPage = route.component;
      this.eventManager.emit('rerouted', url, route.component, route.pageName);
      rerouted = true;
    }
  }

  /**
   * reroutes to the document.location and returns the router element
   */

  init() {
    this.eventManager.emit('reroute', document.location);
    return this.currentPage;
  }
}


module.exports = {
  $,
  $$,
  html,
  escape,
  EventManager,
  emptyElement,
  cache,
  Router,
};
