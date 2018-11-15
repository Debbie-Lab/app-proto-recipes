import * as fs from 'fs'

export default function accessible (): boolean {
  try {
    fs.accessSync.apply(fs, arguments)
    return true
  } catch (e) {
    return false
  }
}
