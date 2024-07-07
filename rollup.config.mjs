import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

module.exports = [
  {
    input: "src/index.ts",
    output: [
      {
        // Bundle pour CommonJS (pour Node.js)
        file: "dist/bundle.cjs.js",
        format: "cjs", // Format CommonJS
        sourcemap: true, // Génération de sourcemap pour le débogage
      },
      {
        // Bundle pour ES Modules (pour les importations modernes)
        file: "dist/bundle.esm.js",
        format: "es", // Format ES module
        sourcemap: true, // Génération de sourcemap pour le débogage
      },
      {
        // Bundle pour UMD (Universal Module Definition) pour les navigateurs
        file: "dist/bundle.umd.js",
        format: "umd", // Format UMD
        name: "formons", // Nom global de votre module quand utilisé dans un navigateur
        sourcemap: true, // Génération de sourcemap pour le débogage
      },
    ],
    plugins: [
      // Résolution des modules pour Node.js et navigateurs
      nodeResolve.nodeResolve({
        browser: true, // Support des modules côté navigateur
      }),
      // Conversion des modules CommonJS en ES6
      commonjs(),
      // Support de TypeScript
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/bundle.d.ts", format: "es" }],
    plugins: [dts.default()],
  },
];
