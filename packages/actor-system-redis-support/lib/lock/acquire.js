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
const set_1 = require("@yingyeothon/naive-redis/lib/set");
const locked = "1";
function tryAcquire({ connection, keyPrefix, logger = logger_1.nullLogger, lockTimeout = -1 }) {
    return {
        tryAcquire: (actorId) => __awaiter(this, void 0, void 0, function* () {
            const redisKey = keyPrefix + actorId;
            const success = yield set_1.default(connection, redisKey, locked, {
                expirationMillis: lockTimeout > 0 ? lockTimeout : undefined,
                onlySet: "nx"
            });
            logger.debug(`redis-lock`, `try-acquire`, redisKey, success);
            return success;
        })
    };
}
exports.default = tryAcquire;
//# sourceMappingURL=acquire.js.map