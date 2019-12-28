const {
  html, $, $$,
} = require('./index');


test('$$ selector', () => {
  const table = html`
    <table>
      <td></td>
    </table>
  `;

  expect($$('td', table).length).toBe(1);
});


test('$$ selector event listener', () => {
  const table = html`
    <table>
      <td></td>
      <td></td>
    </table>
  `;
  const evt = jest.fn();
  $$('td', table).addEventListener('click', evt);
  $('td', table).click();
  expect(evt).toBeCalled();
});


test('$ selector', () => {
  const table = html`
    <table>
      <td></td>
    </table>
  `;

  expect($('td', table).nodeName).toBe('TD');
});

test('html with table', () => {
  const table = html`
    <table>
      ${[1, 3, 4].map(e => html`<tr>
      <td>${e}</td>
      </tr>`)}
    </table>
  `;

  expect(table.children.length).toBe(3);
});

test('html with array', () => {
  const div = html`
    <div>
      ${[1, 3, 4]}
    </div>
  `;

  expect(div.children.length).toBe(0);
  expect(div.innerHTML.trim()).toBe('1,3,4');
});
