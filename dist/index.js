"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const only_1 = require("./utils/only");
const ctx_registers_1 = require("./recipes/ctx-registers");
class App extends Koa {
    constructor(config, run) {
        super();
        this.context.$config = this.$config = config;
        Promise.resolve(this).then(async (app) => {
            await ctx_registers_1.default(app);
            run && run();
        }).catch(console.warn);
        this.context.$views = this.$views = {};
        this.context.$routes = this.$routes = {};
        this.context.$ds = this.$ds = {};
        this.context.$middlewares = this.$middlewares = {};
        this.context.$bundles = this.$bundles = {};
    }
    toJSON() {
        return only_1.default(this, [
            '$config',
            '$views',
            '$routes',
            '$ds',
            '$middlewares',
            '$bundles',
            'subdomainOffset', 'proxy', 'env'
        ]);
    }
    start() {
        console.log('start');
    }
}
exports.default = App;
//# sourceMappingURL=index.js.map