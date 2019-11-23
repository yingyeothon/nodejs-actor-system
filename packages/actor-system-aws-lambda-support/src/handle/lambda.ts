import * as Actor from "@yingyeothon/actor-system";
import { ConsoleLogger, ILogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import { Lambda } from "aws-sdk";
import { IActorLambdaEvent } from "./event";
import { globalTimeline } from "./time";

const defaultLambdaFunctionTimeoutMillis = 14 * 60 * 1000;

interface IActorLambdaHandlerArguments<P> {
  newActorEnv: (event: P) => Actor.ActorEnvironment<any>;
  functionTimeout?: number;
  logger?: ILogger;
  aliveMode?: "tryToProcess" | "consumeUntil";
}

export const handleActorLambdaEvent = <P = IActorLambdaEvent>({
  newActorEnv,
  functionTimeout = defaultLambdaFunctionTimeoutMillis,
  logger: maybeLogger,
  aliveMode = "tryToProcess"
}: IActorLambdaHandlerArguments<P>): Handler<P, void> => async event => {
  globalTimeline.reset(functionTimeout);

  const logger = maybeLogger || new ConsoleLogger();
  logger.debug(`actor-lambda`, `handle`, aliveMode, event);

  const env = newActorEnv(event);
  if (!env) {
    throw new Error(`No actor env [${event}]`);
  }

  switch (aliveMode) {
    case "tryToProcess":
      await Actor.tryToProcess(env, {
        shiftTimeout: globalTimeline.remainMillis
      });
      break;
    case "consumeUntil":
      await Actor.consumeUntil(env, {
        untilMillis: globalTimeline.remainMillis
      });
      break;
  }

  logger.debug(`actor-lambda`, `end-of-handle`, aliveMode, event);
};

interface IShiftToNextLambdaArguments<P> {
  functionName: string;
  functionVersion?: string;
  buildPayload?: (actorName: string) => P;
}

export const shiftToNextLambda = <P = IActorLambdaEvent>({
  functionName,
  functionVersion,
  buildPayload = actorName => ({ actorName } as any)
}: IShiftToNextLambdaArguments<P>): Actor.ActorShift => actorId =>
  new Lambda()
    .invoke({
      FunctionName: functionName,
      InvocationType: "Event",
      Qualifier: functionVersion || "$LATEST",
      Payload: JSON.stringify(buildPayload(actorId))
    })
    .promise();
