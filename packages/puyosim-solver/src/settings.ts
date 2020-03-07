interface Settings {
  rows: number;
  cols: number;
  hrows: number;
  targetPoint: number;
  puyoToPop: number;
  colorBonus: number[];
  groupBonus: number[];
  chainPower: number[];
  pointPuyoBonus: number;
  bonusType: string | 'CLASSIC' | 'FEVER';
  addGarbageToPCBonus: boolean; // 20th (and maybe 15th and 7) Garbage Puyos add 10 to Puyo Cleared Bonus
  clearGarbageInHrows: boolean; // Games after 15th anniversary allow for clearing garbage in hidden rows
}

const BONUS_TYPE = {
  CLASSIC: {
    COLOR_BONUS: [0, 3, 6, 12, 24],
    GROUP_BONUS: [0, 2, 3, 4, 5, 6, 7, 10],
  },
  FEVER: {
    COLOR_BONUS: [0, 2, 4, 8, 16],
    GROUP_BONUS: [0, 1, 2, 3, 4, 5, 6, 8],
  },
};

// prettier-ignore
const CHAIN_POWER = {
  CLASSIC: {
    OPP: [0, 8, 16, 32, 64, 128, 256, 512, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999, 999],
    TSU: [0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672],
  },
  FEVER1: {
    ARLE: [4, 12, 24, 33, 50, 101, 169, 254, 341, 428, 538, 648, 763, 876, 990, 999, 999, 999, 999],
  },
  CHRONICLE: {
    ARLE: [0, 8, 17, 23, 35, 71, 118, 178, 239, 300, 377, 454, 534, 613, 693, 699, 699, 699, 699],
  }
};

const GAME_DEFAULTS = {
  PP2: {
    name: 'Puyo Puyo Tsu - 1994',
    rows: 13,
    cols: 6,
    hrows: 1,
    targetPoint: 70,
    puyoToPop: 4,
    bonusType: 'CLASSIC',
    pointPuyoBonus: 50,
    addGarbageToPCBonus: false,
    clearGarbageInHrows: false,
  },
  CHAMPIONS_PP2: {
    name: 'Puyo Puyo Champions - Tsu Rule',
    rows: 13,
    cols: 6,
    hrows: 1,
    targetPoint: 70,
    puyoToPop: 4,
    bonusType: 'CLASSIC',
    pointPuyoBonus: 50,
    addGarbageToPCBonus: false,
    clearGarbageInHrows: true,
  },
};

function defaultSettings(): Settings {
  return {
    rows: GAME_DEFAULTS.CHAMPIONS_PP2.rows,
    cols: GAME_DEFAULTS.CHAMPIONS_PP2.cols,
    hrows: GAME_DEFAULTS.CHAMPIONS_PP2.hrows,
    targetPoint: GAME_DEFAULTS.CHAMPIONS_PP2.targetPoint,
    puyoToPop: GAME_DEFAULTS.CHAMPIONS_PP2.puyoToPop,
    bonusType: GAME_DEFAULTS.CHAMPIONS_PP2.bonusType,
    colorBonus: BONUS_TYPE.CLASSIC.COLOR_BONUS,
    groupBonus: BONUS_TYPE.CLASSIC.GROUP_BONUS,
    chainPower: CHAIN_POWER.CLASSIC.TSU,
    pointPuyoBonus: GAME_DEFAULTS.CHAMPIONS_PP2.pointPuyoBonus,
    addGarbageToPCBonus: false,
    clearGarbageInHrows: true,
  };
}

export { Settings, defaultSettings, GAME_DEFAULTS, CHAIN_POWER, BONUS_TYPE };
