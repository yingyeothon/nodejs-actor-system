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
const awaiter_1 = require("../awaiter");
const message_1 = require("../message");
const bulk_1 = require("./bulk");
const single_1 = require("./single");
const utils_1 = require("./utils");
exports.tryToProcess = (env, { shiftTimeout } = {}) => __awaiter(this, void 0, void 0, function* () {
    const startMillis = Date.now();
    const isAlive = () => shiftTimeout > 0 ? Date.now() - startMillis < shiftTimeout : true;
    return exports.processLoop(env, isAlive);
});
exports.processLoop = (env, isAlive) => __awaiter(this, void 0, void 0, function* () {
    const { id, queue, lock, logger = logger_1.nullLogger, shift } = env;
    const messageMetas = [];
    logger.debug(`actor`, `consume-loop`, id);
    while (true) {
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
        if (!isAlive()) {
            logger.debug(`actor`, `shift-timeout`, id);
            if (shift) {
                yield utils_1.maybeAwait(shift(id));
            }
            break;
        }
    }
    return messageMetas;
});
//# sourceMappingURL=process.js.map