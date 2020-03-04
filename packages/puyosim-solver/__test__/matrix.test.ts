import { initPrimitiveMatrix, charToPuyoMatrix, puyoToCharMatrix, transposeMatrix } from '../src/matrix';

const testZeroMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const testTrueMatrix = [
  [true, true, true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true, true, true, true, true, true],
];

const testCharMatrix = [
  ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'G', 'G', 'G', 'R'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'R', 'G', 'R'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 'B', 'R', 'B'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'J', 'Y', 'B', 'B'],
  ['0', '0', '0', '0', '0', '0', '0', '0', '0', 'H', 'R', 'Y', 'Y'],
  ['0', '0', '0', '0', '0', '0', '0', '0', 'J', 'R', 'R', 'Y', 'R'],
];

const testTransposedCharMatrix = [
  ['0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', '0'],
  ['0', '0', '0', '0', '0', 'J'],
  ['G', '0', '0', 'J', 'H', 'R'],
  ['G', 'R', 'B', 'Y', 'R', 'R'],
  ['G', 'G', 'R', 'B', 'Y', 'Y'],
  ['R', 'R', 'B', 'B', 'Y', 'R'],
];

const testPuyoMatrix = charToPuyoMatrix(testCharMatrix);

const testTransposedPuyoMatrix = charToPuyoMatrix(testTransposedCharMatrix);
for (let x = 0; x < testTransposedPuyoMatrix.length; x++) {
  for (let y = 0; y < testTransposedPuyoMatrix[0].length; y++) {
    testTransposedPuyoMatrix[x][y].setPos({ x: y, y: x });
  }
}

describe('matrix.ts: initPrimitiveMatrix<number>(13, 6, 0)', () => {
  it(`return a 2D matrix filled with 0s`, () => {
    expect(initPrimitiveMatrix<number>(0, 13, 6)).toEqual(testZeroMatrix);
  });
});

describe('matrix.ts: initPrimitiveMatrix<boolean>(13, 6, true)', () => {
  it(`return a 2D matrix filled with true`, () => {
    expect(initPrimitiveMatrix<boolean>(true, 13, 6)).toEqual(testTrueMatrix);
  });
});

describe('matrix.ts: puyoToCharMatrix()', () => {
  it(`return a 2D char matrix equal to testCharMatrix`, () => {
    expect(puyoToCharMatrix(testPuyoMatrix)).toEqual(testCharMatrix);
  });
});

describe('matrix.ts: transposeMatrix<Puyo>()', () => {
  it('return the transpose of a Puyo Matrix', () => {
    expect(transposeMatrix(testPuyoMatrix)).toEqual(testTransposedPuyoMatrix);
  });
});
