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
function eventLoop(env) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, queue, lock, loop, logger = logger_1.nullLogger } = env;
        logger.debug(`actor`, `try-to-lock`, id);
        if (!(yield lock.tryAcquire(id))) {
            logger.debug(`actor`, `cannot-lock`, id);
            return false;
        }
        const poll = () => __awaiter(this, void 0, void 0, function* () {
            const messages = yield queue.flush(id);
            logger.debug(`actor`, `poll-messages`, id, messages.length);
            return messages.map(message => message.item);
        });
        logger.debug(`actor`, `start-loop`, id);
        yield loop(poll);
        logger.debug(`actor`, `release-lock`, id);
        yield lock.release(id);
        return true;
    });
}
exports.default = eventLoop;
//# sourceMappingURL=eventLoop.js.map