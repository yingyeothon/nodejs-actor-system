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
const bulk_1 = require("./bulk");
const single_1 = require("./single");
exports.processLoop = (env, isAlive) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, queue, lock, logger = logger_1.nullLogger } = env;
    const messageMetas = [];
    logger.debug(`actor`, `process-loop`, id);
    while (isAlive()) {
        logger.debug(`actor`, `try-to-lock`, id);
        if (!(yield lock.tryAcquire(id))) {
            logger.debug(`actor`, `cannot-lock`, id);
            break;
        }
        let localMetas = [];
        switch (env._consume) {
            case "single":
                localMetas = yield single_1.processInSingleMode(env, isAlive);
                break;
            case "bulk":
                localMetas = yield bulk_1.processInBulkMode(env, isAlive);
                break;
        }
        Array.prototype.push.apply(messageMetas, localMetas);
        logger.debug(`actor`, `release-lock`, id);
        yield lock.release(id);
        yield awaiter_1.notifyCompletions(env, messageMetas.filter(meta => meta.awaitPolicy === message_1.AwaitPolicy.Commit));
        if ((yield queue.size(id)) === 0) {
            logger.debug(`actor`, `empty-queue`, id);
            break;
        }
    }
    return messageMetas;
});
//# sourceMappingURL=loop.js.map