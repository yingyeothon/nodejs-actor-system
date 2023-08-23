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
const basis_1 = require("./basis");
const get_1 = require("@yingyeothon/naive-redis/lib/get");
const SleepIntervalMillisForAwaiting = 50;
const sleep = (millis) => new Promise((resolve) => setTimeout(resolve, millis));
function wait({ connection, keyPrefix = "", logger = logger_1.nullLogger, }) {
    return {
        wait: (actorId, messageId, timeoutMillis) => __awaiter(this, void 0, void 0, function* () {
            logger.debug(`redis-awaiter`, `wait`, messageId, timeoutMillis);
            if (timeoutMillis <= 0) {
                return false;
            }
            const redisKey = (0, basis_1.asRedisKey)(keyPrefix, actorId, messageId);
            const start = Date.now();
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let remainMillis = 0;
                    do {
                        const value = yield (0, get_1.default)(connection, redisKey);
                        remainMillis = start + timeoutMillis - Date.now();
                        logger.debug(`redis-awaiter`, `wait`, redisKey, value, remainMillis);
                        if (value === basis_1.Resolved) {
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
        }),
    };
}
exports.default = wait;
//# sourceMappingURL=wait.js.map