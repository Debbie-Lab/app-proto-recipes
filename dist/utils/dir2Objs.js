"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = require("glob");
const path_1 = require("path");
/**
 *
 * @param dir
 * @param blacklist
 */
function dir2Objs(dir, blacklist = []) {
    const blacklistSet = new Set(blacklist);
    const objs = {};
    glob_1.sync('**/*.js', { cwd: dir, dot: false })
        .filter(file => !blacklistSet.has(file))
        .forEach(async (file) => objs[file.replace(/\.\w+$/, '')] = await Promise.resolve().then(() => require(path_1.join(dir, file))));
    return objs;
}
exports.default = dir2Objs;
//# sourceMappingURL=dir2Objs.js.map