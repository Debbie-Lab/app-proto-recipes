import { sync } from 'glob'
import { join } from 'path'

export default function dirObjs (dir: string, whitelist: string[] = []): Object {
  const whiteset: Set<string> = new Set(whitelist)
  const objs: Object = {}
  sync('**/*.js', { cwd: dir, dot: false })
    .filter(file => !whiteset.has(file))
    .forEach(file => objs[file.replace(/\.\w+$/, '')] = require(join(dir, file)).default)
  return objs
}
