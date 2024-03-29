"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisQueue = void 0;
const flush_1 = require("./flush");
const pop_1 = require("./pop");
const push_1 = require("./push");
const size_1 = require("./size");
class RedisQueue {
    constructor(args) {
        const queue = Object.assign(Object.assign(Object.assign(Object.assign({}, (0, size_1.default)(args)), (0, pop_1.default)(args)), (0, push_1.default)(args)), (0, flush_1.default)(args));
        for (const key of Object.keys(queue)) {
            this[key] = queue[key];
        }
    }
}
exports.RedisQueue = RedisQueue;
//# sourceMappingURL=index.js.map