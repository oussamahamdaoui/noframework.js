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
