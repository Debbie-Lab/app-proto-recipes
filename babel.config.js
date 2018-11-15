const presets = [
  [
    "@babel/env",
    {
      targets: { node: true },
      useBuiltIns: "usage",
    },
  ],
]

const plugins = [
  ['module-resolver', {
    root: [ './src' ],
    alias: {
      '@root': './src',
      '@recipes': './src/recipes',
    },
  }],
]

module.exports = { presets, plugins }
