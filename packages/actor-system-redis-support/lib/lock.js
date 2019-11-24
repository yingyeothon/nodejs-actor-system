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
class RedisLock {
    constructor({ redis = new IORedis(), keyPrefix = "lock:", logger = new logger_1.ConsoleLogger(), lockTimeout = -1 } = {}) {
        this.asRedisKey = (name) => this.keyPrefix + name;
        this.redis = redis;
        this.keyPrefix = keyPrefix;
        this.logger = logger;
        this.lockTimeout = lockTimeout;
    }
    tryAcquire(actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorId);
            let success = false;
            if (this.lockTimeout > 0) {
                const ok = yield this.redis.set(redisKey, RedisLock.Locked, "PX", this.lockTimeout, "NX");
                success = ok === "OK";
            }
            else {
                const one = yield this.redis.setnx(redisKey, RedisLock.Locked);
                success = one === 1;
            }
            this.logger.debug(`redis-lock`, `try-acquire`, redisKey, success);
            return success;
        });
    }
    release(actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisKey = this.asRedisKey(actorId);
            yield this.redis.del(redisKey);
            this.logger.debug(`redis-lock`, `release`, redisKey);
            return true;
        });
    }
}
exports.RedisLock = RedisLock;
RedisLock.Locked = "1";
//# sourceMappingURL=lock.js.map