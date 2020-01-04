"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acquire_1 = require("./acquire");
const release_1 = require("./release");
class RedisLock {
    constructor(args) {
        const awaiter = Object.assign(Object.assign({}, acquire_1.default(args)), release_1.default(args));
        for (const key of Object.keys(awaiter)) {
            this[key] = awaiter[key];
        }
    }
}
exports.RedisLock = RedisLock;
//# sourceMappingURL=index.js.map