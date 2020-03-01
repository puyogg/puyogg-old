import Puyo from './puyo';
import { Settings } from './settings';
import { initPuyoMatrix, initPrimitiveMatrix } from './matrix';
import { NextAction, StateData, MatrixState } from './state';

export default class ChainSolver {
  settings: Settings;
  inputMatrix: Puyo[][];
  finalMatrix: Puyo[][];
  matrixStates: MatrixState[];

  constructor(inputMatrix: Puyo[][], settings: Settings) {
    this.settings = settings;

    // Initialize matrices and states
    this.inputMatrix = inputMatrix;
    this.finalMatrix = initPuyoMatrix(settings.rows, settings.cols);

    this.matrixStates = [
      new MatrixState({
        matrix: inputMatrix,
        score: 0,
        garbage: 0,
        chainLength: 0,
        requiresDrop: false,
        requiresPop: false,
        toDrop: initPrimitiveMatrix(this.settings.rows, this.settings.cols, 0),
        toPop: [],
        action: 'INIT',
      }),
    ];

    // // Check if the initial state already requires a drop.
    // this.calculateDrops();
    // // If no drops were required, then the initial state may need to pop.
    // if (!this.matrixStates[0].requiresDrop) {
    //   this.calculatePops();

    //   // If no pops were required, then it's already done.
    //   if (!this.matrixStates[0].requiresPop) {
    //     this.matrixStates[0].setActionState('FINISHED');
    //   }
    // }
  }

  private calculateDrops(): ChainSolver {
    const state = this.matrixStates[this.matrixStates.length - 1];
    const matrix = state.matrix;
    const toDrop = state.toDrop;

    for (let x = 0; x < this.settings.cols; x++) {
      const T = Array(this.settings.rows).fill(0);

      // Base case
      if (matrix[x][this.settings.rows - 1].isNone()) {
        T[this.settings.rows - 1] = 1;
      }

      // In one pass, count the number of empty cells since the floor or the
      // last Block Puyo.
      for (let y = this.settings.rows - 2; y >= 0; y--) {
        if (matrix[x][y].isNone()) {
          T[y] = T[y + 1] + 1;
        } else if (matrix[x][y].isBlock()) {
          T[y] = 0;
        } else {
          T[y] = T[y + 1];
        }
      }

      // Update the cells in toDrop with how far they need to drop.
      for (let y = 0; y < this.settings.rows - 1; y++) {
        const puyo = matrix[x][y];
        if (puyo.isColored() || puyo.isGarbage()) {
          toDrop[x][y] = T[y + 1];
          // If any of the Color/Garbage Puyo have drop distance > 0, update action state.
          if (T[y + 1] > 0) {
            state.setActionState('NEEDS_TO_DROP');
          }
        }
      }
    }

    return this;
  }

  // pushDroppedMatrix

  private calculatePops(): ChainSolver {
    const groups: Puyo[][] = [];
    const checked = initPrimitiveMatrix(this.settings.rows, this.settings.cols, false);
    const state = this.matrixStates[this.matrixStates.length - 1];
    const matrix = state.matrix;

    for (let y = 0; y < this.settings.rows; y++) {
      for (let x = 0; x < this.settings.cols; x++) {
        const initPuyo = matrix[y][x];

        // If the cell has already been checked, skip
        if (checked[y][x]) continue;

        checked[y][x] = true;

        // If the cell isn't a colored Puyo, skip
        if (!initPuyo.isColored()) continue;

        // If we get past those conditions, then perform DFS
        const group = [initPuyo];
        const hrows = this.settings.hrows;
        const rows = this.settings.rows;
        const cols = this.settings.cols;
        let i = 0;

        while (i < group.length) {
          const puyo = group[i];

          // Check up
          if (puyo.y > hrows && !checked[y - 1][x] && puyo.sameColor(matrix[y - 1][x])) {
            group.push(matrix[y - 1][x]);
            checked[y - 1][x] = true;
          }

          // Check down
          if (puyo.y < rows && !checked[y + 1][x] && puyo.sameColor(matrix[y + 1][x])) {
            group.push(matrix[y + 1][x]);
            checked[y + 1][x] = true;
          }

          // Check left
          if (puyo.x > 0 && !checked[y][x - 1] && puyo.sameColor(matrix[y][x - 1])) {
            group.push(matrix[y][x - 1]);
            checked[y][x - 1] = true;
          }

          // Check right
          if (puyo.x < cols && !checked[y][x + 1] && puyo.sameColor(matrix[y][x + 1])) {
            group.push(matrix[y][x + 1]);
            checked[y][x + 1] = true;
          }

          i++;
        }

        if (group.length >= 4) {
          groups.push(group);
        }
      }
    }

    if (groups.length > 0) {
      state.setActionState('NEEDS_TO_POP');
      state.toPop = groups;
    }

    return this;
  }

  // calculateGarbagePops()
  // pushPoppedMatrix()

  // simulateChain(), and get all intermediate drops and pops.
}
