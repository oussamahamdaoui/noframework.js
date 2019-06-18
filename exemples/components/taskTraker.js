const { html, $ } = require('../../src');
const Calendar = require('./calendar');
const ProgressCircle = require('./progressCircle');

const Task = (name, endDate, goal, points = 0, unit) => {
  const progress = ProgressCircle(100, 4, undefined, points / goal * 100, 0);
  const timeLeft = endDate - new Date();

  const DomElement = html`
    <div class="task">
      <div class="timeLeft">time left: ${timeLeft / 1000 / 60 / 60 / 24} days</div>
      ${progress}
      <div class="calculator"></div>
    </div>
  `;

  DomElement.statics.goal = goal;
  DomElement.statics.currentPoints = points;
  DomElement.statics.endDate = endDate;
  DomElement.statics.name = name;
  DomElement.statics.unit = unit;


  DomElement.statics.updatePoints = (value) => {
    DomElement.statics.points = value;
  };

  DomElement.statics.updateTime = () => {

  };

  return DomElement;
};

const TaskTraker = () => {
  const calendar = Calendar();
  const DomElement = html`
    <div class="taskTraker">
      <div class="header">
        <input type="text" class="name" placeholder="Title">
        <input type="text" class="goal">
        <input type="text" class="unit">
        ${calendar}
        <button>Submit</button>
      </div>

      <div class="tasks">
      </div>
    </div>
  `;
  const name = $('.header > .name', DomElement);
  const goal = $('.header > .goal', DomElement);
  const unit = $('.header > .unit', DomElement);


  $('.header > button', DomElement).addEventListener('click', () => {
    $('.tasks', DomElement).appendChild(Task(name.value, calendar.statics.currentDate, goal.value, 0, unit.value));
  });
  $('.tasks', DomElement).appendChild(Task('test', new Date(201), 500, 50, '€'));


  return DomElement;
};

html`
  <style>
    .taskTraker >.header{
      display:flex;
      flex-direction:column;
    }
  </style>
`;

module.exports = TaskTraker;
