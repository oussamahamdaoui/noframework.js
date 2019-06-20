const { html } = require('../../src');

const Range = () => {
  const DomElement = html`
    <div class="rangeComponent">
      <div class="circle start"></div>
      <div class="middle"></div>
      <div class="circle end"></div>
    </div>
  `;

  return DomElement;
};

html`
<style>
.rangeComponent{
  height:3px;
  background-color: #3B3A3B;
  position:relative;
}

.rangeComponent > .circle{
  height:30px;
  width: 30px;
  background-color:white;
  border:3px solid #3B3A3B;
  position:absolute;
  border-radius:100%;
  top:-13px;
}

</style>
`;

module.exports = Range;
