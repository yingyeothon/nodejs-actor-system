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
const uuid_1 = require("uuid");
const message_1 = require("./message");
exports.enqueue = (env, input) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, queue, logger = logger_1.nullLogger } = env;
    const message = {
        messageId: input.messageId || uuid_1.v4(),
        awaitPolicy: input.awaitPolicy || message_1.AwaitPolicy.Forget,
        item: input.item,
        awaitTimeoutMillis: input.awaitTimeoutMillis || 0
    };
    yield queue.push(id, message);
    logger.debug(`actor`, `enqueue`, id, message);
    return message;
});
//# sourceMappingURL=enqueue.js.map