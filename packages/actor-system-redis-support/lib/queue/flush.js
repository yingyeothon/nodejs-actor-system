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
const codec_1 = require("@yingyeothon/codec");
const logger_1 = require("@yingyeothon/logger");
const lrange_1 = require("@yingyeothon/naive-redis/lib/lrange");
const ltrim_1 = require("@yingyeothon/naive-redis/lib/ltrim");
function flush({ connection, keyPrefix = "", codec = new codec_1.JsonCodec(), logger = logger_1.nullLogger, }) {
    return {
        flush: (actorId) => __awaiter(this, void 0, void 0, function* () {
            const redisKey = keyPrefix + actorId;
            const values = yield (0, lrange_1.default)(connection, redisKey, 0, -1);
            if (!values || values.length === 0) {
                logger.debug(`redis-queue`, `flush`, redisKey, `empty`);
                return [];
            }
            const decoded = values.map((value) => codec.decode(value));
            logger.debug(`redis-queue`, `flush`, redisKey, decoded);
            yield (0, ltrim_1.default)(connection, redisKey, values.length, -1);
            return decoded;
        }),
    };
}
exports.default = flush;
//# sourceMappingURL=flush.js.map