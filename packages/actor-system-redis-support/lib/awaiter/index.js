"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisAwaiter = void 0;
const resolve_1 = require("./resolve");
const wait_1 = require("./wait");
class RedisAwaiter {
    constructor(args) {
        const awaiter = Object.assign(Object.assign({}, (0, wait_1.default)(args)), (0, resolve_1.default)(args));
        for (const key of Object.keys(awaiter)) {
            this[key] = awaiter[key];
        }
    }
}
exports.RedisAwaiter = RedisAwaiter;
//# sourceMappingURL=index.js.map