import Puyo, { Color, COLOR_CODE } from './puyo';

/** Creates an empty 2D Puyo matrix */
function initPuyoMatrix(rows: number, cols: number, color = Color.NONE): Puyo[][] {
  const matrix: Puyo[][] = [];

  for (let x = 0; x < cols; x++) {
    matrix[x] = [];
    for (let y = 0; y < rows; y++) {
      matrix[x][y] = new Puyo(color, x, y);
    }
  }

  return matrix;
}

/** Creates a 2D Matrix for a primitive data type. */
function initPrimitiveMatrix<T>(value: T, rows: number, cols: number): T[][] {
  const matrix: T[][] = [];

  for (let x = 0; x < cols; x++) {
    matrix[x] = [];
    for (let y = 0; y < rows; y++) {
      matrix[x][y] = value;
    }
  }

  return matrix;
}

function charToPuyoMatrix(charMatrix: string[][]): Puyo[][] {
  const cols = charMatrix.length;
  const rows = charMatrix[0].length;

  const matrix: Puyo[][] = [];
  for (let x = 0; x < cols; x++) {
    matrix[x] = [];
    for (let y = 0; y < rows; y++) {
      const id = COLOR_CODE.indexOf(charMatrix[x][y]);
      matrix[x][y] = new Puyo(id, x, y);
    }
  }

  return matrix;
}

/** Generates a char-coded copy of a 2D Puyo array. */
function puyoToCharMatrix(puyoMatrix: Puyo[][]): string[][] {
  const cols = puyoMatrix.length;
  const rows = puyoMatrix[0].length;

  const matrix: string[][] = [];
  for (let x = 0; x < cols; x++) {
    matrix[x] = [];
    for (let y = 0; y < rows; y++) {
      matrix[x][y] = puyoMatrix[x][y].getChar();
    }
  }

  return matrix;
}

/** Generates the transpose of an input matrix. */
function transposeMatrix<T>(inputMatrix: T[][]): T[][] {
  const matrix: T[][] = [];
  for (let x = 0; x < inputMatrix[0].length; x++) {
    matrix[x] = [];
    for (let y = 0; y < inputMatrix.length; y++) {
      matrix[x][y] = inputMatrix[y][x];
    }
  }

  return matrix;
}

function clonePuyoMatrix(puyoMatrix: Puyo[][]): Puyo[][] {
  const matrix: Puyo[][] = [];
  for (let x = 0; x < puyoMatrix.length; x++) {
    matrix[x] = [];
    for (let y = 0; y < puyoMatrix[0].length; y++) {
      const puyo = puyoMatrix[x][y];
      matrix[x][y] = new Puyo(puyo.p, puyo.x, puyo.y);
    }
  }

  return matrix;
}

function resetPrimitiveMatrix<T>(matrix: T[][], value: T): void {
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[0].length; y++) {
      matrix[x][y] = value;
    }
  }
}

export {
  clonePuyoMatrix,
  initPuyoMatrix,
  initPrimitiveMatrix,
  charToPuyoMatrix,
  puyoToCharMatrix,
  resetPrimitiveMatrix,
  transposeMatrix,
};
