const { getPath, setPath, apply } = require('./index');

test('accessPath works fine', () => {
  const path = 'b.c';
  const obj = {
    b: {
      c: 3,
    },
  };

  setPath(obj, path, 5);
  expect(getPath(obj, path)).toBe(5);
});


test('accessPath works fine', () => {
  const path = 'b.c';
  const obj = {
    b: {
      c: 3,
    },
  };

  setPath(obj, path, 5);
  expect(getPath(obj, path)).toBe(5);
});


test('accessPath works fine', () => {
  const obj = {
    b: {
      c: 3,
    },
    f: 5,
    setF(val) {
      obj.f = val;
    },
  };

  apply(obj, {
    'b.c': 3,
    setF: [8],
  });
  expect(obj.f).toBe(8);
  expect(obj.b.c).toBe(3);
});
