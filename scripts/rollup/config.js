import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

import { getBundleBanner } from '../getBundleBanner.mjs';

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
const plugins = [
  replace({
    preventAssignment: true,
    values: {
      __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    },
  }),
  json(),
  resolve({
    extensions,
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    extensions,
    rootMode: 'upward',
    babelHelpers: 'runtime',
  }),
  terser(),
  filesize({
    showMinifiedSize: false,
    showGzippedSize: true,
  }),
];

export function createRollupConfig(pkg) {
  return {
    input: pkg.source,
    output: {
      banner: getBundleBanner(pkg),
      file: pkg['umd:main'],
      format: 'umd',
      name: pkg.name,
      sourcemap: true,
    },
    plugins,
  };
}

export function createRollupConfigForReact(pkg) {
  const config = createRollupConfig(pkg);

  return {
    ...config,
    external: ['react', 'react-dom'],
    output: {
      ...config.output,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  };
}
