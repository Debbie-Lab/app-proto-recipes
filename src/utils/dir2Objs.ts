import { sync } from 'glob'
import { join } from 'path'

/**
 * 
 * @param dir
 * @param blacklist
 */
export default function dir2Objs (dir: string, blacklist: string[] = []): Object {
  const blacklistSet: Set<string> = new Set(blacklist)
  const objs: Object = {}
  sync('**/*.js', { cwd: dir, dot: false })
    .filter(file => !blacklistSet.has(file))
    .forEach(async file => objs[file.replace(/\.\w+$/, '')] = await import(join(dir, file)))

  return objs
}
