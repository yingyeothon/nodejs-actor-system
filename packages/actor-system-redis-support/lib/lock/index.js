"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisLock = void 0;
const release_1 = require("./release");
const acquire_1 = require("./acquire");
class RedisLock {
    constructor(args) {
        const awaiter = Object.assign(Object.assign({}, (0, acquire_1.default)(args)), (0, release_1.default)(args));
        for (const key of Object.keys(awaiter)) {
            this[key] = awaiter[key];
        }
    }
}
exports.RedisLock = RedisLock;
//# sourceMappingURL=index.js.map