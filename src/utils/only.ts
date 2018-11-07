// @see https://github.com/tj/node-only/blob/master/index.js

export default function (obj: any, keys: Array<string> | string): Object {
  obj = obj || {}
  if ('string' === typeof keys) {
    keys = keys.split(/ +/)
  }
  return keys.reduce((ret: any, key: string) => {
    if (null === obj[key]) {
      return ret
    }
    ret[key] = obj[key]
    return ret
  }, {})
}
