const { html } = require('../../src');

const Header = () => {
  const DomElement = html`
    <div class="Header">
      <div>noframework.js</div>
      <div><a href="https://github.com/oussamahamdaoui/noframework.js">See it on github</a></div>
    </div>
  `;

  return DomElement;
};

html`
<style>
  .Header {
    width:100%;
    position:relative;
    display:flex;
    background-color:#1F2325;
    height:70px;
    justify-content: space-between;
    position:sticky;
    top:0;
    z-index:99;
  }

  .Header > div {
    line-height:70px;
    margin-left:30px;
    margin-right:30px;
  }

  a {

  }
</style>
`;

module.exports = Header;
