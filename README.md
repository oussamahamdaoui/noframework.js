# @forgjs/noframework.js

@forgjs/noframework.js is just a file containig a few helper functions to help developpers write almost vanilla javascript. The reason of this project is to make developpers understand that they don't always need a framework and that javascript is pretty powerful on its own. 
The module is composed of one main function `html` that transforms a `String` to `Dom Element`, all the other functions are small functions to prevent you from repeating yourself.

See by yourself, here are the exported functions:
```javascript
module.exports = {
  $, // a single element selector
  $$, // a multiple element selector
  html, // String to Dom element with small tweaks
  EventManager, // a global event manager
  only, // key event catcher
  smoothScrollTo, // scroll smoothly to element
  KEYS: { // predefined key catchers 
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
    sameDay, // are two dates the same day
    getDaysInMonth, // get a list of days in month
  },
  startAnimation, // Animation function
  ANIMATION_FUNCTIONS: {
    inOutQuad,
  },
};
```

That's all what it is, a single file undestandable by anyone with basic javascript knowledge.

This is documentation is a good tutorial to teach devs how to set up their developpment environment, and make them understand what really happens when they use pre-configured tools like `create-react-app`, thats why it goes trough all the configuration.

You can see some examples live [here](https://oussamahamdaoui.github.io/noframework.js/build/)

## Getting started 🛠

Here are the 11 steps you need to follow to get started:

1. create a folder for your project
2. run  `npm init`
3. run  `npm install @forgjs/noframework`
4. run  `npm install watchify`
5. add a watching script to `package.json`

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "",
  "main": "ndex.js",
  "scripts": {
    "watch": "watchify src/index.js -o build/index.js"
  },
  "devDependencies": {
    "watchify": "^3.11.1"
  },
  "dependencies":{
    "@forgjs/noframework": "^1.0.0"
  }
}
```
6. create a `build` folder
7. add a `index.html` file in it
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Your title</title>
</head>
<body>
  <script src="./index.js"></script>
</body>
</html>
```
8. create a `src` folder
9. create your first component `checkBoxCompoent.js`

```javascript
const { html } = require('@forgjs/noframework');

html`<style>
.checkBox{
display: inline-flex;
padding: 3px;
justify-content: space-evenly;
}

.checkBox > .box{
width: 20px;
height: 20px;
background-color: #3B3A3B;
border-radius:20px;
position: relative;
margin-right:20px;
}

.checkBox > .box::after{
content: '';
width: 90%;
height: 90%;
background-color: white;
position: absolute;
border-radius:20px;
top:50%;
left:50%;
transform: translate(-50%, -50%);
transition: all 150ms ease-in-out;
}

.checkBox.on > .box::after{
width: 50%;
height: 50%;
background-color: #7D7C7D;
}
</style>
`;


const CheckBox = (value = true, label = '') => {
  let currentValue = value;
  const DomElement = html`
    <div class="checkBox ${value ? 'on' : ''}">
      <div class="box"></div>
      <div class="label">${label}</div>
    </div>
  `;

  DomElement.events.change = () => {};

  DomElement.statics.toggle = () => {
    DomElement.classList.toggle('on');
    currentValue = !currentValue;
  };


  DomElement.statics.getValue = () => currentValue;

  DomElement.addEventListener('click', () => {
    DomElement.statics.toggle();
    DomElement.events.change(currentValue);
  });


  return DomElement;
};

module.exports = CheckBox;
```

10. create the main file `index.js`

```javascript
const { $, html } = require('@forgjs/noframework');
const CheckBox = require('./checkBoxCompoent');

const checkBox = CheckBox(true, 'first component done');
const app = html`
  <div id="app">
    ${checkBox}
  </div>
`;

checkBox.events.change = (newValue) => {
  console.log(newValue);
};

$('body').appendChild(app);
```

11. Run `npm start watch` this will build your project on every change

Here is the folder structure you will end up having:

```
yourprojet/
|  build/
|  |  index.html
|  |  index.js
|  src/
|  |  checkBoxCompoent.js
|  |  index.js
|  package.json
```


Some tips:

- If you are using Visual Studio you should install the Live Server extension to be able to reload the page on every change, just open the `buil/index.html` file with it (press `Ctrl-Shift-P` and type `Open with Live Server`).
- Also you can install es6-string-html to get sytax coloration for the html in your javascript

## What's next

You can see the examples present in the `exemples` folder, then actually learn javascript without frameworks. And if you need more info just reed the code (its just one file im sure you can do that 👍)

Happy coding.
