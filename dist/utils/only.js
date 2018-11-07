"use strict";
// @see https://github.com/tj/node-only/blob/master/index.js
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(obj, keys) {
    obj = obj || {};
    if ('string' === typeof keys) {
        keys = keys.split(/ +/);
    }
    return keys.reduce((ret, key) => {
        if (null === obj[key]) {
            return ret;
        }
        ret[key] = obj[key];
        return ret;
    }, {});
}
exports.default = default_1;
//# sourceMappingURL=only.js.map