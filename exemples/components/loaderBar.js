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
