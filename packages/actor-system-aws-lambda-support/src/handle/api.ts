import * as Actor from "@yingyeothon/actor-system";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";

const defaultAPIProxyFunctionTimeoutMillis = 6 * 1000;

interface IActorAPIEventHandlerArguments<T> {
  newActorEnv: (
    apiPath: string,
    event: APIGatewayProxyEvent
  ) => Actor.ActorEnvironment<T>;
  parseMessage?: (body: string) => T;
  functionTimeout?: number;
  logger?: ILogger;
  mode?: "send" | "post";
  awaitPolicy?: Actor.AwaitPolicy;
}

export const handleActorAPIEvent = <T>({
  newActorEnv,
  parseMessage: maybeParseMessage,
  functionTimeout,
  logger: maybeLogger,
  mode = "send",
  awaitPolicy = Actor.AwaitPolicy.Forget
}: IActorAPIEventHandlerArguments<
  T
>): APIGatewayProxyHandler => async event => {
  const parseMessage =
    maybeParseMessage || ((body: string) => JSON.parse(body) as T);
  const logger = maybeLogger || new ConsoleLogger();

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
  const timeoutMillis =
    functionTimeout !== undefined
      ? functionTimeout
      : defaultAPIProxyFunctionTimeoutMillis;

  let processed: any;
  switch (mode) {
    case "send":
      processed = await Actor.send(
        actorEnv,
        { item: message, awaitPolicy },
        { shiftTimeout: timeoutMillis }
      );
      break;
    case "post":
      processed = await Actor.post(actorEnv, { item: message, awaitPolicy });
      break;
  }

  logger.debug(`actor-api-handler`, `end-of-handle`, actorEnv.id, processed);
  return { statusCode: 200, body: "OK" };
};
