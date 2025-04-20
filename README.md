# axentax-playground
Web playground for developing and testing Axentax syntax and compilation.

## Playground using axentax-compiler

[https://axentax.github.io/axentax-playground/](https://axentax.github.io/axentax-playground/)

## 🔥develop

```
npm run dev
```

## 🔥deploy to github pages

```
npm run deploy
```

## 🔥Contact

**info [dt] axentax [at] gmail [dt] com**  
_Replace `[at]` with `@` and `[dt]` with `.` when sending email._

## Licenses

## Third-Party Licenses

This application includes the following third-party components:

### 1. js-synthesizer
- License: Apache License 2.0  
- Source: https://github.com/jet2jet/js-synthesizer  
- Note: This library includes WebAssembly binaries based on FluidSynth, which is licensed under the LGPL v2.1.

### 2. FluidSynth
- License: GNU Lesser General Public License v2.1 (LGPL v2.1)  
- Source: https://github.com/FluidSynth/fluidsynth  

The file `fluidsynth.wasm` is derived from FluidSynth.  
We have made modifications to this component.  
In compliance with LGPL v2.1, users are able to replace this file with a compatible version of their own build.

To facilitate compliance:
- `fluidsynth.wasm` is not statically linked and is loaded dynamically at runtime.
- Users can freely substitute `fluidsynth.wasm` with an alternative version.

Please refer to the original LGPL license for details.
