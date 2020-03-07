import Puyo, { Color } from './puyo';
import { Settings, defaultSettings } from './settings';
import { clonePuyoMatrix, initPuyoMatrix, initPrimitiveMatrix, charToPuyoMatrix, resetPrimitiveMatrix } from './matrix';
import { MatrixState } from './state';

// Puyo Matrix Type Guard
const isPuyoMatrix = (matrix: Puyo[][] | string[][]): matrix is string[][] => {
  return matrix[0][0] instanceof Puyo;
};

// String matrix type guard
const isCharMatrix = (matrix: Puyo[][] | string[][]): matrix is string[][] => {
  return typeof matrix[0][0] === 'string';
};

export default class ChainSolver {
  settings: Settings;
  inputMatrix: Puyo[][];
  matrixStates: MatrixState[];
  private checkMatrix: boolean[][];
  private solveInPlace: boolean;

  constructor(inputMatrix: Puyo[][] | string[][], settings: Settings, solveInPlace = false) {
    this.settings = settings;
    this.solveInPlace = solveInPlace;

    // Initialize matrices
    if (isCharMatrix(inputMatrix)) {
      this.inputMatrix = charToPuyoMatrix(inputMatrix);
    } else if (isPuyoMatrix(inputMatrix)) {
      this.inputMatrix = inputMatrix;
    }

    this.checkMatrix = initPrimitiveMatrix<boolean>(false, this.settings.rows, this.settings.cols);

    this.matrixStates = [
      new MatrixState({
        matrix: clonePuyoMatrix(this.inputMatrix),
        linkScore: 0,
        totalScore: 0,
        linkGarbage: 0,
        totalGarbage: 0,
        linkPuyoCountBonus: 0,
        linkPointPuyoBonus: 0,
        linkTotalBonus: 0,
        oldLeftoverNuisance: 0,
        newLeftoverNuisance: 0,
        chainLength: 0,
        requiresDrop: false,
        requiresPop: false,
        toDrop: initPrimitiveMatrix(0, this.settings.rows, this.settings.cols),
        colorsToPop: [],
        garbageToPop: [],
        pointPuyoToPop: new Map<string, Puyo>(),
        sunPuyoToPop: new Map<string, Puyo>(),
        action: 'CHECK_FOR_DROPS',
      }),
    ];
  }

  private calculateDrops(): void {
    const state = this.matrixStates[this.matrixStates.length - 1];
    const matrix = state.matrix;
    const toDrop = state.toDrop;
    const rows = this.settings.rows;
    const cols = this.settings.cols;

    for (let x = 0; x < cols; x++) {
      let noneCount = matrix[x][rows - 1].isNone() ? 1 : 0;

      for (let y = rows - 2; y >= 0; y--) {
        if (matrix[x][y].isNone()) {
          noneCount += 1;
        } else if (matrix[x][y].isBlock()) {
          noneCount = 0;
        } else if (!matrix[x][y].isNone() && !matrix[x][y].isBlock()) {
          toDrop[x][y] = noneCount;
          if (noneCount > 0) {
            state.setActionState('NEEDS_TO_DROP');
          }
        }
      }
    }

    // If nothing needs to drop, the simulator will have to check for pops next.
    if (state.action !== 'NEEDS_TO_DROP') {
      state.setActionState('CHECK_FOR_POPS');
    }
  }

  private pushDroppedMatrix(): void {
    const state = this.matrixStates[this.matrixStates.length - 1];
    const toDrop = state.toDrop;
    const matrix = state.matrix;
    const rows = this.settings.rows;
    const cols = this.settings.cols;

    if (this.solveInPlace) {
      // Modify the current matrix
      for (let x = 0; x < cols; x++) {
        for (let y = rows - 1; y >= 0; y--) {
          if (!matrix[x][y].isNone()) {
            const toY = toDrop[x][y] + y;
            matrix[x][toY].setColor(matrix[x][y].p);
            if (y !== toY) {
              matrix[x][y].setColor(Color.NONE);
            }
          }

          // Reset the toDrop value for the next run
          toDrop[x][y] = 0;
        }
      }

      state.setActionState('CHECK_FOR_POPS');

      return;
    }

    // Generate a new matrix
    const droppedMatrix = initPuyoMatrix(rows, cols, Color.NONE);
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (!matrix[x][y].isNone()) {
          const toY = toDrop[x][y] + y;
          droppedMatrix[x][toY].setColor(matrix[x][y].p);
        }
      }
    }

    // Push a new state.
    this.matrixStates.push(
      new MatrixState({
        matrix: droppedMatrix,
        linkScore: state.linkScore,
        totalScore: state.totalScore,
        linkGarbage: state.linkGarbage,
        totalGarbage: state.totalGarbage,
        linkPuyoCountBonus: state.linkPuyoCountBonus,
        linkPointPuyoBonus: state.linkPointPuyoBonus,
        linkTotalBonus: state.linkTotalBonus,
        oldLeftoverNuisance: state.oldLeftoverNuisance,
        newLeftoverNuisance: state.newLeftoverNuisance,
        chainLength: state.chainLength,
        requiresDrop: false,
        requiresPop: false, // False is getting put here temporarily
        toDrop: initPrimitiveMatrix(0, rows, cols),
        colorsToPop: [],
        garbageToPop: [],
        pointPuyoToPop: new Map<string, Puyo>(),
        sunPuyoToPop: new Map<string, Puyo>(),
        action: 'CHECK_FOR_POPS',
      }),
    );
  }

  private calculatePops(): void {
    const groups: Puyo[][] = [];
    // const checked = initPrimitiveMatrix(false, this.settings.rows, this.settings.cols);
    const checked = this.checkMatrix;
    const state = this.matrixStates[this.matrixStates.length - 1];
    const matrix = state.matrix;

    for (let y = 0; y < this.settings.rows; y++) {
      for (let x = 0; x < this.settings.cols; x++) {
        const initPuyo = matrix[x][y];

        // If the cell has already been checked, skip
        if (checked[x][y]) continue;

        checked[x][y] = true;

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
          if (puyo.y > hrows && !checked[puyo.x][puyo.y - 1] && puyo.sameColor(matrix[puyo.x][puyo.y - 1])) {
            group.push(matrix[puyo.x][puyo.y - 1]);
            checked[puyo.x][puyo.y - 1] = true;
          }

          // Check down
          if (puyo.y < rows - 1 && !checked[puyo.x][puyo.y + 1] && puyo.sameColor(matrix[puyo.x][puyo.y + 1])) {
            group.push(matrix[puyo.x][puyo.y + 1]);
            checked[puyo.x][puyo.y + 1] = true;
          }

          // Check left
          if (puyo.x > 0 && !checked[puyo.x - 1][puyo.y] && puyo.sameColor(matrix[puyo.x - 1][puyo.y])) {
            group.push(matrix[puyo.x - 1][puyo.y]);
            checked[puyo.x - 1][puyo.y] = true;
          }

          // Check right
          if (puyo.x < cols - 1 && !checked[puyo.x + 1][puyo.y] && puyo.sameColor(matrix[puyo.x + 1][puyo.y])) {
            group.push(matrix[puyo.x + 1][puyo.y]);
            checked[puyo.x + 1][puyo.y] = true;
          }

          i++;
        }

        if (group.length >= 4) {
          groups.push(group);
        }
      }
    }

    // Reset check matrix for next run
    resetPrimitiveMatrix(this.checkMatrix, false);

    if (groups.length > 0) {
      state.setActionState('NEEDS_TO_POP');
      state.chainLength += 1;
      state.colorsToPop = groups;
    }
  }

  private calculateGarbagePops(): void {
    const state = this.matrixStates[this.matrixStates.length - 1];
    const matrix = state.matrix;
    const rows = this.settings.rows;
    const cols = this.settings.cols;
    const hrows = this.settings.hrows;

    // Check for SEGA vs COMPILE behavior for garbage in the hidden row.
    // In SEGA games, Garbage in the hidden rows can be cleared by pops in the visible region.
    // In COMPILE games, garbage in the hidden rows aren't affected by anything.
    const topRowLimit = this.settings.clearGarbageInHrows ? 0 : hrows;

    const garbageToPop: Puyo[] = [];

    for (const group of state.colorsToPop) {
      for (const puyo of group) {
        const x = puyo.x;
        const y = puyo.y;

        // Check up.
        if (y > topRowLimit && matrix[x][y - 1].isNuisance()) {
          garbageToPop.push(matrix[x][y - 1]);
        }

        // Check down
        if (y < rows - 1 && matrix[x][y + 1].isNuisance()) {
          garbageToPop.push(matrix[x][y + 1]);
        }

        // Check left
        if (x > 0 && matrix[x - 1][y].isNuisance()) {
          garbageToPop.push(matrix[x - 1][y]);
        }

        // Check right
        if (x < cols - 1 && matrix[x + 1][y].isNuisance()) {
          garbageToPop.push(matrix[x + 1][y]);
        }
      }
    }

    // Put any Point or Sun Puyos into their unique set maps.
    for (const garbage of garbageToPop) {
      if (garbage.p === Color.POINT) {
        state.pointPuyoToPop.set(garbage.x + ',' + garbage.y, garbage);
      } else if (garbage.p === Color.SUN) {
        state.sunPuyoToPop.set(garbage.x + ',' + garbage.y, garbage);
      }
    }

    state.garbageToPop = garbageToPop;
  }

  private calculateLinkScore(): void {
    // https://puyonexus.com/wiki/Scoring

    const state = this.getLatestState();
    const colorsToPop = state.colorsToPop;

    // Get chain power from table
    const CP = this.settings.chainPower[state.chainLength - 1];

    // Count the number of different colors popping
    const colorSet = new Set();
    colorsToPop.forEach(group => colorSet.add(group[0].p));
    const CB = this.settings.colorBonus[colorSet.size - 1];

    // Count the number of Puyos popping
    const PC = colorsToPop.reduce<number>((acc: number, group: Puyo[]): number => {
      return acc + group.length;
    }, 0);

    // Calculate total group bonus by summing the bonus for each group to pop.
    const GB = colorsToPop.reduce<number>((acc: number, group: Puyo[]): number => {
      return acc + group.length >= this.settings.puyoToPop + this.settings.groupBonus.length
        ? this.settings.groupBonus[this.settings.groupBonus.length - 1]
        : this.settings.groupBonus[group.length - this.settings.puyoToPop];
    }, 0);

    // Bounds check to keep totalBonus within 1 to 999, inclusive
    const totalBonus = Math.min(Math.max(CP + CB + GB, 1), 999);

    // Calculate Point Puyo Bonus based on number of Point Puyos
    const PB = state.pointPuyoToPop.size * this.settings.pointPuyoBonus;

    // Update state with its calculated link score
    // This gets really confusing when Point Puyos are involved.
    // In-game, the score will display (10 * PC + PB) * totalBonus and add that the displayed score.
    // But for the garbage calculation, the game actually uses (10 * PC) * totalBonus + PB
    // The Puyo Nexus chain simulator doesn't display the added "fake" score.
    state.linkScore = 10 * PC * totalBonus + PB;
    state.totalScore += (10 * PC + PB) * totalBonus;
    state.linkPuyoCountBonus = PC;
    state.linkPointPuyoBonus = PB;
    state.linkTotalBonus = totalBonus;
  }

  private calculateLinkGarbage(): void {
    const state = this.getLatestState();

    // Calculate "Nuisance Points", "Nuisance Count", and "Leftover Nuisance"
    const NP = state.linkScore / this.settings.targetPoint + state.oldLeftoverNuisance;
    const NC = Math.floor(NP);
    const NL = NP - NC;

    // Calculate the additional garbage added by SUN Puyos
    const sun = state.sunPuyoToPop;
    const sunBonus = state.chainLength === 1 ? 3 * sun.size : 6 * (state.chainLength - 1) * sun.size;

    // Update state with its calculated garbage count
    state.linkGarbage = NC;
    state.totalGarbage += state.linkGarbage + sunBonus;
    state.newLeftoverNuisance = NL;
  }

  private pushPoppedMatrix(): void {
    const state = this.matrixStates[this.matrixStates.length - 1];
    const matrix = state.matrix;
    const colorsToPop = state.colorsToPop;
    const garbageToPop = state.garbageToPop;

    if (this.solveInPlace) {
      // Reset the maps for the next run
      state.pointPuyoToPop.clear();
      state.sunPuyoToPop.clear();

      for (const group of colorsToPop) {
        for (const puyo of group) {
          matrix[puyo.x][puyo.y].p = Color.NONE;
        }
      }

      for (const garbage of garbageToPop) {
        const targetPuyo = matrix[garbage.x][garbage.y];
        if (targetPuyo.p === Color.HARD) {
          targetPuyo.p = Color.GARBAGE;
        } else if (targetPuyo.p === Color.GARBAGE || targetPuyo.p === Color.POINT || targetPuyo.p === Color.SUN) {
          targetPuyo.p = Color.NONE;
        }
      }

      // Reset some of the states
      state.linkScore = 0;
      state.linkGarbage = 0;
      state.linkPuyoCountBonus = 0;
      state.linkPointPuyoBonus = 0;
      state.linkTotalBonus = 0;
      state.oldLeftoverNuisance = state.newLeftoverNuisance;
      state.newLeftoverNuisance = 0;
      // state.toDrop should've already reset earlier
      state.colorsToPop = [];
      state.garbageToPop = [];
      state.pointPuyoToPop.clear();
      state.sunPuyoToPop.clear();
      state.setActionState('CHECK_FOR_DROPS');

      return;
    }

    // Generate a new matrix
    const poppedMatrix = clonePuyoMatrix(matrix);
    for (const group of colorsToPop) {
      for (const puyo of group) {
        poppedMatrix[puyo.x][puyo.y].p = Color.NONE;
      }
    }

    for (const garbage of garbageToPop) {
      const targetPuyo = poppedMatrix[garbage.x][garbage.y];
      if (targetPuyo.p === Color.HARD) {
        targetPuyo.p = Color.GARBAGE;
      } else if (targetPuyo.p === Color.GARBAGE || targetPuyo.p === Color.POINT || targetPuyo.p === Color.SUN) {
        targetPuyo.p = Color.NONE;
      }
    }

    // Push a new state
    this.matrixStates.push(
      new MatrixState({
        matrix: poppedMatrix,
        linkScore: 0,
        totalScore: state.totalScore,
        linkGarbage: 0,
        totalGarbage: state.totalGarbage,
        linkPuyoCountBonus: 0,
        linkPointPuyoBonus: 0,
        linkTotalBonus: 0,
        oldLeftoverNuisance: state.newLeftoverNuisance,
        newLeftoverNuisance: 0,
        chainLength: state.chainLength,
        requiresDrop: false,
        requiresPop: false,
        toDrop: initPrimitiveMatrix(0, this.settings.rows, this.settings.cols),
        colorsToPop: [],
        garbageToPop: [],
        pointPuyoToPop: new Map<string, Puyo>(),
        sunPuyoToPop: new Map<string, Puyo>(),
        action: 'CHECK_FOR_DROPS',
      }),
    );
  }

  public simulateStep(): void {
    const state = this.getLatestState();

    if (state.action === 'CHECK_FOR_DROPS') {
      this.calculateDrops();
      this.simulateStep(); // Leads to 'NEEDS_TO_DROP' or 'CHECK_FOR_POPS'
    } else if (state.action === 'NEEDS_TO_DROP') {
      this.pushDroppedMatrix(); // Leads to 'CHECK_FOR_POPS'
    } else if (state.action === 'CHECK_FOR_POPS') {
      this.calculatePops(); // Leads to 'NEEDS_TO_POP' or finished
      this.calculateGarbagePops();

      if (state.requiresPop) {
        this.calculateLinkScore();
        this.calculateLinkGarbage();
        this.simulateStep(); // Leads to 'NEEDS_TO_POP'
      } else {
        state.setActionState('FINISHED');
      }
    } else if (state.action === 'NEEDS_TO_POP') {
      this.pushPoppedMatrix(); // Leads to 'CHECK_FOR_DROPS'
    }
  }

  public simulateChain(): void {
    while (this.getLatestState().action !== 'FINISHED') {
      this.simulateStep();
    }
  }

  public reset(inputMatrix?: Puyo[][] | string[][], settings?: Settings): void {
    if (inputMatrix) {
      if (isCharMatrix(inputMatrix)) {
        this.inputMatrix = charToPuyoMatrix(inputMatrix);
      } else if (isPuyoMatrix(inputMatrix)) {
        this.inputMatrix = inputMatrix;
      }
    }

    if (settings) {
      this.settings = settings;
    }

    if (this.solveInPlace) {
      const state = this.matrixStates[0];
      state.matrix = clonePuyoMatrix(this.inputMatrix);
      state.linkScore = 0;
      state.totalScore = 0;
      state.linkGarbage = 0;
      state.totalGarbage = 0;
      state.linkPuyoCountBonus = 0;
      state.linkPointPuyoBonus = 0;
      state.linkTotalBonus = 0;
      state.oldLeftoverNuisance = 0;
      state.newLeftoverNuisance = 0;
      state.chainLength = 0;
      resetPrimitiveMatrix(state.toDrop, 0);
      resetPrimitiveMatrix(this.checkMatrix, false);
      state.colorsToPop = [];
      state.garbageToPop = [];
      state.pointPuyoToPop.clear();
      state.sunPuyoToPop.clear();
      state.setActionState('CHECK_FOR_DROPS');
    }

    this.matrixStates = [
      new MatrixState({
        matrix: clonePuyoMatrix(this.inputMatrix),
        linkScore: 0,
        totalScore: 0,
        linkGarbage: 0,
        totalGarbage: 0,
        linkPuyoCountBonus: 0,
        linkPointPuyoBonus: 0,
        linkTotalBonus: 0,
        oldLeftoverNuisance: 0,
        newLeftoverNuisance: 0,
        chainLength: 0,
        requiresDrop: false,
        requiresPop: false,
        toDrop: initPrimitiveMatrix(0, this.settings.rows, this.settings.cols),
        colorsToPop: [],
        garbageToPop: [],
        pointPuyoToPop: new Map<string, Puyo>(),
        sunPuyoToPop: new Map<string, Puyo>(),
        action: 'CHECK_FOR_DROPS',
      }),
    ];
  }

  public getState(index: number): MatrixState {
    return this.matrixStates[index];
  }

  public getLatestState(): MatrixState {
    return this.matrixStates[this.matrixStates.length - 1];
  }
}

export { defaultSettings };
