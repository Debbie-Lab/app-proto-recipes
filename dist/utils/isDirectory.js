"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function isDirectory(dir) {
    try {
        return fs.statSync(path.resolve(dir)).isDirectory();
    }
    catch (e) {
        return false;
    }
}
exports.default = isDirectory;
//# sourceMappingURL=isDirectory.js.map