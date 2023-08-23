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
const process_1 = require("./process");
const awaitMessageAfterTryToProcess_1 = require("./awaiter/awaitMessageAfterTryToProcess");
function send(env, input, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = yield (0, enqueue_1.default)(env, input);
        return (0, awaitMessageAfterTryToProcess_1.default)(env, message, () => (0, process_1.default)(env, options));
    });
}
exports.default = send;
//# sourceMappingURL=send.js.map