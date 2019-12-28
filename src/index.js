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
 * @return {NodeList}
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
 *
 * @param {String} text
 *
 * @return {Node}
 */
const html = (text, ...stuff) => {
  let ht = '';
  text.forEach((part, index) => {
    if (allNodes(stuff[index])) {
      ht += part + stuff[index].map((e, i) => `<template temp-id='${index}' arr-id="${i}"></template>`).join('');
    } else if (!(stuff[index] instanceof Node)) {
      ht += stuff[index] ? part + stuff[index] : part;
    } else {
      ht += stuff[index] ? `${part}<template temp-id='${index}'></template>` : part;
    }
  });
  const template = document.createElement('template');
  template.innerHTML = ht.trim();
  const ret = template.content.firstChild;
  ret.statics = {};
  ret.events = {};
  $$('template', ret).forEach((e) => {
    const id = parseInt(e.getAttribute('temp-id'), 10);
    const arrId = parseInt(e.getAttribute('arr-id'), 10);
    const target = stuff[id][arrId] ? stuff[id][arrId] : stuff[id];
    e.parentElement.replaceChild(target, e);
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
    this.events = {};
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
    this.events[eventName].push(callback);
  }

  /**
   *
   * @param {String} eventName
   */
  clearEvent(eventName) {
    delete this.events[eventName];
  }

  /**
   *
   * @param {String} eventName
   * @param {any} params
   */


  emit(eventName, ...params) {
    this.events[eventName] = this.events[eventName] ? this.events[eventName] : [];
    this.events[eventName].forEach((callback) => {
      callback(...params);
    });
  }
}

// event helpers

/**
 *
 * @param {Number} keyCode
 * @return {Function}
 *
 */

const only = keyCode => fn => (evt) => {
  if (evt.keyCode === keyCode) {
    fn(evt);
  }
};

const backspace = only(8);
const tab = only(9);
const enter = only(13);
const shift = only(16);
const ctrl = only(17);
const alt = only(18);
const esc = only(27);
const left = only(37);
const up = only(38);
const right = only(39);
const down = only(40);


const inOutQuad = (n) => {
  // eslint-disable-next-line
  n *= 2;
  if (n < 1) return 0.5 * n * n;
  // eslint-disable-next-line
  return -0.5 * (--n * (n - 2) - 1);
};

// other

/**
 *
 * @param {Node} element Element to scroll
 * @param {Number} to height to scroll to
 * @param {Number} duration duration in ms
 */

const smoothScrollTo = (element, to, duration) => {
  const start = element.scrollTop;
  const change = to - start;
  const startDate = +new Date();

  const easeInOutQuad = (t, b, c, d) => {
    // eslint-disable-next-line no-param-reassign
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    // eslint-disable-next-line no-param-reassign
    t -= 1;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  const animateScroll = () => {
    const currentDate = +new Date();
    const currentTime = currentDate - startDate;
    // eslint-disable-next-line no-param-reassign
    element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration), 10);
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      // eslint-disable-next-line no-param-reassign
      element.scrollTop = to;
    }
  };
  animateScroll();
};

/**
 *
 * @param {Number} from
 * @param {Number} to
 * @param {Number} duration in ms
 * @param {Function} callback function to call on each frame
 * @param {*} easeFunction default inOutQuad
 */

const startAnimation = (
  from = 20,
  to = 300,
  duration = 1000,
  callback,
  easeFunction = inOutQuad,
) => {
  let stop = false;
  let start = null;
  const draw = (now) => {
    if (stop) return;
    if (now - start >= duration) stop = true;
    const p = (now - start) / duration;
    const val = easeFunction(p);
    const x = from + (to - from) * val;
    callback(x);
    requestAnimationFrame(draw);
  };
  const startAnim = (timeStamp) => {
    start = timeStamp;
    draw(timeStamp);
  };

  requestAnimationFrame(startAnim);
};

// Date

/**
 *
 * @param {Date} d1
 * @param {Date} d2
 *
 * @return {Boolean}
 */
const sameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear()
  && d1.getMonth() === d2.getMonth()
  && d1.getDate() === d2.getDate();

/**
 * @param {Date} d the Date
 * @return {Date[]} List with date objects for each day of the month
 */
const getDaysInMonth = (d = new Date()) => {
  const month = d.getMonth();
  const year = d.getFullYear();
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};


module.exports = {
  $,
  $$,
  html,
  EventManager,
  smoothScrollTo,
  only,
  KEYS: {
    backspace,
    tab,
    enter,
    shift,
    ctrl,
    alt,
    esc,
    left,
    up,
    right,
    down,
  },
  DATE: {
    sameDay,
    getDaysInMonth,
  },
  startAnimation,
  ANIMATION_FUNCTIONS: {
    inOutQuad,
  },
  emptyElement,
};
