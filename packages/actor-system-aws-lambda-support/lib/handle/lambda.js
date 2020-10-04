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
exports.shiftToNextLambda = exports.handleActorLambdaEvent = void 0;
const Actor = require("@yingyeothon/actor-system");
const logger_1 = require("@yingyeothon/logger");
const aws_sdk_1 = require("aws-sdk");
const time_1 = require("./time");
const defaultLambdaFunctionTimeoutMillis = 870 * 1000;
exports.handleActorLambdaEvent = ({ newActorEnv, logger: maybeLogger, processOptions, }) => (event) => __awaiter(void 0, void 0, void 0, function* () {
    time_1.globalTimeline.reset((processOptions === null || processOptions === void 0 ? void 0 : processOptions.aliveMillis) || defaultLambdaFunctionTimeoutMillis);
    const logger = maybeLogger || logger_1.nullLogger;
    logger.debug(`actor-lambda`, `handle`, processOptions, event);
    const env = newActorEnv(event);
    if (!env) {
        throw new Error(`No actor env [${event}]`);
    }
    yield Actor.tryToProcess(env, processOptions || {
        aliveMillis: time_1.globalTimeline.remainMillis,
        oneShot: true,
        shiftable: true,
    });
    logger.debug(`actor-lambda`, `end-of-handle`, processOptions, event);
});
exports.shiftToNextLambda = ({ functionName, functionVersion, buildPayload = (actorId) => ({ actorId }), }) => (actorId) => new aws_sdk_1.Lambda()
    .invoke({
    FunctionName: functionName,
    InvocationType: "Event",
    Qualifier: functionVersion || "$LATEST",
    Payload: JSON.stringify(buildPayload(actorId)),
})
    .promise();
//# sourceMappingURL=lambda.js.map