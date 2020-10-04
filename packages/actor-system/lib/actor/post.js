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
const enqueue_1 = require("./enqueue");
const awaitPolicy_1 = require("./message/awaitPolicy");
const awaitMessage_1 = require("./awaiter/awaitMessage");
function post(env, input) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = yield enqueue_1.default(env, input);
        if (message.awaitPolicy === awaitPolicy_1.default.Forget) {
            return true;
        }
        return awaitMessage_1.default(env, message.messageId, message.awaitTimeoutMillis);
    });
}
exports.default = post;
//# sourceMappingURL=post.js.map