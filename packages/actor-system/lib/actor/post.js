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
const awaiter_1 = require("./awaiter");
const enqueue_1 = require("./enqueue");
const message_1 = require("./message");
exports.post = (env, input) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield enqueue_1.enqueue(env, input);
    if (message.awaitPolicy === message_1.AwaitPolicy.Forget) {
        return true;
    }
    return awaiter_1.awaitMessage(env, message.messageId, message.awaitTimeoutMillis);
});
//# sourceMappingURL=post.js.map