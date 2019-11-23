import * as Actor from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import { APIGatewayProxyEvent } from "aws-lambda";
interface IActorAPIEventHandlerArguments<T> {
    newActorEnv: (apiPath: string, event: APIGatewayProxyEvent) => Actor.ActorEnvironment<T>;
    parseMessage?: (body: string) => T;
    functionTimeout?: number;
    logger?: ILogger;
    mode?: "send" | "post";
    awaitPolicy?: Actor.AwaitPolicy;
}
export declare const handleActorAPIEvent: <T>({ newActorEnv, parseMessage: maybeParseMessage, functionTimeout, logger: maybeLogger, mode, awaitPolicy }: IActorAPIEventHandlerArguments<T>) => import("aws-lambda").Handler<APIGatewayProxyEvent, import("aws-lambda").APIGatewayProxyResult>;
export {};
