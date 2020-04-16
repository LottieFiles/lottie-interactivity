import babel from "rollup-plugin-babel";

export default {
  input: "./src/main.js",
  output: {
    file: "./build/interactivity.min.js",
    format: "umd",
    name: "lottieInteractivity",
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
