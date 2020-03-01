import Puyo, { Color, COLOR_CODE, COLOR_NAME } from '../src/puyo';

const puyo = new Puyo(Color.RED, 3, 4);

test('Make a Red Puyo for cell {x: 3, y:4}', () => {
  expect(puyo).toEqual(new Puyo(Color.RED, 3, 4));
});

test("The name of the Red Puyo should be 'red'", () => {
  expect(puyo.getColorName()).toBe('red');
});

test("The char code of the Red Puyo should be 'R'", () => {
  expect(puyo.getColorCode()).toBe('R');
});
