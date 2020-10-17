import cssbundle from 'rollup-plugin-css-bundle';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/sirchartsalot.js',
    name: 'sirChart',
    format: 'iife'
  },
  plugins: [cssbundle()]
};
