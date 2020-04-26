import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import { terser } from 'rollup-plugin-terser';

const packageJson = require('./package.json');

export default {
  input: './src/main.js',

  output: [
    {
      file: packageJson.main,
      format: 'umd',
      name: 'LottieInteractivity',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: packageJson.module,
      format: 'es',
      sourcemap: true,
    },
  ],

  plugins: [
    // Remove debugger statements and console.log calls
    !process.env.ROLLUP_WATCH && strip(),

    // Handle module resolution
    resolve(),

    // Transpile
    babel({
      exclude: 'node_modules/**',
    }),

    // Handle commonjs
    commonjs(),

    // Minify
    terser(),
  ],
};
