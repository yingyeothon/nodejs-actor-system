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
const client_lambda_1 = require("@aws-sdk/client-lambda");
const logger_1 = require("@yingyeothon/logger");
const time_1 = require("./time");
const defaultLambdaFunctionTimeoutMillis = 870 * 1000;
function handleActorLambdaEvent({ newActorEnv, logger: maybeLogger, processOptions, }) {
    return function handleLambda(event) {
        return __awaiter(this, void 0, void 0, function* () {
            time_1.globalTimeline.reset((processOptions === null || processOptions === void 0 ? void 0 : processOptions.aliveMillis) || defaultLambdaFunctionTimeoutMillis);
            const env = newActorEnv(event);
            const logger = maybeLogger || env.logger || logger_1.nullLogger;
            logger.debug(`actor-lambda`, `handle`, processOptions, event);
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
    };
}
exports.handleActorLambdaEvent = handleActorLambdaEvent;
function shiftToNextLambda({ functionName, functionVersion, buildPayload = (actorId) => ({ actorId }), }) {
    return function (actorId) {
        return new client_lambda_1.LambdaClient({}).send(new client_lambda_1.InvokeCommand({
            FunctionName: functionName,
            InvocationType: "Event",
            Qualifier: functionVersion || "$LATEST",
            Payload: Buffer.from(JSON.stringify(buildPayload(actorId)), "utf-8"),
        }));
    };
}
exports.shiftToNextLambda = shiftToNextLambda;
//# sourceMappingURL=lambda.js.map