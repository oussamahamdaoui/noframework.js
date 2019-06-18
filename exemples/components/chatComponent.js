const {
  html, $, KEYS: { enter }, smoothScrollTo,
} = require('../../src');


let l = true;
html`
<style>
  .chat{
    width:100%;
    height:600px;
    background-color:#121416;
    display:flex;
    flex-direction:column;
    padding-bottom:20px;
  }
  .chat > .messages {
    flex:1;
    overflow-y:auto;
  }

  .chat > .toolbar {
    width:90%;
    margin:auto;
    display:flex;
  }

  .chat > .toolbar > input {
    flex:1;
    outline:none;
    font-size:16px;
    padding-left:15px;
    background-color:#1F2224;
    color:white;
    border:none;
    height:50px;
    border-radius:3px;
  }
  .chat > .toolbar > .media {
    width:60px;
  }

  .messages .message {
    width:100%;
    display:flex;
    padding:25px;
    align-items:center;
  }

  .messages .message.me {
    flex-direction:row-reverse;
  }
  .messages .userImage {
    width:50px;
    height:50px;
    background-color:blue;
    border-radius:50px;
    margin-left:25px;
    margin-right:25px;
    background-position:center;
    background-size:cover;
  }

  .messages .text {
    background-color:#1A1D1F;
    padding:20px;
    min-width:100px;
    color:white;
    border-radius:8px;
  }

  .messages .data {
    display:flex;
    align-items:center;
    flex-direction:column;
    font-size:12px;
  }

  .messages .time {
    margin-top:5px;
    color:white;
  }
 
</style>
`;

const Message = (text, time, lr, image) => {
  const DomElement = html`
  <div class="message ${lr}">
    <div class="data">
      <div class="userImage" style="background-image:url(${image})"></div>
      <div class="time">${time}</div>
    </div>
    <div class="text">${text}</div>
  </div>`;
  return DomElement;
};

const ChatComponent = (messagesList = []) => {
  const DomElement = html`
    <div class="chat">
      <div class="messages">
      </div>
      <div class="toolbar">
        <input type="text" class="text" placeholder="Type message here...">
      </div>
    </div>
  `;
  const messages = $('.messages', DomElement);
  messagesList.forEach(message => DomElement.statics.addMessage(message));

  DomElement.statics.addMessage = ({
    me, date = new Date(), image, name, text,
  }) => {
    const time = `${date.getHours()}:${date.getMinutes()}`;
    messages.appendChild(Message(
      text,
      time,
      me ? 'me' : '',
      image,
      name,
    ));
  };


  $('.text', DomElement).addEventListener('keypress', enter((e) => {
    const now = new Date();
    DomElement.statics.addMessage({
      me: l, date: now, image: l ? 'https://randomuser.me/api/portraits/women/7.jpg' : 'https://randomuser.me/api/portraits/men/3.jpg', text: e.target.value,
    });

    e.target.value = '';
    smoothScrollTo(messages, messages.scrollHeight, 200);
    l = !l;
  }));
  return DomElement;
};

module.exports = ChatComponent;
