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
