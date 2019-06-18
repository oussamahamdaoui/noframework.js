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
