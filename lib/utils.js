const fs = require('fs')
const glob = require('glob')
const { join } = require('path')

const accessible = function () {
  try {
    fs.accessSync.apply(fs, arguments)
    return true
  } catch (error) {
    console.warn(error)
    return false
  }
}

exports.accessible = accessible

const dirObjs = function (cwd, whitelist=[]) {
  if (!accessible(cwd)) throw new Error('Directory path error ...')

  const whiteset = new Set(whitelist)
  const objs = {}
  glob.sync(join('**/*.js'), { cwd, dot: false})
    .filter(file => !whiteset.has(file))
    .forEach(file => objs[file.replace(/\.\w+$/, '')] = require(join(cwd, file)))

  return objs
}

exports.dirObjs = dirObjs
