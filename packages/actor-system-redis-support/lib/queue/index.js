"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flush_1 = require("./flush");
const pop_1 = require("./pop");
const push_1 = require("./push");
const size_1 = require("./size");
class RedisQueue {
    constructor(args) {
        const queue = Object.assign(Object.assign(Object.assign(Object.assign({}, size_1.default(args)), pop_1.default(args)), push_1.default(args)), flush_1.default(args));
        for (const key of Object.keys(queue)) {
            this[key] = queue[key];
        }
    }
}
exports.RedisQueue = RedisQueue;
//# sourceMappingURL=index.js.map