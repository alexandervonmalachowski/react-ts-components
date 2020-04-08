import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import packageJson from './package.json';
import autoprefixer from 'autoprefixer';
import env from 'postcss-preset-env';
const ext = ['.ts', '.tsx', '.js', 'jsx'];
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      globals,
    },
    {
      file: packageJson.module,
      format: 'es',
      sourcemap: true,
      globals,
    },
  ],
  plugins: [
    resolve({ browser: true, extensions: ext }),
    commonjs({
      include: '**/node_modules/**',
      namedExports: {
        'node_modules/react/react.js': [
          'Children',
          'Component',
          'PropTypes',
          'createElement',
        ],
        'node_modules/react-dom/index.js': ['render'],
      },
    }),
    babel({
      extensions: ext,
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
    postcss({
      extract: false,
      modules: true,
      plugins: [env(), autoprefixer()],
      use: ['sass'],
    }),
  ],
  external: Object.keys(globals),
};
