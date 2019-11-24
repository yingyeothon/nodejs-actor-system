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
const aws_sdk_1 = require("aws-sdk");
const time_1 = require("./time");
const defaultLambdaFunctionTimeoutMillis = 14 * 60 * 1000;
exports.handleActorLambdaEvent = ({ newActorEnv, functionTimeout = defaultLambdaFunctionTimeoutMillis, logger: maybeLogger, aliveMode = "tryToProcess" }) => (event) => __awaiter(void 0, void 0, void 0, function* () {
    time_1.globalTimeline.reset(functionTimeout);
    const logger = maybeLogger || new logger_1.ConsoleLogger();
    logger.debug(`actor-lambda`, `handle`, aliveMode, event);
    const env = newActorEnv(event);
    if (!env) {
        throw new Error(`No actor env [${event}]`);
    }
    switch (aliveMode) {
        case "tryToProcess":
            yield Actor.tryToProcess(env, {
                shiftTimeout: time_1.globalTimeline.remainMillis
            });
            break;
        case "consumeUntil":
            yield Actor.consumeUntil(env, {
                untilMillis: time_1.globalTimeline.remainMillis
            });
            break;
    }
    logger.debug(`actor-lambda`, `end-of-handle`, aliveMode, event);
});
exports.shiftToNextLambda = ({ functionName, functionVersion, buildPayload = actorName => ({ actorName }) }) => actorId => new aws_sdk_1.Lambda()
    .invoke({
    FunctionName: functionName,
    InvocationType: "Event",
    Qualifier: functionVersion || "$LATEST",
    Payload: JSON.stringify(buildPayload(actorId))
})
    .promise();
//# sourceMappingURL=lambda.js.map