const { add} = require('frontend/src/testing/sample.js');

test('adds two numbers', () => {
  expect(add(2, 3)).toBe(5);
});