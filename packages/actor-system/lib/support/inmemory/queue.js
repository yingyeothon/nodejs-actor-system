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
class InMemoryQueue {
    constructor() {
        this.queues = {};
    }
    size(actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.queues[actorId] ? this.queues[actorId].length : 0;
        });
    }
    push(actorId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queues[actorId]) {
                this.queues[actorId] = [];
            }
            this.queues[actorId].push(item);
        });
    }
    pop(actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queues[actorId] || this.queues[actorId].length === 0) {
                return null;
            }
            return this.queues[actorId].shift();
        });
    }
    peek(actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queues[actorId] || this.queues[actorId].length === 0) {
                return null;
            }
            return this.queues[actorId][0];
        });
    }
    flush(actorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queues[actorId] || this.queues[actorId].length === 0) {
                return [];
            }
            const elements = [...this.queues[actorId]];
            delete this.queues[actorId];
            return elements;
        });
    }
}
exports.InMemoryQueue = InMemoryQueue;
//# sourceMappingURL=queue.js.map