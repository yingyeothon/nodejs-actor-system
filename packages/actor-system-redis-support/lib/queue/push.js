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
const rpush_1 = require("@yingyeothon/naive-redis/lib/rpush");
function push({ connection, keyPrefix = "", codec = new codec_1.JsonCodec(), logger = logger_1.nullLogger, }) {
    return {
        push: function (actorId, item) {
            return __awaiter(this, void 0, void 0, function* () {
                const redisKey = keyPrefix + actorId;
                const pushed = yield rpush_1.default(connection, redisKey, codec.encode(item));
                logger.debug(`redis-queue`, `push`, redisKey, item, pushed);
            });
        },
    };
}
exports.default = push;
//# sourceMappingURL=push.js.map