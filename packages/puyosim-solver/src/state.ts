import Puyo from './puyo';
import { puyoToCharMatrix, transposeMatrix } from './matrix';
type NextAction = 'CHECK_FOR_DROPS' | 'CHECK_FOR_POPS' | 'NEEDS_TO_DROP' | 'NEEDS_TO_POP' | 'FINISHED';

interface StateData {
  matrix: Puyo[][];
  linkScore: number;
  totalScore: number;
  linkGarbage: number;
  totalGarbage: number;
  linkPuyoCountBonus: number;
  linkPointPuyoBonus: number;
  linkTotalBonus: number;
  oldLeftoverNuisance: number; // Leftover nuisance points, informed by the previous link
  newLeftoverNuisance: number; // Next NL count, to send to the next link
  chainLength: number;
  requiresDrop: boolean;
  requiresPop: boolean;
  toDrop: number[][];
  colorsToPop: Puyo[][];
  garbageToPop: Puyo[];
  pointPuyoToPop: Map<string, Puyo>;
  sunPuyoToPop: Map<string, Puyo>;
  action: NextAction;
}

/** Wrapper class for holding the matrix and its state information. */
class MatrixState {
  matrix: Puyo[][];
  linkScore: number;
  totalScore: number;
  linkGarbage: number;
  totalGarbage: number;
  linkPuyoCountBonus: number;
  linkPointPuyoBonus: number;
  linkTotalBonus: number;
  oldLeftoverNuisance: number;
  newLeftoverNuisance: number;
  chainLength: number;
  requiresDrop: boolean;
  requiresPop: boolean;
  toDrop: number[][];
  colorsToPop: Puyo[][];
  garbageToPop: Puyo[];
  pointPuyoToPop: Map<string, Puyo>;
  sunPuyoToPop: Map<string, Puyo>;
  action: NextAction;

  constructor(data: StateData) {
    this.matrix = data.matrix;
    this.linkScore = data.linkScore;
    this.totalScore = data.totalScore;
    this.linkGarbage = data.linkGarbage;
    this.totalGarbage = data.totalGarbage;
    this.linkPuyoCountBonus = data.linkPuyoCountBonus;
    this.linkPointPuyoBonus = data.linkPointPuyoBonus;
    this.linkTotalBonus = data.linkTotalBonus;
    this.oldLeftoverNuisance = data.oldLeftoverNuisance;
    this.newLeftoverNuisance = data.newLeftoverNuisance;
    this.chainLength = data.chainLength;
    this.requiresDrop = data.requiresDrop;
    this.requiresPop = data.requiresPop;
    this.toDrop = data.toDrop;
    this.colorsToPop = data.colorsToPop;
    this.garbageToPop = data.garbageToPop;
    this.pointPuyoToPop = data.pointPuyoToPop;
    this.sunPuyoToPop = data.sunPuyoToPop;
    this.action = data.action;
  }

  public setActionState(action: NextAction): MatrixState {
    this.action = action;

    if (action === 'NEEDS_TO_DROP') {
      this.requiresDrop = true;
      this.requiresPop = false;
    } else if (action === 'NEEDS_TO_POP') {
      this.requiresDrop = false;
      this.requiresPop = true;
    } else {
      this.requiresDrop = false;
      this.requiresPop = false;
    }

    return this;
  }

  public getState(): StateData {
    return {
      matrix: this.matrix,
      linkScore: this.linkScore,
      totalScore: this.totalScore,
      linkGarbage: this.linkGarbage,
      totalGarbage: this.totalGarbage,
      linkPuyoCountBonus: this.linkPuyoCountBonus,
      linkPointPuyoBonus: this.linkPointPuyoBonus,
      linkTotalBonus: this.linkTotalBonus,
      oldLeftoverNuisance: this.oldLeftoverNuisance,
      newLeftoverNuisance: this.newLeftoverNuisance,
      chainLength: this.chainLength,
      requiresDrop: this.requiresDrop,
      requiresPop: this.requiresPop,
      toDrop: this.toDrop,
      colorsToPop: this.colorsToPop,
      garbageToPop: this.garbageToPop,
      pointPuyoToPop: this.pointPuyoToPop,
      sunPuyoToPop: this.sunPuyoToPop,
      action: this.action,
    };
  }

  /** Convert to char codes, transpose, and print the matrix */
  public printMatrix(): void {
    const charMatrix = puyoToCharMatrix(this.matrix);
    const transpose = transposeMatrix<string>(charMatrix);

    console.log(transpose);
  }

  public printState(): void {
    const state = this.getState();
    const charMatrix = puyoToCharMatrix(state.matrix);
    const transpose = transposeMatrix<string>(charMatrix);

    console.log({
      matrix: transpose,
      linkScore: this.linkScore,
      totalScore: this.totalScore,
      linkGarbage: this.linkGarbage,
      totalGarbage: this.totalGarbage,
      linkPuyoCountBonus: this.linkPuyoCountBonus,
      linkPointPuyoBonus: this.linkPointPuyoBonus,
      linkTotalBonus: this.linkTotalBonus,
      oldLeftoverNuisance: this.oldLeftoverNuisance,
      newLeftoverNuisance: this.newLeftoverNuisance,
      chainLength: this.chainLength,
      requiresDrop: this.requiresDrop,
      requiresPop: this.requiresPop,
      toDrop: this.toDrop,
      colorsToPop: this.colorsToPop,
      garbageToPop: this.garbageToPop,
      pointPuyoToPop: this.pointPuyoToPop,
      sunPuyoToPop: this.sunPuyoToPop,
      action: this.action,
    });
  }
}

export { NextAction, StateData, MatrixState };
