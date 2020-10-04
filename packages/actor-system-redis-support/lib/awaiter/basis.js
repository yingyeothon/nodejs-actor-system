"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asRedisKey = exports.Resolved = void 0;
exports.Resolved = "1";
function asRedisKey(keyPrefix, actorId, messageId) {
    return `${keyPrefix}${actorId}/${messageId}`;
}
exports.asRedisKey = asRedisKey;
//# sourceMappingURL=basis.js.map