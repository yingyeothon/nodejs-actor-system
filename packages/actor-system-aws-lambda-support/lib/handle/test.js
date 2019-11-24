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
const Actor = require("@yingyeothon/actor-system");
const InMemorySupport = require("@yingyeothon/actor-system/lib/support/inmemory");
const api_1 = require("./api");
const lambda_1 = require("./lambda");
const subsys = {
    queue: new InMemorySupport.InMemoryQueue(),
    lock: new InMemorySupport.InMemoryLock(),
    awaiter: new InMemorySupport.InMemoryAwaiter(),
    shift: lambda_1.shiftToNextLambda({
        functionName: process.env.BOTTOM_HALF_LAMBDA
    })
};
const newActor = (actorId) => Actor.newEnv(subsys)(new Adder(actorId));
const repo = {};
class Adder {
    constructor(id) {
        this.id = id;
        this.value = 0;
        this.onPrepare = () => __awaiter(this, void 0, void 0, function* () { return (this.value = (yield repo.get(`value:${this.id}`)) || 0); });
        this.onCommit = () => __awaiter(this, void 0, void 0, function* () { return repo.set(`value:${this.id}`, this.value); });
        this.onMessage = (message) => __awaiter(this, void 0, void 0, function* () {
            this.value += message.delta;
        });
    }
}
exports.sendMessage = api_1.handleActorAPIEvent({
    newActorEnv: apiPath => newActor(apiPath),
    policy: {
        type: "send",
        messageMeta: {
            awaitPolicy: Actor.AwaitPolicy.Commit,
            awaitTimeoutMillis: 5 * 1000
        },
        processOptions: {
            aliveMillis: 500,
            oneShot: true,
            shiftable: true
        }
    }
});
exports.bottomHalf = lambda_1.handleActorLambdaEvent({
    newActorEnv: ({ actorId }) => newActor(actorId),
    processOptions: {
        aliveMillis: 30 * 1000,
        oneShot: false,
        shiftable: true
    }
});
//# sourceMappingURL=test.js.map