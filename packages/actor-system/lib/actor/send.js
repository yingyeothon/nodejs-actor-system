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
const awaiter_1 = require("./awaiter");
const enqueue_1 = require("./enqueue");
const process_1 = require("./process");
exports.send = (env, input, options = {}) => __awaiter(this, void 0, void 0, function* () {
    const message = yield enqueue_1.enqueue(env, input);
    return awaiter_1.awaitMessageAfterTryToProcess(env, message, () => process_1.tryToProcess(env, options));
});
//# sourceMappingURL=send.js.map