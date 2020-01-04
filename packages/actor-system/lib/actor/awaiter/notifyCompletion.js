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
function notifyCompletion(env, meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, logger = logger_1.nullLogger, awaiter } = env;
        try {
            logger.debug(`actor`, `awaiter-resolve`, id, meta.messageId);
            yield awaiter.resolve(id, meta.messageId);
        }
        catch (error) {
            logger.error(`actor`, `awaiter-resolve-error`, id, error);
        }
    });
}
exports.default = notifyCompletion;
//# sourceMappingURL=notifyCompletion.js.map