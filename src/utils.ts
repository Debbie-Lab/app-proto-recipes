import fs from 'fs'
import path from 'path'
import glob from 'glob'

console.log(fs)
export async function fsExists (p: string): boolean {
  try {
    const res = await fs.access(p, fs.F_OK)
  } catch (e) {
    console.log(e)
    return false
  }
  return true
}

/*
export async function importDrectoryFilesObjects () {

}
*/
