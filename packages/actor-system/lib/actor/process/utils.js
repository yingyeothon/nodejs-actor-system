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
exports.copyAwaiterMeta = exports.maybeAwait = void 0;
function maybeAwait(result) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!result) {
            return;
        }
        if (result instanceof Promise) {
            yield result;
        }
        if (result.constructor.name === "Promise") {
            yield result;
        }
    });
}
exports.maybeAwait = maybeAwait;
function copyAwaiterMeta(input) {
    return {
        messageId: input.messageId,
        awaitPolicy: input.awaitPolicy,
        awaitTimeoutMillis: input.awaitTimeoutMillis,
    };
}
exports.copyAwaiterMeta = copyAwaiterMeta;
//# sourceMappingURL=utils.js.map