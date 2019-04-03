import Koa = require('koa')
import only from './utils/only'
import { AppConfig } from './typing/config'
import ctxRegisters from './recipes/ctx-registers'
import { runInContext } from 'vm';

export default class App extends Koa {

  public $config: AppConfig
  private $views: Object
  private $routes: Object
  private $ds: Object
  private $middlewares: Object
  private $bundles: Object

  constructor (config: AppConfig, run?: Function) {
    super()
    this.context.$config = this.$config = config

    Promise.resolve(this).then(async (app) => {
      await ctxRegisters(app)
      run && run()
    }).catch(console.warn)

    this.context.$views = this.$views = {}
    this.context.$routes = this.$routes = {}
    this.context.$ds = this.$ds = {}
    this.context.$middlewares = this.$middlewares = {}
    this.context.$bundles = this.$bundles = {}
  }

  toJSON () {
    return only(this, [
      '$config',
      '$views',
      '$routes',
      '$ds',
      '$middlewares',
      '$bundles',
      'subdomainOffset', 'proxy', 'env'])
  }

  start () {
    console.log('start')
  }
}
