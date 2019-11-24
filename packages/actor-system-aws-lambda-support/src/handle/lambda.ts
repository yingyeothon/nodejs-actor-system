import * as Actor from "@yingyeothon/actor-system";
import { IActorProcessOptions } from "@yingyeothon/actor-system";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { Handler } from "aws-lambda";
import { Lambda } from "aws-sdk";
import { IActorLambdaEvent } from "./event";
import { globalTimeline } from "./time";

const defaultLambdaFunctionTimeoutMillis = 870 * 1000;

interface IActorLambdaHandlerArguments<P> {
  newActorEnv: (event: P) => Actor.ActorEnvironment<any>;
  logger?: ILogger;
  processOptions?: IActorProcessOptions;
}

export const handleActorLambdaEvent = <P = IActorLambdaEvent>({
  newActorEnv,
  logger: maybeLogger,
  processOptions
}: IActorLambdaHandlerArguments<P>): Handler<P, void> => async event => {
  globalTimeline.reset(
    processOptions?.aliveMillis || defaultLambdaFunctionTimeoutMillis
  );

  const logger = maybeLogger || nullLogger;
  logger.debug(`actor-lambda`, `handle`, processOptions, event);

  const env = newActorEnv(event);
  if (!env) {
    throw new Error(`No actor env [${event}]`);
  }

  await Actor.tryToProcess(
    env,
    processOptions || {
      aliveMillis: globalTimeline.remainMillis,
      oneShot: true,
      shiftable: true
    }
  );

  logger.debug(`actor-lambda`, `end-of-handle`, processOptions, event);
};

interface IShiftToNextLambdaArguments<P> {
  functionName: string;
  functionVersion?: string;
  buildPayload?: (actorId: string) => P;
}

export const shiftToNextLambda = <P = IActorLambdaEvent>({
  functionName,
  functionVersion,
  buildPayload = actorId => ({ actorId } as any)
}: IShiftToNextLambdaArguments<P>): Actor.ActorShift => actorId =>
  new Lambda()
    .invoke({
      FunctionName: functionName,
      InvocationType: "Event",
      Qualifier: functionVersion || "$LATEST",
      Payload: JSON.stringify(buildPayload(actorId))
    })
    .promise();
