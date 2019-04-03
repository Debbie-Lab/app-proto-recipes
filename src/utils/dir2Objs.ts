import { sync } from 'glob'
import { join } from 'path'

export default function dir2Objs (dir: string, blacklist: string[] = []): Object {
  const blackSet: Set<string> = new Set(blacklist)
  const objs: Object = {}
  sync('**/*.js', { cwd: dir, dot: false })
    .filter(file => !blackSet.has(file))
    .forEach(async file => objs[file.replace(/\.\w+$/, '')] = await import(join(dir, file)))

  return objs
}
