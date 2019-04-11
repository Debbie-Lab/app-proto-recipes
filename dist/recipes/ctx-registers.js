"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const path = require("path");
const accessible_1 = require("../utils/accessible");
async function default_1(app) {
    const ctxRegisterPath = path.resolve(app.$config.server, 'ctx-registers');
    if (!accessible_1.default(ctxRegisterPath)) {
        console.warn(`warning → "${ctxRegisterPath}" not found.`);
        return;
    }
    const pkgPath = path.resolve(ctxRegisterPath, '$pkges.js');
    if (accessible_1.default(pkgPath)) {
        const pkges = await Promise.resolve().then(() => require(pkgPath));
        await (async () => Object.keys(pkges)
            .forEach(async (key) => app.context[key] = new (await Promise.resolve().then(() => require(pkges[key]))).default(app)))();
    }
    await (async () => glob_1.sync('**/*.js', { cwd: ctxRegisterPath, dot: false })
        .filter(f => !f.startsWith('$'))
        .forEach(async (f) => app.context[f.replace(/\.\w+$/, '')] = new (await Promise.resolve().then(() => require(path.resolve(ctxRegisterPath, f)))).default(app)))();
    console.log('app.context.debug', app.context.debug);
}
exports.default = default_1;
//# sourceMappingURL=ctx-registers.js.map