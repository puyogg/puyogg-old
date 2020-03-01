interface Settings {
  rows: number;
  cols: number;
  hrows: number;
  puyoToPop: number;
  hrowBehavior: 'COMPILE' | 'SEGA';
  bonusType: 'CLASSIC' | 'FEVER';
  colorBonus: number[];
  groupBonus: number[];
  chainPower: number[];
}

function defaultSettings(): Settings {
  return {
    rows: 13,
    cols: 6,
    hrows: 1,
    puyoToPop: 4,
    hrowBehavior: 'SEGA',
    bonusType: 'CLASSIC',
    colorBonus: [0, 3, 6, 12, 24],
    groupBonus: [0, 2, 3, 4, 5, 6, 7, 10],
    chainPower: [
      0,
      8,
      16,
      32,
      64,
      96,
      128,
      160,
      192,
      224,
      256,
      288,
      320,
      352,
      384,
      416,
      448,
      480,
      512,
      544,
      576,
      608,
      640,
      672,
    ],
  };
}

export { Settings, defaultSettings };
