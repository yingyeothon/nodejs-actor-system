import * as Actor from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import { IActorLambdaEvent } from "./event";
interface IActorLambdaHandlerArguments<P> {
    newActorEnv: (event: P) => Actor.ActorEnvironment<any>;
    functionTimeout?: number;
    logger?: ILogger;
    aliveMode?: "tryToProcess" | "consumeUntil";
}
export declare const handleActorLambdaEvent: <P = IActorLambdaEvent>({ newActorEnv, functionTimeout, logger: maybeLogger, aliveMode }: IActorLambdaHandlerArguments<P>) => Handler<P, void>;
interface IShiftToNextLambdaArguments<P> {
    functionName: string;
    functionVersion?: string;
    buildPayload?: (actorName: string) => P;
}
export declare const shiftToNextLambda: <P = IActorLambdaEvent>({ functionName, functionVersion, buildPayload }: IShiftToNextLambdaArguments<P>) => Actor.ActorShift;
export {};
