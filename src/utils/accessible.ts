import * as fs from 'fs'

export default function accessible (path: string): boolean {
  try {
    fs.accessSync(path)
    return true
  } catch (e) {
    return false
  }
}
