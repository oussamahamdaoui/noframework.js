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
