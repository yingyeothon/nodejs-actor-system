"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const IORedis = require("ioredis");
const sleep = (millis) => new Promise(resolve => setTimeout(resolve, millis));
const Resolved = "1";
const TimeoutMillisForResolved = 1000;
const SleepIntervalMillisForAwaiting = 50;
class RedisAwaiter {
    constructor({ redis, keyPrefix, logger } = {}) {
        this.redis = redis || new IORedis();
        this.keyPrefix = keyPrefix || "awaiter:";
        this.logger = logger || new logger_1.ConsoleLogger();
    }
    wait(actorId, messageId, timeoutMillis) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug(`redis-awaiter`, `wait`, messageId, timeoutMillis);
            if (timeoutMillis <= 0) {
                return false;
            }
            const redisKey = this.asRedisKey(actorId, messageId);
            const start = Date.now();
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let remainMillis = 0;
                    do {
                        const value = yield this.redis.get(redisKey);
                        remainMillis = start + timeoutMillis - Date.now();
                        this.logger.debug(`redis-awaiter`, `wait`, redisKey, value, remainMillis);
                        if (value === Resolved) {
                            return resolve(true);
                        }
                        yield sleep(Math.min(SleepIntervalMillisForAwaiting, remainMillis));
                    } while (remainMillis > 0);
                    return resolve(false);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    resolve(actorId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorId, messageId);
            try {
                yield this.redis.setex(redisKey, TimeoutMillisForResolved, Resolved);
                this.logger.debug(`redis-awaiter`, `resolve`, redisKey);
            }
            catch (error) {
                this.logger.debug(`redis-awaiter`, `resolve`, redisKey, `error`, error);
            }
        });
    }
    asRedisKey(actorId, messageId) {
        return this.keyPrefix + actorId + "/" + messageId;
    }
}
exports.RedisAwaiter = RedisAwaiter;
//# sourceMappingURL=awaiter.js.map