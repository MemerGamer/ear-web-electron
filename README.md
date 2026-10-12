# ear (web) electron
![Ear(web) Logo](res/icons/256x256.png)

This is an unofficial electron build for the unofficial [ear (web) project](https://github.com/radiance-project/ear-web).

For more information please read the [README](./README_EAR_WEB.md).

## Usage

Download the latest binary file from the [releases](https://github.com/MemerGamer/ear-web-electron/releases) page and run it.

## Development

Use Node.js 22 or newer, then run `npm ci` and `npm start`. To rebuild the bundled styles, run `npm run build:css`. On Linux, run `xvfb-run -a npx electron --no-sandbox tests/smoke.cjs` to verify the bundled routes, configuration loading and Web Serial availability.

## Releases

Update `package.json`, `package-lock.json` and `CHANGELOG.md`, then push a version tag (for example `v1.1.0`) with a matching GitHub draft release. The build workflow packages Windows x64, Linux x64, and macOS x64/arm64 binaries and uploads them to that release. Publish the draft after all builds pass. The binaries are unsigned.
