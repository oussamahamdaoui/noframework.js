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
