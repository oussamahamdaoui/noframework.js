# Noframework.js

Noframework.js is a list of small javascript functions that help you write almost pure javascript. Javascript is a pretty amazing language and using obscure javascript frameworks where you have very little control over what happens can be very frustrating this is why I wrote down these helper functions.

## Getting started

Simply install it with npm `npm i @forgjs/noframework`

## The available functions:

### $
Returns the first element that matches a selector

```javascript
// Example

const { $ } = require('@forgjs/noframework');

const app = $('.app'); // selects the first element with class app
const menu = $('.menu', app); // selects the first element with class menu in app

```

### $$

Returns an array of elements matching the selector

```javascript
const { $, $$ } = require('@forgjs/noframework');

const app = $('.app'); // selects the first element with class app

const items = $$('.item', app); // selects the all the elements with class items in app

```


### html

Creates an node element from string

*Warning: this function does NOT escape the provided HTML please use `escape` when using untrusted strings*

```javascript
const { html } = require('@forgjs/noframework');

const app = html`
  <div class="app">

  </div>`;
document.appendChild(app);
```

- This also works with async functions:


```javascript
const { html } = require('@forgjs/noframework');

const page1 = async ()=>{
  const DomElement = html`<div class="page1"></div>`;
  const resp = await fetch('some-api.com');

  DomElement.innerText = await resp.text();

  return DomElement;
}

const app = html`
  <div class="app">
    ${page1()}
  </div>`;
document.appendChild(app);
```

- You can provide a list of Node elements too:


```javascript
const { html } = require('@forgjs/noframework');

const names = ['Alice', 'Bob', 'Eve'];

const Name = (name)=>{
  const DomElement = html`<div class="name">${name}</div>`;
  return DomElement;
}

const app = html`
  <div class="app">
    ${names.map(Name)}
  </div>`;
document.appendChild(app);
```

### escape

This function escapes a string to make it safe to use with the `html` function


```javascript
const { escape } = require('@forgjs/noframework');

escape('<div></div>') // returns &lt;div&gt;&lt;/div&gt;

```

### EventManager

This class allows you to manage events, it acts as a single object for data flow:

```javascript
const { EventManager, html } = require('@forgjs/noframework');

const Button = (eventManager) => {
  const DomElement = html`<button>Click me</button>`;

  DomElement.addEventListener('click', ()=>{
    eventManager.emit('addOne');
  });
}

const Counter = (eventManager) => {
  let value = 0;
  const DomElement = html`<div>${value}</div>`;

  eventManager.subscribe('addOne', ()=>{
    value += 1;
    DomElement.innerText = value;
  });
}

const globalEvents = new EventManager();
const app = html`<div class="app">
  ${Counter(globalEvents)}
  ${Button(globalEvents)}
</div>`;

```

An event manager instance has these methods:

- `emit(eventName, ...params)` where `eventName` is a string and `...params` is the data to send with the event

- `subscribe(eventName, callback)` where `eventName` is a string and `callback` is the function to call on the event.

- `unsubscribe(eventName, callback)` where `eventName` is a string and `callback` is a reference to the function to remove from the event.

- `clearEvent(eventName)` clears the event `eventName`

By default there is a `*` event which is fired on any event.

Every event has a `before-` and `after-` example:

```javascript
const { EventManager, html } = require('@forgjs/noframework');

  const eventManager = new EventManager();

  eventManager.subscribe('sayHello', (name) => {
    console.log(`hello ${name}`);
  });

   eventManager.subscribe('before-sayHello', (name) => {
    console.log('this runs before sayHello');
  });

   eventManager.subscribe('after-sayHello', (name) => {
    console.log('this runs after sayHello');
  });

  eventManager.subscribe('*', () => {
    console.log('this runs on any emit');
  });

  eventManager.emit('sayHello', 'ben');

```

### emptyElement

Removes all children of a Node element `emptyElement(nodeElement)`;


### cache

caches a function response

```javascript
const { EventManager, html } = require('@forgjs/noframework');

const add = (a, b) => {
  return a + b;
}

const cachedAdd = cache(add, 1000); // represents the cache time in ms

let two = cachedAdd(1, 1) // the first call runs add to get the response
two = cachedAdd(1,1) // you get the cached response instead of calling add again


```

if no time is provided the result is cached forever *warning: this may slow down your code*

### Router

Router is a class that provides you a simple way of routing, it uses `history.pushState` and `history.popState` *please make sure these are available in your targeted browsers before using*

```javascript

  const eventManager = new EventManager();
  const router = new Router(eventManager, '/404'); // '/404' is set as the url of the 404 page

  const errorPage = html`
    <div>
      404
    </div>
  `;


  const page1 = html`
    <div>
      page1
    </div>
  `;

  const page2 = html`
    <div>
      page2
    </div>
  `;


  router.set('/page1', page1);
  router.set('/page2', page2);
  router.set('/404', errorPage);


  const app = html`<div>${router.init()}</div>`;

  // now you can navigate your app by using the event manager like this:

  eventManager.emit('reroute', '/page2');
  eventManager.emit('reroute', '/page1');

  // router also provides an event witch is fired after every page change

  eventManager.subscribe('rerouted', (url, nodeElement, pageName)=>{
    // do things
  });

```

By default `Router` uses `document.pathName` to reroute to a specific component if you want to use a more complex routing system you can define it like this:

```javascript

  const eventManager = new EventManager();
  const router = new Router(eventManager, '/404'); // '/404' is set as the url of the 404 page

  const errorPage = html`
    <div>
      404
    </div>
  `;


  const page1 = html`
    <div>
      page1
    </div>
  `;

  const page2 = html`
    <div>
      page2
    </div>
  `;


  router.set('/page1', page1, (url, pageName) => { 
    // url contains the value of document location
    return (url.pathName === '/page1' && url.hash === '5') // if true the router will show the page1 component
  });

  router.set('/page2', page2);
  router.set('/404', errorPage);

```

`Router` uses `replaceWith()` to navigate between components if you want to animate the transition between pages or do something more specific you can define a transition function like this:

```javascript

  const eventManager = new EventManager();
  const router = new Router(eventManager, '/404'); // '/404' is set as the url of the 404 page

  const errorPage = html`
    <div>
      404
    </div>
  `;


  const page1 = html`
    <div>
      page1
    </div>
  `;

  const page2 = html`
    <div>
      page2
    </div>
  `;

  const transitionFn = (fromPage, toPage) => {
    // do your transition
    // toPage is not in the document you will need to append it to make it visible
  }


  router.set('/page1', page1, undefined, transitionFn);

  router.set('/page2', page2, undefined, transitionFn);
  router.set('/404', errorPage, undefined, transitionFn);

```