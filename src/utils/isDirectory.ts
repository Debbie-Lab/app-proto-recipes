import * as fs from 'fs'
import * as path from 'path'

export default function isDirectory (dir: string): boolean {
  try {
    return fs.statSync(path.resolve(dir)).isDirectory()
  } catch (e) {
    return false
  }
}
