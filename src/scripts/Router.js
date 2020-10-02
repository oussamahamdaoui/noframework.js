//Imports
const html = require('./html');

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

  module.exports = Router;