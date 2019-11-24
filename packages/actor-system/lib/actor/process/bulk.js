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
exports.processInBulkMode = (env, isAlive) => __awaiter(void 0, void 0, void 0, function* () {
    const { queue, id, logger = logger_1.nullLogger, onMessages } = env;
    logger.debug(`actor`, `consume-queue`, id);
    const messageMetas = [];
    while (isAlive()) {
        const messages = yield queue.flush(id);
        logger.debug(`actor`, `get-messages`, id, messages.length);
        if (messages.length === 0) {
            break;
        }
        yield utils_1.maybeAwait(onMessages(messages.map(message => message.item)));
        for (const message of messages) {
            messageMetas.push(utils_1.copyAwaiterMeta(message));
        }
        awaiter_1.notifyCompletions(env, messageMetas.filter(meta => meta.awaitPolicy === message_1.AwaitPolicy.Act));
    }
    return messageMetas;
});
//# sourceMappingURL=bulk.js.map