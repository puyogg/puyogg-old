import Puyo, { Color, COLOR_CODE, COLOR_NAME } from '../src/puyo';

describe('Puyo.ts: Puyo.getName()', () => {
  test.each([
    [Color.NONE, 'none'],
    [Color.RED, 'red'],
    [Color.GREEN, 'green'],
    [Color.BLUE, 'blue'],
    [Color.YELLOW, 'yellow'],
    [Color.PURPLE, 'purple'],
    [Color.GARBAGE, 'garbage'],
    [Color.HARD, 'hard'],
    [Color.STONE, 'stone'],
    [Color.BLOCK, 'block'],
  ])('Int code %i is %s', (int, name) => {
    expect(new Puyo(int, 0, 0).getName()).toBe(name);
  });
});

describe('Puyo.ts: Puyo.getChar()', () => {
  test.each([
    [Color.NONE, '0'],
    [Color.RED, 'R'],
    [Color.GREEN, 'G'],
    [Color.BLUE, 'B'],
    [Color.YELLOW, 'Y'],
    [Color.PURPLE, 'P'],
    [Color.GARBAGE, 'J'],
    [Color.HARD, 'H'],
    [Color.STONE, 'S'],
    [Color.BLOCK, 'L'],
  ])('Int code %i is %s', (int, name) => {
    expect(new Puyo(int, 0, 0).getChar()).toBe(name);
  });
});

describe('Puyo.ts: Puyo.isColored()', () => {
  test.each`
    int              | name                         | bool
    ${Color.NONE}    | ${COLOR_NAME[Color.NONE]}    | ${false}
    ${Color.RED}     | ${COLOR_NAME[Color.RED]}     | ${true}
    ${Color.GREEN}   | ${COLOR_NAME[Color.GREEN]}   | ${true}
    ${Color.BLUE}    | ${COLOR_NAME[Color.BLUE]}    | ${true}
    ${Color.YELLOW}  | ${COLOR_NAME[Color.YELLOW]}  | ${true}
    ${Color.PURPLE}  | ${COLOR_NAME[Color.PURPLE]}  | ${true}
    ${Color.GARBAGE} | ${COLOR_NAME[Color.GARBAGE]} | ${false}
    ${Color.HARD}    | ${COLOR_NAME[Color.HARD]}    | ${false}
    ${Color.STONE}   | ${COLOR_NAME[Color.STONE]}   | ${false}
    ${Color.BLOCK}   | ${COLOR_NAME[Color.BLOCK]}   | ${false}
  `('Is a $name Puyo colored? $bool', ({ int, bool }) => {
    expect(new Puyo(int, 0, 0).isColored()).toBe(bool);
  });
});

describe('Puyo.ts: Puyo.isGarbage()', () => {
  test.each`
    int              | name                         | bool
    ${Color.NONE}    | ${COLOR_NAME[Color.NONE]}    | ${false}
    ${Color.RED}     | ${COLOR_NAME[Color.RED]}     | ${false}
    ${Color.GREEN}   | ${COLOR_NAME[Color.GREEN]}   | ${false}
    ${Color.BLUE}    | ${COLOR_NAME[Color.BLUE]}    | ${false}
    ${Color.YELLOW}  | ${COLOR_NAME[Color.YELLOW]}  | ${false}
    ${Color.PURPLE}  | ${COLOR_NAME[Color.PURPLE]}  | ${false}
    ${Color.GARBAGE} | ${COLOR_NAME[Color.GARBAGE]} | ${true}
    ${Color.HARD}    | ${COLOR_NAME[Color.HARD]}    | ${true}
    ${Color.STONE}   | ${COLOR_NAME[Color.STONE]}   | ${false}
    ${Color.BLOCK}   | ${COLOR_NAME[Color.BLOCK]}   | ${false}
  `('Is a $name Puyo garbage? $bool', ({ int, bool }) => {
    expect(new Puyo(int, 0, 0).isGarbage()).toBe(bool);
  });
});
