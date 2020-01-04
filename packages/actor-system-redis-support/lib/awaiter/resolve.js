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
const basis_1 = require("./basis");
const TimeoutMillisForResolved = 1000;
function resolve({ connection, keyPrefix = "", logger = logger_1.nullLogger }) {
    return {
        resolve: (actorId, messageId) => __awaiter(this, void 0, void 0, function* () {
            const redisKey = basis_1.asRedisKey(keyPrefix, actorId, messageId);
            try {
                const success = yield set_1.default(connection, redisKey, basis_1.Resolved, {
                    expirationMillis: TimeoutMillisForResolved
                });
                logger.debug(`redis-awaiter`, `resolve`, redisKey, success);
            }
            catch (error) {
                logger.debug(`redis-awaiter`, `resolve`, redisKey, `error`, error);
            }
        })
    };
}
exports.default = resolve;
//# sourceMappingURL=resolve.js.map