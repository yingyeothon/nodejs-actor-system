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
const awaitPolicy_1 = require("../message/awaitPolicy");
const awaitMessage_1 = require("./awaitMessage");
function awaitMessageAfterTryToProcess(env, currentMeta, tryToProcess) {
    return __awaiter(this, void 0, void 0, function* () {
        const resolvedMetas = yield tryToProcess();
        if (currentMeta.awaitPolicy === awaitPolicy_1.default.Forget) {
            return true;
        }
        if (resolvedMetas.some((meta) => meta.messageId === currentMeta.messageId)) {
            return true;
        }
        return awaitMessage_1.default(env, currentMeta.messageId, currentMeta.awaitTimeoutMillis);
    });
}
exports.default = awaitMessageAfterTryToProcess;
//# sourceMappingURL=awaitMessageAfterTryToProcess.js.map