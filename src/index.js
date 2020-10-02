/* eslint-disable no-underscore-dangle */

//Imports
const $ = require('./scripts/selector');
const $$ = require('./scripts/array_selector');
const html = require('./scripts/html');
const emptyElement = require('./scripts/emptyElement');
const cache = require('./scripts/cache');
const escape = require('./scripts/escape');
const EventManager = require('./scripts/EventManager');
const Router = require('./scripts/Router');

//Exports
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
