# puyosim-solver

A Puyo Puyo chain solver written in TypeScript.

## Usage
```js
import ChainSolver, { defaultSettings } from '@puyogg/puyosim-solver';

const NINETEEN_CHAIN = [
  ['G', 'Y', 'R', 'G', 'R', 'Y', 'R', 'R', 'R', 'G', 'R', 'R', 'R'],
  ['0', 'Y', 'Y', 'B', 'Y', 'R', 'Y', 'Y', 'G', 'B', 'G', 'G', 'G'],
  ['0', 'B', 'Y', 'B', 'R', 'Y', 'R', 'R', 'G', 'R', 'B', 'B', 'B'],
  ['G', 'G', 'B', 'G', 'Y', 'R', 'Y', 'Y', 'R', 'G', 'R', 'R', 'R'],
  ['Y', 'Y', 'G', 'Y', 'R', 'B', 'R', 'R', 'B', 'R', 'G', 'G', 'G'],
  ['B', 'G', 'Y', 'G', 'G', 'G', 'B', 'B', 'R', 'R', 'B', 'B', 'B'],
];

const settings = defaultSettings();
const solver = new ChainSolver(NINETEEN_CHAIN, settings);
solver.simulateChain();
solver.printState();

// Or, initialize a ChainSolver that performs more of its operations in-place.
// Useful if you don't need any of the intermediate states.
const solver2 = new ChainSolver(NINETEEN_CHAIN, settings, true);
solver2.simulateChain();
solver2.printState();
```

ToDo:
* Add the rest of the chain power tables
* Publish to NPM