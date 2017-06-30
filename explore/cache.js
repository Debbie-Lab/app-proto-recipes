import LRU from 'lru-cache'
import hash from 'object-hash'

const opts = {
  length: function(n, key) { return n * 2 + key.length },
  dispose: function(key, n) { n.close },
  maxAge: 1000 * 60,
}

const cache = LRU(opts)

const key1 = hash({key: 1})
const key2 = hash({key: 1})

console.log(key1, key2)

cache.set(key1, 'foo', 500)
console.log(cache.get(key2))

setTimeout(() => {
  console.log(cache.has(key2))
  console.log(cache.get(key2))
}, 600)

