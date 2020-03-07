# puyogg - Monorepo
https://puyo.gg/

## Project Setup
Make sure you have [Yarn](https://yarnpkg.com/) installed as a package manager. Then do:
```bash
# Install dependences for the top-level directory
yarn install

# Use lerna to install dependencies for all packages
yarn bootstrap
```

### Cross-platform error
```
> rm -rf ./dist && rm -rf tsconfig.build.tsbuildinfo
'rm' is not recognized as an internal or external command,
```
If you try to build the project on Windows cmd or PowerShell, this error will get thrown because the build scripts call the `rm` bash command, but `rm` is only for Unix systems.

Try using [Git BASH](https://gitforwindows.org/).

## Adding new packages
New packages should be added to the `packages/` folder using this structure:

```
.
├── lerna.json
├── package.json
└── packages
    └── new-package
        ├── package.json
        ├── src
        │   └── index.ts
        ├── tsconfig.build.json
        └── tsconfig.json
```

Default contents of `tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json"
}
```

Default contents of `tsconfig.build.json`. If the package is dependent on other local packages, we need to add a relative path to that local package's `tsconfig.build.json` under `references`.
```json
{
  "extends": "../../tsconfig.build.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },

  "references": [{
    "path": "../localpackage/tsconfig.build.json"
  }],

  "include": [
    "src/**/*"
  ]
}
```

Default contents of `package.json`. Local packages should be added as a dependency below.
```json
{
  "name": "@puyogg/package",
  "version": "0.0.0",
  "main": "dist/index",
  "types": "dist/index",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "npm run clean && npm run compile",
    "clean": "rm -rf ./dist && rm -rf tsconfig.build.tsbuildinfo",
    "compile": "tsc -b tsconfig.build.json",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "@puyogg/localpackage": "^0.0.0"
  },
  "devDependencies": {
    "typescript": "^3.8.2"
  }
}

