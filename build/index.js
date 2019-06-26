(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { $ } = require('../src/index');
const StoryPage = require('./components/storyPage');

const NumberComponent = require('./components/componentNumber');
const RadioComponent = require('./components/componentRadio');
const RadioContainer = require('./components/radioContainer');
const ToDoList = require('./components/todoList');
const MultySelectColor = require('./components/multiSelectColor');
const ChatComponent = require('./components/chatComponent');
const Calendar = require('./components/calendar');
const ProgressCircle = require('./components/progressCircle');
const LoaderBar = require('./components/loaderBar');
const Header = require('./components/header');


const app = $('#app');
app.appendChild(Header());
app.appendChild(StoryPage('Number Component - click to choose your number', NumberComponent()));
app.appendChild(StoryPage('Radio', RadioComponent(false, 'Selected')));
app.appendChild(StoryPage('Radio Container', RadioContainer(['a', 'b', 'c'], 0)));
app.appendChild(StoryPage('Multy select colors - click on the circle', MultySelectColor(
  [
    { class: 'type1', label: 'Work' },
    { class: 'type2', label: 'Hobby' },
    { class: 'type3', label: 'Home' },

  ],
)));
app.appendChild(StoryPage('To Do list exemple', ToDoList()));
app.appendChild(StoryPage('Chat Component - type anything and see what happens', ChatComponent()));
app.appendChild(StoryPage('Calendar', Calendar()));
app.appendChild(StoryPage('Circle Progress', ProgressCircle()));
app.appendChild(StoryPage('Loader Bar - click on the bar to see the animation', LoaderBar(76)));

},{"../src/index":14,"./components/calendar":3,"./components/chatComponent":4,"./components/componentNumber":5,"./components/componentRadio":6,"./components/header":7,"./components/loaderBar":8,"./components/multiSelectColor":9,"./components/progressCircle":10,"./components/radioContainer":11,"./components/storyPage":12,"./components/todoList":13}],2:[function(require,module,exports){
const { html } = require('../../src');

const AudioMessage = (time, audio, image, lr) => {
  const DomElement = html`
  <div class="message ${lr}">
    <div class="data">
      <div class="userImage" style="background-image:url(${image})"><i class="icofont-ui-user"></i></div>
      <div class="time">${time}</div>
    </div>
    <div class="audio"></div>
  </div>`;

  return DomElement;
};

module.exports = AudioMessage;

},{"../../src":14}],3:[function(require,module,exports){
const {
  html, $, DATE: {
    sameDay,
    getDaysInMonth,
  },
} = require('../../src/index');


const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


const Day = (date) => {
  const DomElement = html`<div class="day">${date.getDate()}</div>`;
  DomElement.statics.click = () => {};
  DomElement.addEventListener('click', () => {
    DomElement.statics.click(DomElement, date);
  });
  return DomElement;
};

const Calendar = () => {
  const DomElement = html`
  <div class="calendar">
    <div class="header">
      <div class="prev"><i class="icofont-rounded-left"></i></div>
      <div class="currentDate"></div>
      <div class="next"><i class="icofont-rounded-right"></i></div>
    </div>
    <div class="weekdays">
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
    </div>
    <div class="days"></div>
  </div>
  `;
  DomElement.statics.currentDate = new Date();
  DomElement.statics.change = () => {};

  DomElement.statics.setDays = (date) => {
    const { currentDate } = DomElement.statics;
    const now = new Date();
    getDaysInMonth(date).forEach((day) => {
      const DayElement = Day(day);
      if (day.getDate() === 1) {
        const padding = day.getDay();
        DayElement.style.marginLeft = `calc(100% / 7 * ${padding})`;
        DayElement.classList.add('selected');
        DomElement.statics.currentDate = day;
      }
      if (sameDay(day, now)) {
        DayElement.classList.add('today');
      }
      DayElement.statics.click = (clicked) => {
        $('.day.selected', DomElement).classList.remove('selected');
        clicked.classList.add('selected');
        DomElement.statics.currentDate = day;
        DomElement.statics.change(day);
      };
      $('.days', DomElement).appendChild(DayElement);
    });

    $('.currentDate', DomElement).innerHTML = `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  DomElement.statics.setDays();

  $('.next', DomElement).addEventListener('click', () => {
    $('.days', DomElement).innerHTML = '';
    DomElement.statics.currentDate.setMonth(DomElement.statics.currentDate.getMonth() + 1);
    DomElement.statics.setDays(DomElement.statics.currentDate);
  });

  $('.prev', DomElement).addEventListener('click', () => {
    $('.days', DomElement).innerHTML = '';
    DomElement.statics.currentDate.setMonth(DomElement.statics.currentDate.getMonth() - 1);
    DomElement.statics.setDays(DomElement.statics.currentDate);
  });

  return DomElement;
};

html`
<style>
  .calendar {
    width:280px;
    box-shadow: 0 1px 3px rgba(0,0,0,1), 0 1px 2px rgba(0,0,0,1);
    padding:15px;
    border-radius:3px;
    background-color:white;
    color:#121416;
  }
  .calendar .header{
    display:flex;
    border-bottom:1px solid #C3C2C8;
    margin-bottom:2px;
  }

  .calendar .header>.currentDate {
    flex:1;
    text-align:center;
    padding-bottom:5px;
  }

  .calendar .weekdays {
    display:flex;
    width:100%;
    align-items:center;
  }
  .calendar .days {
    display: flex;
    flex-wrap:wrap;
  }
  .calendar .day {
    width: calc(100% / 7);
    text-align: center;
    line-height: 18px;
    height: 18px;
    font-size: 12px;
    cursor: pointer;
  }

  .calendar .day.today {
    color: #1629FF;
  }

  .calendar .day.selected {
    color:red;
  } 

  .calendar .weekdays>div {
    width: calc(100% / 7);
    text-align: center;
    font-size: 12px;
    color:#C3C2C8;
  }

</style>
`;

module.exports = Calendar;

},{"../../src/index":14}],4:[function(require,module,exports){
const {
  html, $, KEYS: { enter }, smoothScrollTo,
} = require('../../src');

const AudioMessage = require('./audio');

let l = true;
html`
<style>
  .chat{
    width:100%;
    height:600px;
    background-color:#121416;
    display:flex;
    flex-direction:column;
    padding-bottom:20px;
  }
  .chat > .messages {
    flex:1;
    overflow-y:auto;
  }

  .chat > .toolbar {
    width:90%;
    margin:auto;
    display:flex;
  }

  .chat > .toolbar > input {
    flex:1;
    outline:none;
    font-size:16px;
    padding-left:15px;
    background-color:#1F2224;
    color:white;
    border:none;
    height:50px;
    border-radius:3px;
  }
  .chat > .toolbar > .media {
    width:60px;
  }

  .messages .message {
    width:100%;
    display:flex;
    padding:25px;
    align-items:center;
  }

  .messages .message.me {
    flex-direction:row-reverse;
  }
  .messages .userImage {
    width:50px;
    height:50px;
    border-radius:50px;
    margin-left:25px;
    margin-right:25px;
    background-position:center;
    background-size:cover;
    text-align:center;
    background-color:#1F2325;
    line-height:50px;
    font-size:20px;
  }

  .messages .text {
    background-color:#1A1D1F;
    padding:20px;
    min-width:100px;
    color:white;
    border-radius:8px;
  }

  .messages .data {
    display:flex;
    align-items:center;
    flex-direction:column;
    font-size:12px;
  }

  .messages .time {
    margin-top:5px;
    color:white;
  }
 
</style>
`;

const Message = (text, time, lr, image) => {
  const DomElement = html`
  <div class="message ${lr}">
    <div class="data">
      <div class="userImage" style="background-image:url(${image})"><i class="icofont-ui-user"></i></div>
      <div class="time">${time}</div>
    </div>
    <div class="text">${text}</div>
  </div>`;
  return DomElement;
};

const ChatComponent = (messagesList = []) => {
  const DomElement = html`
    <div class="chat">
      <div class="messages">
        ${AudioMessage()}
      </div>
      <div class="toolbar">
        <input type="text" class="text" placeholder="Type message here...">
      </div>
    </div>
  `;
  const messages = $('.messages', DomElement);
  messagesList.forEach(message => DomElement.statics.addMessage(message));

  DomElement.statics.addMessage = ({
    me, date = new Date(), image, name, text,
  }) => {
    const time = `${date.getHours()}:${date.getMinutes()}`;
    messages.appendChild(Message(
      text,
      time,
      me ? 'me' : '',
      image,
      name,
    ));
  };


  $('.text', DomElement).addEventListener('keypress', enter((e) => {
    const now = new Date();
    DomElement.statics.addMessage({
      me: l, date: now, image: l ? 'https://randomuser.me/api/portraits/women/7.jpg' : 'https://randomuser.me/api/portraits/men/3.jpg', text: e.target.value,
    });

    e.target.value = '';
    smoothScrollTo(messages, messages.scrollHeight, 200);
    l = !l;
  }));
  return DomElement;
};

module.exports = ChatComponent;

},{"../../src":14,"./audio":2}],5:[function(require,module,exports){
const { html, $ } = require('../../src');

html`
<style>
.numberComponent{
  display: inline-flex;
  background-color: #3B3A3B;
  width: 130px;
  height: 50px;
  border-radius:15px;
  padding: 3px;
  outline: none;
  transition: transform 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  user-select: none;
}

.numberComponent:active {
  transform: scale(0.94);
}

.numberComponent:active.animate-left > .current{
  transform: translateX(-10%);
}

.numberComponent:active.animate-right  > .current{
  transform: translateX(10%);
}

.numberComponent > div {
  flex: 1;
  text-align: center;
  line-height: 50px;
  font-weight: 900;
  color: #7D7C7D;
  font-size: 20px;
  transition: transform 100ms cubic-bezier(0.68, -0.55, 0.265, 1.55);;
  outline: none;
}

.numberComponent > .current {
  flex: 1;
  font-size: 25px;
  color:white;
  font-weight: 900;
  background-color: #3B3A3B;
  border-radius:100%; 
}
</style>
`;

const NumberComponent = (
  min = 0, max = 10, value = 1, step = 1,
) => {
  let currentValue = value;
  const DomElement = html`
    <div class="numberComponent" tabindex="0">
      <div class="prev" tabindex="0"></div>
      <div class="current"></div>
      <div class="next" tabindex="0"></div>
    </div>
  `;
  // init values
  $('.prev', DomElement).innerHTML = value - step > min ? value - step : min;
  $('.current', DomElement).innerHTML = value;
  $('.next', DomElement).innerHTML = value + step < max ? value + step : max;

  DomElement.statics.next = () => {
    if (currentValue + step < max) {
      DomElement.classList.toggle('animate-right');
      $('.prev', DomElement).innerHTML = currentValue;
      currentValue += step;
      $('.current', DomElement).innerHTML = currentValue;
      $('.next', DomElement).innerHTML = currentValue + step;
    }
  };

  DomElement.statics.prev = () => {
    if (currentValue - step > min) {
      DomElement.classList.toggle('animate-left');
      $('.next', DomElement).innerHTML = currentValue;
      currentValue -= step;
      $('.current', DomElement).innerHTML = currentValue;
      $('.prev', DomElement).innerHTML = currentValue - step;
    }
  };

  $('.next', DomElement).addEventListener('mousedown', DomElement.statics.next);
  $('.prev', DomElement).addEventListener('mousedown', DomElement.statics.prev);

  DomElement.addEventListener('mouseup', () => {
    DomElement.classList.remove('animate-left');
    DomElement.classList.remove('animate-right');
  });


  return DomElement;
};

module.exports = NumberComponent;

},{"../../src":14}],6:[function(require,module,exports){
const { html } = require('../../src');

html`<style>
.radioComponent{
display: inline-flex;
width: 130px;
padding: 3px;
justify-content: space-evenly;
}

.radioComponent > .radio{
width: 20px;
height: 20px;
background-color: #3B3A3B;
border-radius:20px;
position: relative;
}

.radioComponent > .radio::after{
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

.radioComponent.on > .radio::after{
width: 50%;
height: 50%;
background-color: #7D7C7D;
}
</style>
`;


const RadioComponent = (value = true, label = '') => {
  let currentValue = value;

  const DomElement = html`
    <div class="radioComponent">
      <div class="radio"></div>
      <div class="label">${label}</div>
    </div>
  `;

  if (value) {
    DomElement.classList.add('on');
  }

  DomElement.statics.on = () => {
    DomElement.classList.add('on');
    currentValue = true;
  };

  DomElement.statics.off = () => {
    DomElement.classList.remove('on');
    currentValue = false;
  };

  DomElement.statics.getValue = () => currentValue;

  DomElement.addEventListener('click', () => {
    DomElement.statics.on();
    DomElement.selected && DomElement.selected(label);
  });


  return DomElement;
};

module.exports = RadioComponent;

},{"../../src":14}],7:[function(require,module,exports){
const { html } = require('../../src');

const Header = () => {
  const DomElement = html`
    <div class="Header">
      <div>noframework.js</div>
      <div><a href="https://github.com/oussamahamdaoui/noframework.js">See it on github</a></div>
    </div>
  `;

  return DomElement;
};

html`
<style>
  .Header {
    width:100%;
    position:relative;
    display:flex;
    background-color:#1F2325;
    height:70px;
    justify-content: space-between;
    position:sticky;
    top:0;
    z-index:99;
  }

  .Header > div {
    line-height:70px;
    margin-left:30px;
    margin-right:30px;
  }

  a {

  }
</style>
`;

module.exports = Header;

},{"../../src":14}],8:[function(require,module,exports){
const {
  html, $, startAnimation,
} = require('../../src');


const LoaderBar = (percent) => {
  const DomElement = html`
  <div class="loader">
    <div class="loaderBar">
      <div class="bar-percent" style="width:${percent}%"></div>
    </div>
    <div class="label">${percent}%</div>
  </div>
  `;
  DomElement.statics.percent = percent;
  DomElement.events.cahnge = () => {};

  $('.loaderBar', DomElement).addEventListener('click', (e) => {
    DomElement.statics.setPersent((e.layerX / $('.loaderBar', DomElement).clientWidth) * 100);
  });

  DomElement.statics.setPersent = (p) => {
    DomElement.statics.percent = p;
    $('.bar-percent', DomElement).style.width = `${p}%`;

    startAnimation(
      parseInt($('.label', DomElement).innerHTML, 10),
      p,
      200,
      (x) => {
        $('.label', DomElement).innerHTML = `${parseInt(x, 10)}%`;
      },
    );

    DomElement.events.cahnge(p);
  };

  return DomElement;
};


html`
<style>
.loaderBar{
  height:10px;
  background-color:#3B3A3B;
  border-radius:10px;
  position:relative;
  overflow:hidden;
}
.loaderBar > .bar-percent {
  position:absolute;
  left:0px;
  top:0px;
  background-color:#7D7C7D;
  height:10px;
  border-radius:10px;
  transition: width 200ms ease-in-out;
}

.loader > .label {
  text-align:center;
}


</style>
`;

module.exports = LoaderBar;

},{"../../src":14}],9:[function(require,module,exports){
const { html, $ } = require('../../src');

html`
<style>
.multiSelectColor {
  display:inline-flex;
  align-items:center;
  width:25px;
  overflow:hidden;
  transition: max-width 200ms ease-in-out;
  max-width:25px;
}

.multiSelectColor.open {
  width:auto;
  max-width:600px;
}

.type1::before{
  background-color:#3498db;
}
.type2::before{
  background-color:#e74c3c;
}
.type3::before{
  background-color:#f1c40f;
}
.type4::before{
  background-color:#e67e22;
}


.multiSelectColor > .items {
  display:inline-flex;
}
.multiSelectColor > .items > div{
  display:inline-flex;
  position:relative;
  align-items:center;
  margin-right:5px;
  margin-left:5px;

}

.multiSelectColor > .items > div::before {
  content:'';
  position:relative;
  width:15px;
  height:15px;
  border-radius:15px;
  margin-right:5px;
}

</style>
`;


const MultiSelectColor = (values = []) => {
  const DomElement = html`
    <div class="multiSelectColor">
    <div class="items">
      <div class="selected type1"></div>
    </div>
    </div>
  `;

  [DomElement.statics.value] = values;
  DomElement.statics.change = () => {};

  DomElement.addEventListener('click', () => {
    DomElement.classList.toggle('open');
  });

  values.forEach((value) => {
    const valueItem = html`<div class="${value.class}">${value.label}</div>`;
    $('.items', DomElement).appendChild(valueItem);
    valueItem.addEventListener('click', () => {
      DomElement.statics.value = value;
      $('.selected', DomElement).className = `selected ${value.class}`;
      DomElement.statics.change(DomElement.statics.value);
    });
  });

  return DomElement;
};

module.exports = MultiSelectColor;

},{"../../src":14}],10:[function(require,module,exports){
const { html, $ } = require('../../src');

const ProgressCircle = (radius = 60, stroke = 4, color = '#7D7C7D', startPercent = 80) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const DomElement = html`
  <div class="ProgressCircle">
  <div class="percent">${startPercent}%</div>
  <svg class="progress-ring" height="${radius * 2}" width="${radius * 2}">
  <circle
    class="progress-ring__circle"
    stroke-width="${stroke}"
    stroke="${color}"
    fill="transparent"
    stroke-dasharray=" ${circumference} ${circumference} "
    style="stroke-dashoffset:${circumference}"
    r="${normalizedRadius}"
    cx="${radius}"
    cy="${radius}"
  />
</svg>
</div>`;

  DomElement.statics.percent = startPercent;
  DomElement.statics.setProgress = (percent) => {
    DomElement.statics.percent = percent;
    $('.percent', DomElement).innerHTML = `${percent}%`;
    const offset = circumference - (percent / 100 * circumference);
    const circle = $('circle', DomElement);
    circle.style.strokeDashoffset = offset;
  };

  DomElement.statics.setProgress(startPercent);

  return DomElement;
};

html`
<style>
.percent{
  position:absolute;
  top:50%;
  color:#7D7C7D;
  left:50%;
  transform:translate(-50%, -50%);
}
.ProgressCircle{
  display:inline-block;
  position:relative;
}
.progress-ring > circle {
  transition: stroke-dashoffset 200ms;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>
`;

module.exports = ProgressCircle;

},{"../../src":14}],11:[function(require,module,exports){
const { html } = require('../../src');
const RadioComponent = require('./componentRadio');

html`
<style>
  .radioContainer {
    display:flex;
    justify-content:space-between;
  }
</style>
`;

const RadioContainer = (labels, selectedIndex) => {
  const DomElement = html`
    <div class="radioContainer">
    </div>
  `;
  let currentValue = labels[selectedIndex];

  labels.forEach((label, index) => {
    const radio = RadioComponent(index === selectedIndex, label);
    DomElement.appendChild(radio);
    radio.selected = (value) => {
      currentValue = value;
      Array.from(DomElement.children).filter(e => e !== radio).forEach(e => e.statics.off());
      DomElement.statics.change(currentValue);
    };
  });

  DomElement.statics.change = () => {};

  DomElement.statics.value = () => currentValue;

  return DomElement;
};

module.exports = RadioContainer;

},{"../../src":14,"./componentRadio":6}],12:[function(require,module,exports){
const { html } = require('../../src');

html`
 <style>
   .story-page{
     margin:20px;
     padding:20px;
   }
   .story-page > h1{
    margin-bottom:30px;
   }
  </style>
`;

const StoryPage = (title, element) => {
  const DomElement = html`
    <div class='story-page'>
      <h1>${title}</h1>
      ${element}
    </div>
  `;
  return DomElement;
};

module.exports = StoryPage;

},{"../../src":14}],13:[function(require,module,exports){
const { html, $, KEYS: { enter } } = require('../../src');
const RadioContainer = require('./radioContainer');
const MultiSelectColor = require('./multiSelectColor');

html`
<style>
  .todoList{
    width:500px;
    margin:auto;
    border-radius:30px;
    padding-top:30px;
    padding-bottom:30px;
  }

  .todoList .toHide.hidden {
    display:none;
  }

  .todoList .header {
    display:flex;
  }

  .todoList .header > .selectAll{
    padding-left:10px;
    padding-right:10px;
    background-color:#3B3A3B;
    border:none;
    color:white;
    outline:none;
  }

  .list{
    min-height:50px;
  }
  .todoList .todo-input{
    height:30px;
    outline:none;
    font-size:20px;
    padding:20px;
    border:none;
    flex:1;
    margin-left:15px;
  }
  .todo {
    padding-left:25px;
    padding-right:25px;
    padding-top:10px;
    padding-bottom:10px;
    display: flex;
    align-items:center;
  }



  .todo::before{
    height:15px;
    width:15px;
    content:'';
    border-radius:15px;
    display:inline-block;
    margin-right:15px;
  }

  .todo>input{
    margin-right:10px;
  }
  .todo.hidden{
    display:none;
  }

  .todoList > .filters{
    border-top:1px solid #7D7C7D;
    padding-top:30px;
  }

  .itemsLeft{
    padding-left:25px;
    margin-bottom:15px;
  }
</style>
`;

const ToDo = (label, value = 'to do') => {
  const DomElement = html`
  <div class="todo ${value === 'done' ? 'done' : ''}">
    <input type="checkbox" ${value === 'done' ? 'checked' : ''}><span class="label">${label}</span>
  </div>
  `;
  DomElement.statics.value = value;

  DomElement.statics.setValue = (val) => {
    DomElement.statics.value = val;
    if (val === 'done') {
      $('input', DomElement).checked = true;
      DomElement.classList.add('done');
    } else {
      $('input', DomElement).checked = false;
      DomElement.classList.remove('done');
    }
  };

  DomElement.statics.hide = () => {
    DomElement.classList.add('hidden');
  };

  DomElement.statics.show = () => {
    DomElement.classList.remove('hidden');
  };

  DomElement.statics.change = () => {};

  $('input', DomElement).addEventListener('change', (e) => {
    DomElement.statics.setValue(e.target.checked ? 'done' : 'to do');
    DomElement.statics.change(DomElement);
  });

  return DomElement;
};

const ToDoList = () => {
  const tasks = MultiSelectColor([
    { class: 'type1', label: 'Work' },
    { class: 'type2', label: 'Hobby' },
    { class: 'type3', label: 'Home' },
  ]);
  const filters = RadioContainer(['all', 'to do', 'done'], 0);
  filters.classList.add('filters');

  const DomElement = html`
    <div class="todoList">
      <div class="header">
        ${tasks}
        <input class="todo-input" placeholder="What needs to be done ...">
        <button class="selectAll">Select all</button>
      </div>
      <div class="toHide">
        <div class="list">
        </div>
        <div class="itemsLeft"></div>
        ${filters}
      </div>
    </div>
  `;


  let filter = filters.statics.value();


  filters.statics.change = (value) => {
    filter = value;
    DomElement.statics.filter(filter);
  };

  const applyFilter = (element) => {
    if (filter !== 'all' && element.statics.value !== filter) {
      element.statics.hide();
    } else {
      element.statics.show();
    }
  };

  const itemsLeft = () => {
    const todos = Array.from($('.list', DomElement).children);
    const left = todos.filter(e => e.statics.value === 'to do').length;
    $('.itemsLeft', DomElement).innerHTML = `${left} item${left > 1 ? 's' : ''} left`;
    todos.length === 0 && $('.toHide', DomElement).classList.add('hidden');
    todos.length !== 0 && $('.toHide', DomElement).classList.remove('hidden');
  };
  itemsLeft();

  DomElement.statics.selectAll = () => {
    Array.from($('.list', DomElement).children).forEach((todo) => {
      todo.statics.setValue('done');
      applyFilter(todo);
    });
    itemsLeft();
  };

  $('.selectAll', DomElement).addEventListener('click', DomElement.statics.selectAll);


  $('.todo-input', DomElement).addEventListener('keydown', enter((e) => {
    const todo = ToDo(e.target.value);
    todo.classList.add(tasks.statics.value.class);
    todo.statics.change = () => {
      applyFilter(todo);
      itemsLeft();
    };
    applyFilter(todo);
    $('.list', DomElement).appendChild(todo);
    itemsLeft();
    e.target.value = '';
  }));

  DomElement.statics.filter = () => {
    Array.from($('.list', DomElement).children).forEach(applyFilter);
  };


  return DomElement;
};

module.exports = ToDoList;

},{"../../src":14,"./multiSelectColor":9,"./radioContainer":11}],14:[function(require,module,exports){
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
    ret.forEach(e => e.addEventListener(params));
  };
  return ret;
};


// templating

/**
 *
 * @param {String} text
 *
 * @return {Node}
 */
const html = (text, ...stuff) => {
  let ht = '';
  text.forEach((part, index) => {
    if (!(stuff[index] instanceof Node)) {
      ht += stuff[index] ? part + stuff[index] : part;
    } else {
      ht += stuff[index] ? `${part}<temp temp-id='${index}'></temp>` : part;
    }
  });
  const template = document.createElement('template');
  template.innerHTML = ht.trim();
  const style = $('style', template.content);
  if (style) {
    html.style.textContent += style.textContent.trim();
  }
  const ret = template.content.firstChild;
  ret.statics = {};
  ret.events = {};
  $$('temp', ret).forEach((e) => {
    const id = parseInt(e.getAttribute('temp-id'), 10);
    const target = stuff[id];
    e.parentNode.replaceChild(target, e);
  });
  return ret;
};

html.style = document.createElement('style');
document.head.appendChild(html.style);

// EventManager

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
};

},{}]},{},[1]);
