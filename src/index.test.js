const {
  html, $, $$, cache, emptyElement,
  EventManager, Router, escape,
} = require('./index');


const wait = ms => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, ms);
});


test('$$ selector', () => {
  const table = html`
    <table>
      <td></td>
    </table>
  `;

  expect($$('td', table).length).toBe(1);
});


test('$$ selector event listener', () => {
  const table = html`
    <table>
      <td></td>
      <td></td>
    </table>
  `;
  const evt = jest.fn();
  $$('td', table).addEventListener('click', evt);
  $('td', table).click();
  expect(evt).toBeCalled();
});


test('$ selector', () => {
  const table = html`
    <table>
      <td></td>
    </table>
  `;

  expect($('td', table).nodeName).toBe('TD');
});

test('html with table', () => {
  const table = html`
    <table>
      ${[1, 3, 4].map(e => html`<tr>
      <td>${e}</td>
      </tr>`)}
    </table>
  `;

  expect(table.children.length).toBe(3);
});

test('html with array', () => {
  const div = html`
    <div>
      ${[1, 3, 4]}
    </div>
  `;

  expect(div.children.length).toBe(0);
  expect(div.innerHTML.trim()).toBe('1,3,4');
});

test('caching function', async () => {
  const add = jest.fn((a, b) => a + b);

  const cachedAdd = cache(add, 1000);

  const call1 = cachedAdd(1, 2);
  expect(add.mock.calls.length).toBe(1);
  expect(call1).toBe(3);
  const call2 = cachedAdd(1, 2);
  expect(call2).toBe(3);
  expect(add.mock.calls.length).toBe(1);

  await wait(1000); // wait 1000 ms until cache expires
  const call3 = cachedAdd(1, 2);
  expect(add.mock.calls.length).toBe(2);
  expect(call3).toBe(3);
});

test('cached result ', async () => {
  const add = (a, b) => a + b;

  const cachedAdd = cache(add, 500);

  const call1 = cachedAdd(1, 2);
  expect(call1).toBe(3);
  const call2 = cachedAdd(1, 2);
  expect(call2).toBe(3);

  await wait(605); // wait 1000 ms until cache expires
  const call3 = cachedAdd(1, 2);
  expect(call3).toBe(3);
});

test('caching function without params', async () => {
  const oneFn = jest.fn(() => 1);

  const cachedAdd = cache(oneFn, 500);

  const call1 = cachedAdd();
  expect(oneFn.mock.calls.length).toBe(1);
  expect(call1).toBe(1);
  const call2 = cachedAdd();
  expect(call2).toBe(1);
  expect(oneFn.mock.calls.length).toBe(1);

  await wait(1000); // wait 1000 ms until cache expires
  const call3 = cachedAdd();
  expect(oneFn.mock.calls.length).toBe(2);
  expect(call3).toBe(1);
});


test('emptyElement', () => {
  const a = document.createElement('div');
  const b = document.createElement('div');
  const c = document.createElement('div');

  a.appendChild(b);
  a.appendChild(c);

  expect(a.childNodes.length).toBe(2);
  emptyElement(a);
  expect(a.childNodes.length).toBe(0);
});


test('EventManager create event', () => {
  const doSomething = jest.fn((...stuff) => stuff);
  const eventManager = new EventManager();

  eventManager.subscribe('do-something', doSomething);
  expect(doSomething.mock.calls.length).toBe(0);
  eventManager.emit('do-something');
  expect(doSomething.mock.calls.length).toBe(1);
});

test('EventManager clear event', () => {
  const doSomething = jest.fn(() => { });
  const eventManager = new EventManager();

  eventManager.subscribe('do-something', doSomething);
  expect(doSomething.mock.calls.length).toBe(0);
  eventManager.emit('do-something');
  expect(doSomething.mock.calls.length).toBe(1);
  eventManager.clearEvent('do-something');
  eventManager.emit('do-something');
  expect(doSomething.mock.calls.length).toBe(1);
});

test('EventManager before event', () => {
  const doSomething = jest.fn();
  const before = jest.fn();
  const eventManager = new EventManager();

  eventManager.subscribe('do-something', doSomething);
  eventManager.subscribe('before-do-something', before);
  expect(doSomething.mock.calls.length).toBe(0);
  expect(before.mock.calls.length).toBe(0);

  eventManager.emit('do-something');
  expect(doSomething.mock.calls.length).toBe(1);
  expect(before.mock.calls.length).toBe(1);

  eventManager.clearEvent('do-something');
  eventManager.emit('do-something');
  expect(doSomething.mock.calls.length).toBe(1);
  expect(before.mock.calls.length).toBe(1);
});


test('html with promises', async () => {
  const someComponent = async () => html`
    <div>
      hello
    </div>
  `;

  const div = html`
    <div>
      ${someComponent()}
    </div>
  `;

  await wait(1);

  expect(div.children.length).toBe(1);
  expect(div.innerHTML.indexOf('hello') !== -1).toBe(true);
});


test('html with promise resolved as string', async () => {
  const someComponent = async () => 'hello';

  const div = html`
    <div>
      ${someComponent()}
    </div>
  `;

  await wait(1);

  expect(div.children.length).toBe(0);
  expect(div.innerHTML.trim()).toBe('hello');
});


test('simple router', async () => {
  const eventManager = new EventManager();
  const router = new Router(eventManager, '/page1');

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

  const app = html`<div>${router.init()}</div>`;
  expect(app.firstChild.innerHTML.trim()).toBe('page1');
  eventManager.emit('reroute', '/page2');
  expect(window.location.pathname).toBe('/page2');
  expect(app.firstChild.innerHTML.trim()).toBe('page2');
});


test('escape', () => {
  expect(escape('')).toBe('');
  expect(escape('"')).toBe('&quot;');
  expect(escape('alice"bob')).toBe('alice&quot;bob');
  expect(escape('&')).toBe('&amp;');
  expect(escape('&alice')).toBe('&amp;alice');
  expect(escape('bob&')).toBe('bob&amp;');
  expect(escape('alice&bob')).toBe('alice&amp;bob');
  expect(escape('\'')).toBe('&#39;');
  expect(escape('<')).toBe('&lt;');
  expect(escape('>')).toBe('&gt;');
  expect(escape('<div>')).toBe('&lt;div&gt;');
  expect(escape('<div></div>')).toBe('&lt;div&gt;&lt;/div&gt;');
  expect(escape('<div>&hello"\'</div>')).toBe('&lt;div&gt;&amp;hello&quot;&#39;&lt;/div&gt;');
});
