import { LogWriter } from "@yingyeothon/logger";
import { ActorLambdaEvent } from "./event";
import { ActorProcessEnvironment } from "@yingyeothon/actor-system/lib/actor/process";
import { ActorProcessOptions } from "@yingyeothon/actor-system";
import ActorShift from "@yingyeothon/actor-system/lib/shift";
import { Handler } from "aws-lambda";
interface ActorLambdaHandlerArguments<ActorMessage, LambdaPayload extends ActorLambdaEvent> {
    newActorEnv: (event: LambdaPayload) => ActorProcessEnvironment<ActorMessage>;
    logger?: LogWriter;
    processOptions?: ActorProcessOptions;
}
export declare function handleActorLambdaEvent<ActorMessage, LambdaPayload extends ActorLambdaEvent = ActorLambdaEvent>({ newActorEnv, logger: maybeLogger, processOptions, }: ActorLambdaHandlerArguments<ActorMessage, LambdaPayload>): Handler<LambdaPayload, void>;
interface ShiftToNextLambdaArguments<P> {
    functionName: string;
    functionVersion?: string;
    buildPayload?: (actorId: string) => P;
}
export declare function shiftToNextLambda<P = ActorLambdaEvent>({ functionName, functionVersion, buildPayload, }: ShiftToNextLambdaArguments<P>): ActorShift;
export {};
