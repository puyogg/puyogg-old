import Puyo, { Color } from './puyo';

function initPuyoMatrix(rows: number, cols: number, color = Color.NONE): Puyo[][] {
  const matrix: Puyo[][] = [];

  for (let x = 0; x < cols; x++) {
    matrix[x] = [];
    for (let y = 0; y < rows; y++) {
      matrix[x][y] = new Puyo(x, y, color);
    }
  }

  return matrix;
}

function initPrimitiveMatrix<T>(rows: number, cols: number, value: T): T[][] {
  const matrix: T[][] = [];

  for (let x = 0; x < cols; x++) {
    matrix[x] = [];
    for (let y = 0; y < rows; y++) {
      matrix[x][y] = value;
    }
  }

  return matrix;
}

export { initPuyoMatrix, initPrimitiveMatrix };
