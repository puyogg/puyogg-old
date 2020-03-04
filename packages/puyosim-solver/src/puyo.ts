/**
 * Integers representing each Puyo type
 */
enum Color {
  NONE = 0,
  RED,
  GREEN,
  BLUE,
  YELLOW,
  PURPLE,
  GARBAGE,
  HARD,
  POINT, // Need to look into implementing this later on
  SUN, // I forgot the linear equation for the SUN Puyo damage bonus.
  STONE,
  BLOCK,
}

/** Array for converting color ints to chars, based on index. */
const COLOR_CODE = ['0', 'R', 'G', 'B', 'Y', 'P', 'J', 'H', 'N', 'S', 'X', 'L'];

/** Array for converting color ints to names, based on index. */
const COLOR_NAME = [
  'none',
  'red',
  'green',
  'blue',
  'yellow',
  'purple',
  'garbage',
  'hard',
  'point',
  'sun',
  'stone',
  'block',
];

/** Shorthand type for an x,y object. */
interface Position {
  x: number;
  y: number;
}

/** Class for generating Puyo objects used in matrices. */
class Puyo {
  public p: Color;
  public x: number;
  public y: number;

  /**
   * @param color Int color code
   * @param x Column number
   * @param y Row number
   */
  constructor(color = Color.NONE, x: number, y: number) {
    this.p = color;
    this.x = x;
    this.y = y;
  }

  /** Returns true if Puyo is red, green, blue, yellow, or purple. */
  public isColored(): boolean {
    return this.p >= Color.RED && this.p <= Color.PURPLE;
  }

  public isNone(): boolean {
    return this.p === Color.NONE;
  }

  /** Despite the name this function returns true if the Puyo is Garbage or Hard */
  public isGarbage(): boolean {
    return this.p === Color.GARBAGE || this.p === Color.HARD;
  }

  public isBlock(): boolean {
    return this.p === Color.BLOCK;
  }

  /** Changes the color of the Puyo. */
  public setColor(color: Color): void {
    this.p = color;
  }

  /** Get the x,y position in the original matrix. */
  public getPos(): Position {
    return { x: this.x, y: this.y };
  }

  /** Update the x,y position */
  public setPos(pos: Position): void {
    this.x = pos.x;
    this.y = pos.y;
  }

  public getChar(): string {
    return COLOR_CODE[this.p];
  }

  public getName(): string {
    return COLOR_NAME[this.p];
  }

  /** Checks if another Puyo is the same color as this one. */
  public sameColor(puyo: Puyo): boolean {
    return this.p === puyo.p;
  }
}

export default Puyo;
export { Color, COLOR_CODE, COLOR_NAME };
