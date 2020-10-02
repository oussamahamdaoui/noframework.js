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

  module.exports = EventManager;