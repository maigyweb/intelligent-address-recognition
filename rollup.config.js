import babel from "@rollup/plugin-babel";

export default {
  input: "index.js",
  output: [
    {
      file: "./es/index.js",
      format: "esm",
      name: "cssModuleVue",
    },
    {
      file: "./dist/index.js",
      format: "cjs",
      name: "cssModuleVue",
      exports: "default",
    },
  ],
  watch: {
    exclude: "node_modules/**",
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
  ],
};
