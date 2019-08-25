const { html } = require('../../src');

const AudioMessage = (time, audio, image, lr) => {
  const DomElement = html`
  <div class="message ${lr}">
    <div class="data">
      <div class="userImage" style="background-image:url(${image})"><i class="icofont-ui-user"></i></div>
      <div class="time">${time}</div>
    </div>
    <div class="audio"></div>
  </div>`;

  return DomElement;
};

module.exports = AudioMessage;
