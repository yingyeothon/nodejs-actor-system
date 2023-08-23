import * as Actor from "@yingyeothon/actor-system";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { LogWriter } from "@yingyeothon/logger";
import { ActorSendEnvironment } from "@yingyeothon/actor-system/lib/actor/send";
interface ActorAPIEventHandlerArguments<T> {
    newActorEnv: (apiPath: string, event: APIGatewayProxyEvent) => ActorSendEnvironment<T>;
    parseMessage?: (body: string) => T;
    logger?: LogWriter;
    policy: {
        type: "send";
        messageMeta?: Partial<Actor.AwaiterMeta>;
        processOptions?: Partial<Actor.ActorProcessOptions>;
    } | {
        type: "post";
        messageMeta?: Actor.AwaiterMeta;
    };
}
export declare function handleActorAPIEvent<T>({ newActorEnv, parseMessage: maybeParseMessage, logger: maybeLogger, policy, }: ActorAPIEventHandlerArguments<T>): APIGatewayProxyHandler;
export {};
