"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codec_1 = require("@yingyeothon/codec");
const logger_1 = require("@yingyeothon/logger");
const rpush_1 = require("@yingyeothon/naive-redis/lib/rpush");
function push({ connection, keyPrefix = "", codec = new codec_1.JsonCodec(), logger = logger_1.nullLogger }) {
    return {
        push: (actorId, item) => {
            const redisKey = keyPrefix + actorId;
            return rpush_1.default(connection, redisKey, codec.encode(item)).then(pushed => {
                logger.debug(`redis-queue`, `push`, redisKey, item, pushed);
            });
        }
    };
}
exports.default = push;
//# sourceMappingURL=push.js.map