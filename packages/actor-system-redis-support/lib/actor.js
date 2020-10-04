"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRedisSubsystem = void 0;
const logger_1 = require("@yingyeothon/logger");
const awaiter_1 = require("./awaiter");
const lock_1 = require("./lock");
const queue_1 = require("./queue");
function newRedisSubsystem({ connection, keyPrefix = "", logger = logger_1.nullLogger, }) {
    return {
        queue: new queue_1.RedisQueue({
            connection,
            keyPrefix: keyPrefix + "queue:",
            logger,
        }),
        lock: new lock_1.RedisLock({ connection, keyPrefix: keyPrefix + "lock:", logger }),
        awaiter: new awaiter_1.RedisAwaiter({
            connection,
            keyPrefix: keyPrefix + "awaiter:",
            logger,
        }),
    };
}
exports.newRedisSubsystem = newRedisSubsystem;
//# sourceMappingURL=actor.js.map