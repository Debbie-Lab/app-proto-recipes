import fs from 'fs'
import path from 'path'
import glob from 'glob'

const join = path.join
export function dirExists(directory) {
  try {
    return fs.statSync(path.resolve(directory)).isDirectory()
  } catch (err) {
    return false
  }
}

export function accessible() {
  try {
    fs.accessSync.apply(fs, arguments)
    return true
  } catch(e) {
    return false
  }
}

export function getDirObjs(dir, whitelist=[]) {
  if (!dirExists(dir)) {
    throw new Error(`Wrong path: ${dir}`)
  }

  const whiteset = new Set(whitelist)
  const objs = {}
  glob(join('**/*.js'), { cwd: dir, dot: false, sync: true })
    .filter(file => !whiteset.has(file))
    .forEach(file => objs[file.replace(/\.\w+$/, '')] = require(join(dir, file)).default)

  return objs
}

