const postcss = require('rollup-plugin-postcss')
module.exports = [
  {
    input: 'src/styles/output.js',
    output: {
      file: 'public/output.js',
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true
      })
    ]
  }
]
