# Working (Hardly)

Moves the mouse pointer ever N seconds (4 minutes).

Can also type a key instead of move the mouse. Run --help to see all options.

## Installation

`npm i working-hardly` (or use `npx`)

If you have any errors from node-gyp, you may need to do this: https://github.com/octalmage/robotjs#building

## Usage

`workinghardly`

```
Options:
  -V, --version           output the version number
  -i, --interval [value]  How many seconds between mouse movements [240] (default: 240)
  -f, --f15instead        Hit F15 instead of moving the mouse
  -k, --key [value]       Provide a keep awake key
  -n, --noskip            do not skip movement if the mouse has changed position between last runs
  -r, --run               Run immediately
  -h, --help              output usage information
```