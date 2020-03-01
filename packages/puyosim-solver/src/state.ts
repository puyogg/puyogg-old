import Puyo from './puyo';
type NextAction = 'INIT' | 'NEEDS_TO_DROP' | 'NEEDS_TO_POP' | 'FINISHED';

interface StateData {
  matrix: Puyo[][];
  score: number;
  garbage: number;
  chainLength: number;
  requiresDrop: boolean;
  requiresPop: boolean;
  toDrop: number[][];
  toPop: Puyo[][];
  action: NextAction;
}

class MatrixState {
  matrix: Puyo[][];
  score: number;
  garbage: number;
  chainLength: number;
  requiresDrop: boolean;
  requiresPop: boolean;
  toDrop: number[][];
  toPop: Puyo[][];
  action: NextAction;

  constructor(data: StateData) {
    this.matrix = data.matrix;
    this.score = data.score;
    this.garbage = data.garbage;
    this.chainLength = data.chainLength;
    this.requiresDrop = data.requiresDrop;
    this.requiresPop = data.requiresPop;
    this.toDrop = data.toDrop;
    this.toPop = data.toPop;
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
}

export { NextAction, StateData, MatrixState };
