"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@yingyeothon/logger");
const message_1 = require("./message");
exports.notifyCompletion = (env, meta) => __awaiter(this, void 0, void 0, function* () {
    const { id, logger = logger_1.nullLogger, awaiter } = env;
    try {
        logger.debug(`actor`, `awaiter-resolve`, id, meta.messageId);
        yield awaiter.resolve(id, meta.messageId);
    }
    catch (error) {
        logger.error(`actor`, `awaiter-resolve-error`, id, error);
    }
});
exports.notifyCompletions = (env, metas) => __awaiter(this, void 0, void 0, function* () {
    const { id, logger = logger_1.nullLogger, awaiter } = env;
    try {
        const targetIds = metas.map(({ messageId }) => messageId);
        logger.debug(`actor`, `awaiter-resolve`, id, targetIds);
        if (targetIds.length === 0) {
            return;
        }
        yield Promise.all(targetIds.map(messageId => awaiter.resolve(id, messageId)));
    }
    catch (error) {
        logger.error(`actor`, `awaiter-resolve-error`, id, error);
    }
});
exports.awaitMessage = (env, messageId, awaitTimeoutMillis) => __awaiter(this, void 0, void 0, function* () {
    const { id, awaiter, logger = logger_1.nullLogger } = env;
    logger.debug(`actor`, `await-message`, id, messageId, awaitTimeoutMillis);
    return awaiter.wait(id, messageId, awaitTimeoutMillis);
});
exports.awaitMessageAfterTryToProcess = (env, currentMeta, tryToProcess) => __awaiter(this, void 0, void 0, function* () {
    const resolvedMetas = yield tryToProcess();
    if (currentMeta.awaitPolicy === message_1.AwaitPolicy.Forget) {
        return true;
    }
    if (resolvedMetas.some(meta => meta.messageId === currentMeta.messageId)) {
        return true;
    }
    return exports.awaitMessage(env, currentMeta.messageId, currentMeta.awaitTimeoutMillis);
});
//# sourceMappingURL=awaiter.js.map