import fs from 'fs'
import path from 'path'



/**
 * @param {string} directory
 **/
export function dirExists(directory) {
  try {
    return fs.statSync(path.resolve(directory)).isDirectory()
  } catch (err) {
    return false
  }
}
