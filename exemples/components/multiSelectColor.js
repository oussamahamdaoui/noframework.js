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
