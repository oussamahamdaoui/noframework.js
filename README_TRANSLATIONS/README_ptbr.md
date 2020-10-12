# ![noframework.js](https://oussamahamdaoui.github.io/nfmk-doc/media/logo.svg)

Noframework.js é uma lista de pequenas funções javascript que te ajudaram a escrever javascript quase puro. Javascript é uma linguagem incrível e usar frameworks obscuros onde você possui pouco controle sob o que acontece pode ser muito frustrante, por isso escrevi essas funções auxiliadoras.

## Começando

Para adicionar a um projeto existente rode: 

`npm i @forgjs/noframework`

Se quer começar um projeto completamente novo rode: 

`npx nfmk-init --init`

Para iniciar um servidor de desenvolvimento use: 

`npx nfmk-init --watch`

## Funções disponíveis:

### $
Retorna o primeiro elemento que corresponda a um seletor.

```javascript
// Example

const { $ } = require('@forgjs/noframework');

const App = $('.App'); // seleciona o primeiro elemento da classe App
const Menu = $('.Menu', App); // seleciona o primeiro elemento da classe Menu em App
```

### $$

Retorna uma array de elementos que corresponda a um seletor.

```javascript
const { $, $$ } = require('@forgjs/noframework');

const App = $('.App'); // seleciona o primeiro elemento da classe App

const Items = $$('.Item', App); // seleciona todos os elementos da classe Items em App

```


### html

Cria um elemento Node a partir de uma string.

*Aviso: esta função NÃO escapa o HTML, favor usar `escape` quando utilizar strings não confiáveis.*

```javascript
const { html } = require('@forgjs/noframework');

const app = html`
  <div class="app">

  </div>`;
document.appendChild(app);
```

- Isso também funciona com funções assíncronas.


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

- Você também pode utlizar uma lista de elementos Node:


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

Esta função escapa uma string para torná-la segura ao ser utilizada com a função `html`.


```javascript
const { escape } = require('@forgjs/noframework');

escape('<div></div>') // retorna &lt;div&gt;&lt;/div&gt;

```

### EventManager

Esta classe te permite manejar eventos, ela age como um único objeto para data flow:

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

Um event manager possui estes métodos:

- `emit(eventName, ...params)` onde `eventName` é uma string e `...params` é o dado para ser enviado com o evento.

- `subscribe(eventName, callback)` onde `eventName` é uma string e `callback` é uma função para chamar o evento.

- `unsubscribe(eventName, callback)` onde `eventName` é uma string e `callback` é uma referência à função para remover do evento.

- `clearEvent(eventName)` limpa o evento `eventName`.

Por padrão há um `*` evento que é ativado sob qualquer evento.

Todo evento possui um `before-` e `after-`, eexemplo:

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

Remove todos filhos de um elemento `emptyElement(nodeElement)`;


### cache

Adiciona a resposta de uma função ao cachê.

```javascript
const { EventManager, html } = require('@forgjs/noframework');

const add = (a, b) => {
  return a + b;
}

const cachedAdd = cache(add, 1000); // representa o tempo do cachê em milissegundos.

let two = cachedAdd(1, 1) // a primeira chamada roda add para receber a resposta.

two = cachedAdd(1,1) // você recebe a resposta do cachê invés de chamar add novamente.


```

Se nenhum espaço de tempo é forneciado a resposta é adicionada ao cachê para sempre. *AVISO: isso pode deixar seu código lento*

### Router

Router é uma classe que fornece um jeito simples de fazer rotas, ela usa `history.pushState` e `history.popState`. *Favor se assegurar que elas estão disponíveis nos browsers que você pretende atingir antes de usá-la.*

```javascript

  const eventManager = new EventManager();
  const router = new Router(eventManager, '/404'); // '/404' é definida como a url da página de erro 404.

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

  // agora você pode navegar pelo seu app usando o event manager assim:

  eventManager.emit('reroute', '/page2');
  eventManager.emit('reroute', '/page1');

  // router também provê um evento que é acionado sempre que a página muda

  eventManager.subscribe('rerouted', (url, nodeElement, pageName)=>{
    // faça algo
  });

```

Por padrão `Router` usa `document.pathName` para rerotear para um componente específico, se você quer usar um sistema de rotas mais complexo pode fazê-lo assim:

```javascript

  const eventManager = new EventManager();
  const router = new Router(eventManager, '/404'); // '/404' é definida como apágina do erro 404

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
    // url contém o local do documento
    return (url.pathName === '/page1' && url.hash === '5') // se verdadeiro o router mostrará a paágina 1 do documento
  });

  router.set('/page2', page2);
  router.set('/404', errorPage);

```

`Router` usa `replaceWith()` para navegar entre componentes, sevocê quer animar a transição entre páginas ou fazer algo mais específico você pode definir a função de transição assim:

```javascript

  const eventManager = new EventManager();
  const router = new Router(eventManager, '/404'); // '/404' é definida como a página do erro 404

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
    // faça a transição
    // toPage não está no documento, você terá que adicioná-la para torná-la visível.
  }


  router.set('/page1', page1, undefined, transitionFn);

  router.set('/page2', page2, undefined, transitionFn);
  router.set('/404', errorPage, undefined, transitionFn);

```
