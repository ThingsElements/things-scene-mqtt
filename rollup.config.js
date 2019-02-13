import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import json from "rollup-plugin-json";
import builtins from "rollup-plugin-node-builtins";
import browserifyTransform from "rollup-plugin-browserify-transform";
import brfs from "brfs";
import globals from "rollup-plugin-node-globals";

let pkg = require("./package.json");
let external = ["@hatiolab/things-scene"];
let plugins = [
  commonjs(),
  builtins(),
  globals(),
  replace({
    delimiters: ["", ""],
    "#!/usr/bin/env node": ""
  }),
  babel(),
  // json(),
  resolve({ browser: true, preferBuiltins: true })
  // terser({
  //   sourcemap: true
  // })
];

export default [
  {
    input: "src/index.js",
    plugins,
    external,
    output: [
      {
        file: "dist/things-scene-mqtt.js",
        name: "things-scene-mqtt",
        format: "umd",
        globals: {
          "@hatiolab/things-scene": "scene"
        }
      }
    ]
  },
  {
    input: "src/index.js",
    plugins,
    external: ["@hatiolab/things-scene"],
    output: [
      {
        file: pkg.module,
        format: "esm"
      }
    ]
  }
];
