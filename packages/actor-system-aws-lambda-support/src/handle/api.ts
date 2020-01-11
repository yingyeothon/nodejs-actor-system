import * as Actor from "@yingyeothon/actor-system";
import { ActorSendEnvironment } from "@yingyeothon/actor-system/lib/actor/send";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

const defaultAPIProxyFunctionTimeoutMillis = 5 * 1000;

interface IActorAPIEventHandlerArguments<T> {
  newActorEnv: (
    apiPath: string,
    event: APIGatewayProxyEvent
  ) => ActorSendEnvironment<T>;
  parseMessage?: (body: string) => T;
  logger?: ILogger;
  policy:
    | {
        type: "send";
        messageMeta?: Partial<Actor.IAwaiterMeta>;
        processOptions?: Partial<Actor.IActorProcessOptions>;
      }
    | {
        type: "post";
        messageMeta?: Actor.IAwaiterMeta;
      };
}

export const handleActorAPIEvent = <T>({
  newActorEnv,
  parseMessage: maybeParseMessage,
  logger: maybeLogger,
  policy
}: IActorAPIEventHandlerArguments<
  T
>): APIGatewayProxyHandler => async event => {
  const parseMessage =
    maybeParseMessage || ((body: string) => JSON.parse(body) as T);
  const logger = maybeLogger || nullLogger;

  logger.debug(`actor-api-handler`, `handle`, event.path, event.body);
  const actorEnv = newActorEnv(event.path, event);
  if (!actorEnv) {
    logger.error(`actor-api-handler`, `no-actor-env`, event);
    throw new Error(`No actor env for [${event.path}]`);
  }

  if (!event.body) {
    logger.error(`actor-api-handler`, `no-actor-message`, event);
    throw new Error(`No message body for [${event.path}]`);
  }

  const message = parseMessage(event.body);
  if (!message) {
    logger.error(
      `actor-api-handler`,
      `invalid-message`,
      actorEnv.id,
      event.path,
      event.body
    );
    throw new Error(`Invalid message for actor[${actorEnv.id}]`);
  }

  logger.debug(`actor-api-handler`, `post-and-process`, actorEnv.id, message);
  let processed: any;
  switch (policy.type) {
    case "send":
      processed = await Actor.send(
        actorEnv,
        { ...(policy.messageMeta || {}), item: message },
        prepareProcessOptions(policy.processOptions)
      );
      break;
    case "post":
      processed = await Actor.post(actorEnv, {
        ...(policy.messageMeta || {}),
        item: message
      });
      break;
  }

  logger.debug(`actor-api-handler`, `end-of-handle`, actorEnv.id, processed);
  return { statusCode: 200, body: "OK" };
};

const prepareProcessOptions = (
  options?: Actor.IActorProcessOptions
): Actor.IActorProcessOptions =>
  options
    ? {
        aliveMillis:
          options.aliveMillis ?? defaultAPIProxyFunctionTimeoutMillis,
        oneShot: options.oneShot ?? true,
        shiftable: options.shiftable ?? true
      }
    : {
        aliveMillis: defaultAPIProxyFunctionTimeoutMillis,
        oneShot: true,
        shiftable: true
      };
