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
const Actor = require("@yingyeothon/actor-system");
const logger_1 = require("@yingyeothon/logger");
const defaultAPIProxyFunctionTimeoutMillis = 6 * 1000;
exports.handleActorAPIEvent = ({ newActorEnv, parseMessage: maybeParseMessage, functionTimeout, logger: maybeLogger, mode = "send", awaitPolicy = Actor.AwaitPolicy.Forget }) => (event) => __awaiter(this, void 0, void 0, function* () {
    const parseMessage = maybeParseMessage || ((body) => JSON.parse(body));
    const logger = maybeLogger || new logger_1.ConsoleLogger();
    logger.debug(`actor-api-handler`, `handle`, event.path, event.body);
    const actorEnv = newActorEnv(event.path, event);
    if (!actorEnv) {
        logger.error(`actor-api-handler`, `no-actor-env`, event);
        throw new Error(`No actor env for [${event.path}]`);
    }
    const message = parseMessage(event.body);
    if (!message) {
        logger.error(`actor-api-handler`, `invalid-message`, actorEnv.id, event.path, event.body);
        throw new Error(`Invalid message for actor[${actorEnv.id}]`);
    }
    logger.debug(`actor-api-handler`, `post-and-process`, actorEnv.id, message);
    const timeoutMillis = functionTimeout !== undefined
        ? functionTimeout
        : defaultAPIProxyFunctionTimeoutMillis;
    let processed;
    switch (mode) {
        case "send":
            processed = yield Actor.send(actorEnv, { item: message, awaitPolicy }, { shiftTimeout: timeoutMillis });
            break;
        case "post":
            processed = yield Actor.post(actorEnv, { item: message, awaitPolicy });
            break;
    }
    logger.debug(`actor-api-handler`, `end-of-handle`, actorEnv.id, processed);
    return { statusCode: 200, body: "OK" };
});
//# sourceMappingURL=api.js.map