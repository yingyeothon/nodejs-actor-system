import * as Actor from "@yingyeothon/actor-system";
import { IActorProcessOptions } from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import { IActorLambdaEvent } from "./event";
interface IActorLambdaHandlerArguments<P> {
    newActorEnv: (event: P) => Actor.ActorEnvironment<any>;
    logger?: ILogger;
    processOptions?: IActorProcessOptions;
}
export declare const handleActorLambdaEvent: <P = IActorLambdaEvent>({ newActorEnv, logger: maybeLogger, processOptions }: IActorLambdaHandlerArguments<P>) => Handler<P, void>;
interface IShiftToNextLambdaArguments<P> {
    functionName: string;
    functionVersion?: string;
    buildPayload?: (actorId: string) => P;
}
export declare const shiftToNextLambda: <P = IActorLambdaEvent>({ functionName, functionVersion, buildPayload }: IShiftToNextLambdaArguments<P>) => Actor.ActorShift;
export {};
