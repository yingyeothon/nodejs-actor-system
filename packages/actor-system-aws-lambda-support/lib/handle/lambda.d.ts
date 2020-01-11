import { IActorProcessOptions } from "@yingyeothon/actor-system";
import { ActorSendEnvironment } from "@yingyeothon/actor-system/lib/actor/send";
import ActorShift from "@yingyeothon/actor-system/lib/shift";
import { ILogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import { IActorLambdaEvent } from "./event";
interface IActorLambdaHandlerArguments<P> {
    newActorEnv: (event: P) => ActorSendEnvironment<any>;
    logger?: ILogger;
    processOptions?: IActorProcessOptions;
}
export declare const handleActorLambdaEvent: <P = IActorLambdaEvent>({ newActorEnv, logger: maybeLogger, processOptions }: IActorLambdaHandlerArguments<P>) => Handler<P, void>;
interface IShiftToNextLambdaArguments<P> {
    functionName: string;
    functionVersion?: string;
    buildPayload?: (actorId: string) => P;
}
export declare const shiftToNextLambda: <P = IActorLambdaEvent>({ functionName, functionVersion, buildPayload }: IShiftToNextLambdaArguments<P>) => ActorShift;
export {};
