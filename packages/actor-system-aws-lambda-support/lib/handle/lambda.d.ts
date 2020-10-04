import { LogWriter } from "@yingyeothon/logger";
import { ActorLambdaEvent } from "./event";
import { ActorProcessOptions } from "@yingyeothon/actor-system";
import { ActorSendEnvironment } from "@yingyeothon/actor-system/lib/actor/send";
import ActorShift from "@yingyeothon/actor-system/lib/shift";
import { Handler } from "aws-lambda";
interface IActorLambdaHandlerArguments<P> {
    newActorEnv: (event: P) => ActorSendEnvironment<unknown>;
    logger?: LogWriter;
    processOptions?: ActorProcessOptions;
}
export declare const handleActorLambdaEvent: <P = ActorLambdaEvent>({ newActorEnv, logger: maybeLogger, processOptions, }: IActorLambdaHandlerArguments<P>) => Handler<P, void>;
interface IShiftToNextLambdaArguments<P> {
    functionName: string;
    functionVersion?: string;
    buildPayload?: (actorId: string) => P;
}
export declare const shiftToNextLambda: <P = ActorLambdaEvent>({ functionName, functionVersion, buildPayload, }: IShiftToNextLambdaArguments<P>) => ActorShift;
export {};
