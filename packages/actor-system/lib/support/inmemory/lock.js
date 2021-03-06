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
class InMemoryLock {
    constructor() {
        this.lockHolders = new Set();
    }
    tryAcquire(actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.lockHolders.has(actorId)) {
                return false;
            }
            this.lockHolders.add(actorId);
            return true;
        });
    }
    release(actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.lockHolders.delete(actorId);
        });
    }
}
exports.default = InMemoryLock;
//# sourceMappingURL=lock.js.map