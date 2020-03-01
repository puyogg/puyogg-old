enum Color {
  NONE = 0,
  RED,
  GREEN,
  BLUE,
  YELLOW,
  PURPLE,
  GARBAGE,
  HARD,
  STONE,
  BLOCK,
}

const COLOR_CODE = ['0', 'R', 'G', 'B', 'Y', 'P', 'J', 'H', 'S', 'L'];
const COLOR_NAME = ['none', 'red', 'green', 'blue', 'yellow', 'purple', 'garbage', 'hard', 'stone', 'block'];

interface Position {
  x: number;
  y: number;
}

class Puyo {
  public x: number;
  public y: number;
  public p: Color;

  constructor(color = Color.NONE, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.p = color;
  }

  public isColored(): boolean {
    return this.p >= Color.RED && this.p <= Color.PURPLE;
  }

  public isNone(): boolean {
    return this.p === Color.NONE;
  }

  public isGarbage(): boolean {
    return this.p === Color.GARBAGE || this.p === Color.HARD;
  }

  public isBlock(): boolean {
    return this.p === Color.BLOCK;
  }

  public setColor(color: Color): void {
    this.p = color;
  }

  public getPos(): Position {
    return { x: this.x, y: this.y };
  }

  public getColorCode(): string {
    return COLOR_CODE[this.p];
  }

  public getColorName(): string {
    return COLOR_NAME[this.p];
  }

  public sameColor(puyo: Puyo): boolean {
    return this.p === puyo.p;
  }
}

export default Puyo;
export { Color, COLOR_CODE, COLOR_NAME };
