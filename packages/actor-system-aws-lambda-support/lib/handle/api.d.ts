import * as Actor from "@yingyeothon/actor-system";
import { ILogger } from "@yingyeothon/logger";
import { APIGatewayProxyEvent } from "aws-lambda";
interface IActorAPIEventHandlerArguments<T> {
    newActorEnv: (apiPath: string, event: APIGatewayProxyEvent) => Actor.ActorEnvironment<T>;
    parseMessage?: (body: string) => T;
    logger?: ILogger;
    policy: {
        type: "send";
        messageMeta?: Partial<Actor.IAwaiterMeta>;
        processOptions?: Partial<Actor.IActorProcessOptions>;
    } | {
        type: "post";
        messageMeta?: Actor.IAwaiterMeta;
    };
}
export declare const handleActorAPIEvent: <T>({ newActorEnv, parseMessage: maybeParseMessage, logger: maybeLogger, policy }: IActorAPIEventHandlerArguments<T>) => import("aws-lambda").Handler<APIGatewayProxyEvent, import("aws-lambda").APIGatewayProxyResult>;
export {};
