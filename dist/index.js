"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const only_1 = require("./utils/only");
class App extends Koa {
    constructor(config) {
        super();
        this.ctx = this.context;
        this.ctx['$config'] = config;
        // this.$tpls
        // this.$routes
        // this.$ds
        // this.$middlewares
        // this.$bundles
    }
    // createContext (req: IncomingMessage, res: ServerResponse): Koa.Context {
    //   const context = Object.create(this.ctx)
    //   const request = context.request = Object.create(this.request)
    //   const response = context.response = Object.create(this.response)
    //   context.app = request.app = response.app = this
    //   context.req = request.req = response.req = req
    //   context.res = request.res = response.res = res
    //   request.ctx = response.ctx = context
    //   request.response = response
    //   response.request = request
    //   context.originalUrl = request.originalUrl = req.url
    //   context.state = {}
    //   context.$data = {}
    //   return context
    // }
    toJSON() {
        return only_1.default(this, ['$config', 'subdomainOffset', 'proxy', 'env']);
    }
}
exports.default = App;
//# sourceMappingURL=index.js.map