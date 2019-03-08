import Koa = require('koa')
import only from './utils/only'
import { AppConfig } from './typing/config'

export default class App extends Koa {

  constructor (config: AppConfig) {
    super()
    this.context.$config = config
    // this.$tpls
    // this.$routes
    // this.$ds
    // this.$middlewares
    // this.$bundles
  }

  toJSON () {
    return only(this, ['$config', 'subdomainOffset', 'proxy', 'env'])
  }
}
