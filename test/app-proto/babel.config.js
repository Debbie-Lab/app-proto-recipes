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
    root: [ '.' ],
    alias: {
      '@server': './server',
      '@app-proto/recipes': '../../',
    },
  }],
]

module.exports = { presets, plugins }
