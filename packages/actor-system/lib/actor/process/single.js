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
const awaiter_1 = require("../awaiter");
const message_1 = require("../message");
const utils_1 = require("./utils");
exports.processInSingleMode = (env, isAlive) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, onPrepare, onCommit } = env;
    if (onPrepare) {
        yield utils_1.maybeAwait(onPrepare(id));
    }
    const localMetas = yield processQueueInLock(env, isAlive);
    if (onCommit) {
        yield utils_1.maybeAwait(onCommit(id));
    }
    return localMetas;
});
const processQueueInLock = (env, isAlive) => __awaiter(void 0, void 0, void 0, function* () {
    const { queue, id, logger = logger_1.nullLogger } = env;
    logger.debug(`actor`, `consume-queue`, id);
    const messageMetas = [];
    const notifyPromises = [];
    while (isAlive() && (yield queue.size(id)) > 0) {
        const message = yield queue.peek(id);
        logger.debug(`actor`, `get-message`, id, message);
        if (!message) {
            logger.debug(`actor`, `invalid-message`, id, message);
            break;
        }
        yield processMessage(env, message);
        messageMetas.push(utils_1.copyAwaiterMeta(message));
        if (message.awaitPolicy === message_1.AwaitPolicy.Act) {
            notifyPromises.push(awaiter_1.notifyCompletion(env, message));
        }
        yield queue.pop(id);
        logger.debug(`actor`, `delete-message`, id);
    }
    yield Promise.all(notifyPromises);
    return messageMetas;
});
const processMessage = (env, message) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, logger = logger_1.nullLogger, onMessage, onError } = env;
    try {
        logger.debug(`actor`, `process-user-message`, id, message);
        yield utils_1.maybeAwait(onMessage(message.item));
    }
    catch (error) {
        logger.error(`actor`, `process-user-message-error`, id, message, error);
        if (onError) {
            yield utils_1.maybeAwait(onError(error));
        }
    }
});
//# sourceMappingURL=single.js.map