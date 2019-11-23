"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const IORedis = require("ioredis");
const awaiter_1 = require("./awaiter");
const lock_1 = require("./lock");
const queue_1 = require("./queue");
exports.newRedisSubsystem = ({ redis = new IORedis(), keyPrefix = "", logger = logger_1.nullLogger }) => ({
    queue: new queue_1.RedisQueue({ redis, keyPrefix: keyPrefix + "queue:", logger }),
    lock: new lock_1.RedisLock({ redis, keyPrefix: keyPrefix + "lock:", logger }),
    awaiter: new awaiter_1.RedisAwaiter({
        redis,
        keyPrefix: keyPrefix + "awaiter:",
        logger
    })
});
//# sourceMappingURL=actor.js.map