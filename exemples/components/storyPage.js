const { html } = require('../../src');

html`
 <style>
   .story-page{
     margin:20px;
     padding:20px;
   }
   .story-page > h1{
    margin-bottom:30px;
   }
  </style>
`;

const StoryPage = (title, element) => {
  const DomElement = html`
    <div class='story-page'>
      <h1>${title}</h1>
      ${element}
    </div>
  `;
  return DomElement;
};

module.exports = StoryPage;
