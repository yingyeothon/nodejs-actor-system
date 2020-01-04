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
class InMemoryAwaiter {
    constructor() {
        this.resolvers = {};
    }
    wait(actorId, messageId, timeoutMillis) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = actorId + messageId;
            return new Promise(resolve => {
                this.resolvers[id] = resolve;
                if (timeoutMillis > 0) {
                    setTimeout(() => this.finish(id, false), timeoutMillis);
                }
            });
        });
    }
    resolve(actorId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.finish(actorId + messageId, true);
        });
    }
    finish(id, result) {
        const resolver = this.resolvers[id];
        if (!resolver) {
            return;
        }
        resolver(result);
        delete this.resolvers[id];
    }
}
exports.default = InMemoryAwaiter;
//# sourceMappingURL=awaiter.js.map