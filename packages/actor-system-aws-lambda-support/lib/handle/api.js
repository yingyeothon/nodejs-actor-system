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
const logger_1 = require("@yingyeothon/logger");
const defaultAPIProxyFunctionTimeoutMillis = 5 * 1000;
exports.handleActorAPIEvent = ({ newActorEnv, parseMessage: maybeParseMessage, logger: maybeLogger, policy }) => (event) => __awaiter(void 0, void 0, void 0, function* () {
    const parseMessage = maybeParseMessage || ((body) => JSON.parse(body));
    const logger = maybeLogger || logger_1.nullLogger;
    logger.debug(`actor-api-handler`, `handle`, event.path, event.body);
    const actorEnv = newActorEnv(event.path, event);
    if (!actorEnv) {
        logger.error(`actor-api-handler`, `no-actor-env`, event);
        throw new Error(`No actor env for [${event.path}]`);
    }
    if (!event.body) {
        logger.error(`actor-api-handler`, `no-actor-message`, event);
        throw new Error(`No message body for [${event.path}]`);
    }
    const message = parseMessage(event.body);
    if (!message) {
        logger.error(`actor-api-handler`, `invalid-message`, actorEnv.id, event.path, event.body);
        throw new Error(`Invalid message for actor[${actorEnv.id}]`);
    }
    logger.debug(`actor-api-handler`, `post-and-process`, actorEnv.id, message);
    let processed;
    switch (policy.type) {
        case "send":
            processed = yield Actor.send(actorEnv, Object.assign(Object.assign({}, (policy.messageMeta || {})), { item: message }), prepareProcessOptions(policy.processOptions));
            break;
        case "post":
            processed = yield Actor.post(actorEnv, Object.assign(Object.assign({}, (policy.messageMeta || {})), { item: message }));
            break;
    }
    logger.debug(`actor-api-handler`, `end-of-handle`, actorEnv.id, processed);
    return { statusCode: 200, body: "OK" };
});
const prepareProcessOptions = (options) => {
    var _a, _b, _c;
    return options
        ? {
            aliveMillis: (_a = options.aliveMillis, (_a !== null && _a !== void 0 ? _a : defaultAPIProxyFunctionTimeoutMillis)),
            oneShot: (_b = options.oneShot, (_b !== null && _b !== void 0 ? _b : true)),
            shiftable: (_c = options.shiftable, (_c !== null && _c !== void 0 ? _c : true))
        }
        : {
            aliveMillis: defaultAPIProxyFunctionTimeoutMillis,
            oneShot: true,
            shiftable: true
        };
};
//# sourceMappingURL=api.js.map