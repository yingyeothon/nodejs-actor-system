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
function notifyCompletions(env, metas) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, logger = logger_1.nullLogger, awaiter } = env;
        try {
            const targetIds = metas.map(({ messageId }) => messageId);
            logger.debug(`actor`, `awaiter-resolve`, id, targetIds);
            if (targetIds.length === 0) {
                return;
            }
            yield Promise.all(targetIds.map((messageId) => awaiter.resolve(id, messageId)));
        }
        catch (error) {
            logger.error(`actor`, `awaiter-resolve-error`, id, error);
        }
    });
}
exports.default = notifyCompletions;
//# sourceMappingURL=notifyCompletions.js.map