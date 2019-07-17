const { html } = require('../../src/index');

const Notification = (title, text, logo) => {
  const DomElement = html`
    <div class="notification">
      <h2>${title}</h2>
      <i class="${logo}"></i>
      <p>
        ${text}
      </p>
      </div>
  `;

  // setTimeout(() => {
  //   DomElement.parentElement.removeChild(DomElement);
  // }, 1000);

  return DomElement;
};

html`
<style>
.notification{
  position:fixed;
  top:0px;
  right:0px;
  width:280px;
  background-color:white;
  z-index:1000;
  height:110px;
}
</style>
`;

module.exports = Notification;
