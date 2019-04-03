"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function accessible(path) {
    try {
        fs.accessSync(path);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.default = accessible;
//# sourceMappingURL=accessible.js.map