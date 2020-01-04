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
const llen_1 = require("@yingyeothon/naive-redis/lib/llen");
function size({ connection, keyPrefix = "", logger = logger_1.nullLogger }) {
    return {
        size: (actorId) => __awaiter(this, void 0, void 0, function* () {
            const redisKey = keyPrefix + actorId;
            const length = yield llen_1.default(connection, redisKey);
            logger.debug(`redis-queue`, `size`, redisKey, length);
            return length;
        })
    };
}
exports.default = size;
//# sourceMappingURL=size.js.map