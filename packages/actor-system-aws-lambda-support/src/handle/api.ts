import * as Actor from "@yingyeothon/actor-system";

import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { LogWriter, nullLogger } from "@yingyeothon/logger";

import { ActorSendEnvironment } from "@yingyeothon/actor-system/lib/actor/send";

const defaultAPIProxyFunctionTimeoutMillis = 5 * 1000;

interface ActorAPIEventHandlerArguments<T> {
  newActorEnv: (
    apiPath: string,
    event: APIGatewayProxyEvent
  ) => ActorSendEnvironment<T>;
  parseMessage?: (body: string) => T;
  logger?: LogWriter;
  policy:
    | {
        type: "send";
        messageMeta?: Partial<Actor.AwaiterMeta>;
        processOptions?: Partial<Actor.ActorProcessOptions>;
      }
    | {
        type: "post";
        messageMeta?: Actor.AwaiterMeta;
      };
}

export function handleActorAPIEvent<T>({
  newActorEnv,
  parseMessage: maybeParseMessage,
  logger: maybeLogger,
  policy,
}: ActorAPIEventHandlerArguments<T>): APIGatewayProxyHandler {
  return async function handleAPIEvent(event) {
    const parseMessage =
      maybeParseMessage || ((body: string) => JSON.parse(body) as T);
    const rootLogger = maybeLogger ?? nullLogger;

    rootLogger.debug(`actor-api-handler`, `handle`, event.path, event.body);
    const actorEnv = newActorEnv(event.path, event);
    if (!actorEnv) {
      rootLogger.error(`actor-api-handler`, `no-actor-env`, event);
      throw new Error(`No actor env for [${event.path}]`);
    }

    const logger = maybeLogger ?? actorEnv.logger ?? nullLogger;
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
    let processed: unknown;
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
          item: message,
        });
        break;
    }

    logger.debug(`actor-api-handler`, `end-of-handle`, actorEnv.id, processed);
    return { statusCode: 200, body: "OK" };
  };
}

const prepareProcessOptions = (
  options?: Actor.ActorProcessOptions
): Actor.ActorProcessOptions =>
  options
    ? {
        aliveMillis:
          options.aliveMillis ?? defaultAPIProxyFunctionTimeoutMillis,
        oneShot: options.oneShot ?? true,
        shiftable: options.shiftable ?? true,
      }
    : {
        aliveMillis: defaultAPIProxyFunctionTimeoutMillis,
        oneShot: true,
        shiftable: true,
      };
