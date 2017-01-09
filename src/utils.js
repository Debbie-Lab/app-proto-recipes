import fs from 'fs'
import path from 'path'


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

