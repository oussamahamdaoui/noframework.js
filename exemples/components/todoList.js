const { html, $, KEYS: { enter } } = require('../../src');
const RadioContainer = require('./radioContainer');
const MultiSelectColor = require('./multiSelectColor');

html`
<style>
  .todoList{
    width:500px;
    margin:auto;
    border-radius:30px;
    padding-top:30px;
    padding-bottom:30px;
  }

  .todoList .toHide.hidden {
    display:none;
  }

  .todoList .header {
    display:flex;
  }

  .todoList .header > .selectAll{
    padding-left:10px;
    padding-right:10px;
    background-color:#3B3A3B;
    border:none;
    color:white;
    outline:none;
  }

  .list{
    min-height:50px;
  }
  .todoList .todo-input{
    height:30px;
    outline:none;
    font-size:20px;
    padding:20px;
    border:none;
    flex:1;
    margin-left:15px;
  }
  .todo {
    padding-left:25px;
    padding-right:25px;
    padding-top:10px;
    padding-bottom:10px;
    display: flex;
    align-items:center;
  }



  .todo::before{
    height:15px;
    width:15px;
    content:'';
    border-radius:15px;
    display:inline-block;
    margin-right:15px;
  }

  .todo>input{
    margin-right:10px;
  }
  .todo.hidden{
    display:none;
  }

  .todoList > .filters{
    border-top:1px solid #7D7C7D;
    padding-top:30px;
  }

  .itemsLeft{
    padding-left:25px;
    margin-bottom:15px;
  }
</style>
`;

const ToDo = (label, value = 'to do') => {
  const DomElement = html`
  <div class="todo ${value === 'done' ? 'done' : ''}">
    <input type="checkbox" ${value === 'done' ? 'checked' : ''}><span class="label">${label}</span>
  </div>
  `;
  DomElement.statics.value = value;

  DomElement.statics.setValue = (val) => {
    DomElement.statics.value = val;
    if (val === 'done') {
      $('input', DomElement).checked = true;
      DomElement.classList.add('done');
    } else {
      $('input', DomElement).checked = false;
      DomElement.classList.remove('done');
    }
  };

  DomElement.statics.hide = () => {
    DomElement.classList.add('hidden');
  };

  DomElement.statics.show = () => {
    DomElement.classList.remove('hidden');
  };

  DomElement.statics.change = () => {};

  $('input', DomElement).addEventListener('change', (e) => {
    DomElement.statics.setValue(e.target.checked ? 'done' : 'to do');
    DomElement.statics.change(DomElement);
  });

  return DomElement;
};

const ToDoList = () => {
  const tasks = MultiSelectColor([
    { class: 'type1', label: 'Work' },
    { class: 'type2', label: 'Hobby' },
    { class: 'type3', label: 'Home' },
  ]);
  const filters = RadioContainer(['all', 'to do', 'done'], 0);
  filters.classList.add('filters');

  const DomElement = html`
    <div class="todoList">
      <div class="header">
        ${tasks}
        <input class="todo-input" placeholder="What needs to be done ...">
        <button class="selectAll">Select all</button>
      </div>
      <div class="toHide">
        <div class="list">
        </div>
        <div class="itemsLeft"></div>
        ${filters}
      </div>
    </div>
  `;


  let filter = filters.statics.value();


  filters.statics.change = (value) => {
    filter = value;
    DomElement.statics.filter(filter);
  };

  const applyFilter = (element) => {
    if (filter !== 'all' && element.statics.value !== filter) {
      element.statics.hide();
    } else {
      element.statics.show();
    }
  };

  const itemsLeft = () => {
    const todos = Array.from($('.list', DomElement).children);
    const left = todos.filter(e => e.statics.value === 'to do').length;
    $('.itemsLeft', DomElement).innerHTML = `${left} item${left > 1 ? 's' : ''} left`;
    todos.length === 0 && $('.toHide', DomElement).classList.add('hidden');
    todos.length !== 0 && $('.toHide', DomElement).classList.remove('hidden');
  };
  itemsLeft();

  DomElement.statics.selectAll = () => {
    Array.from($('.list', DomElement).children).forEach((todo) => {
      todo.statics.setValue('done');
      applyFilter(todo);
    });
    itemsLeft();
  };

  $('.selectAll', DomElement).addEventListener('click', DomElement.statics.selectAll);


  $('.todo-input', DomElement).addEventListener('keydown', enter((e) => {
    const todo = ToDo(e.target.value);
    todo.classList.add(tasks.statics.value.class);
    todo.statics.change = () => {
      applyFilter(todo);
      itemsLeft();
    };
    applyFilter(todo);
    $('.list', DomElement).appendChild(todo);
    itemsLeft();
    e.target.value = '';
  }));

  DomElement.statics.filter = () => {
    Array.from($('.list', DomElement).children).forEach(applyFilter);
  };


  return DomElement;
};

module.exports = ToDoList;
