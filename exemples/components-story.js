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


const app = $('#app');
app.appendChild(StoryPage('Number Component', NumberComponent()));
app.appendChild(StoryPage('Radio', RadioComponent(false, 'Selected')));
app.appendChild(StoryPage('Radio Container', RadioContainer(['a', 'b', 'c'], 0)));
app.appendChild(StoryPage('Multy select colors', MultySelectColor(
  [
    { class: 'type1', label: 'Work' },
    { class: 'type2', label: 'Hobby' },
    { class: 'type3', label: 'Home' },

  ],
)));
app.appendChild(StoryPage('To Do list exemple', ToDoList()));
app.appendChild(StoryPage('Chat Component', ChatComponent()));
app.appendChild(StoryPage('Calendar', Calendar()));
app.appendChild(StoryPage('Circle Progress', ProgressCircle()));
