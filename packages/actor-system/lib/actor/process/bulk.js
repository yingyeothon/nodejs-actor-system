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
const utils_1 = require("./utils");
const awaitPolicy_1 = require("../message/awaitPolicy");
const notifyCompletions_1 = require("../awaiter/notifyCompletions");
const logger_1 = require("@yingyeothon/logger");
function processInBulkMode(env, isAlive) {
    return __awaiter(this, void 0, void 0, function* () {
        const { queue, id, logger = logger_1.nullLogger, onMessages, onError } = env;
        logger.debug(`actor`, `process-queue-in-bulk`, id);
        const messageMetas = [];
        while (isAlive()) {
            const messages = yield queue.flush(id);
            logger.debug(`actor`, `get-messages`, id, messages.length);
            if (messages.length === 0) {
                break;
            }
            try {
                logger.debug(`actor`, `process-messages`, id, messages);
                yield (0, utils_1.maybeAwait)(onMessages(messages.map((message) => message.item)));
            }
            catch (error) {
                logger.error(`actor`, `process-messages-error`, id, messages, error);
                if (onError) {
                    yield (0, utils_1.maybeAwait)(onError(error));
                }
            }
            for (const message of messages) {
                messageMetas.push((0, utils_1.copyAwaiterMeta)(message));
            }
            (0, notifyCompletions_1.default)(env, messageMetas.filter((meta) => meta.awaitPolicy === awaitPolicy_1.default.Act));
        }
        return messageMetas;
    });
}
exports.default = processInBulkMode;
//# sourceMappingURL=bulk.js.map