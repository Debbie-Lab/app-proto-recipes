"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const path = require("path");
const accessible_1 = require("../utils/accessible");
async function default_1(app) {
    const middlewaresPath = path.resolve(app.$config.server, 'middlewares');
    if (!accessible_1.default(middlewaresPath)) {
        console.warn(`warning → "${middlewaresPath}" not found.`);
        return;
    }
    const middlewares = {};
    const pkgPath = path.resolve(middlewaresPath, '$pkges.js');
    if (accessible_1.default(pkgPath)) {
        const pkges = await Promise.resolve().then(() => require(pkgPath));
        await (async () => Object.keys(pkges)
            .forEach(async (key) => middlewares[key] = await Promise.resolve().then(() => require(pkges[key]))))();
    }
    await (async () => glob_1.sync('**/*.js', { cwd: middlewaresPath, dot: false })
        .filter(f => !f.startsWith('$'))
        .forEach(async (f) => middlewares[f.replace(/\.\w+$/, '')] = await Promise.resolve().then(() => require(path.resolve(middlewaresPath, f)))))();
    app.context['$middlewares'] = middlewares;
}
exports.default = default_1;
//# sourceMappingURL=middlewares.js.map