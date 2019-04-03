"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const path = require("path");
const accessible_1 = require("../utils/accessible");
async function default_1(app) {
    const ctxRegisterPath = path.resolve(app.$config.server, 'ctx-registers');
    if (!accessible_1.default(ctxRegisterPath)) {
        console.warn(`${ctxRegisterPath} error.`);
        return;
    }
    const pkgPath = path.resolve(ctxRegisterPath, '$pkges.js');
    if (accessible_1.default(pkgPath)) {
        const pkges = await Promise.resolve().then(() => require(pkgPath));
        Object.keys(pkges).forEach(async (key) => app.context[key] = new (await Promise.resolve().then(() => require(pkges[key]))).default(app));
    }
    glob_1.sync('**/*.js', { cwd: ctxRegisterPath, dot: false })
        .filter(f => !f.startsWith('$'))
        .forEach(async (f) => app.context[f.replace(/\.\w+$/, '')] = new (await Promise.resolve().then(() => require(path.resolve(ctxRegisterPath, f)))).default(app));
}
exports.default = default_1;
//# sourceMappingURL=ctx-registers.js.map