import * as Actor from "@yingyeothon/actor-system";

import { LogWriter, nullLogger } from "@yingyeothon/logger";

import { ActorLambdaEvent } from "./event";
import { ActorProcessOptions } from "@yingyeothon/actor-system";
import { ActorSendEnvironment } from "@yingyeothon/actor-system/lib/actor/send";
import ActorShift from "@yingyeothon/actor-system/lib/shift";
import { Handler } from "aws-lambda";
import { Lambda } from "aws-sdk";
import { globalTimeline } from "./time";

const defaultLambdaFunctionTimeoutMillis = 870 * 1000;

interface IActorLambdaHandlerArguments<P> {
  newActorEnv: (event: P) => ActorSendEnvironment<unknown>;
  logger?: LogWriter;
  processOptions?: ActorProcessOptions;
}

export const handleActorLambdaEvent = <P = ActorLambdaEvent>({
  newActorEnv,
  logger: maybeLogger,
  processOptions,
}: IActorLambdaHandlerArguments<P>): Handler<P, void> => async (event) => {
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
      shiftable: true,
    }
  );

  logger.debug(`actor-lambda`, `end-of-handle`, processOptions, event);
};

interface IShiftToNextLambdaArguments<P> {
  functionName: string;
  functionVersion?: string;
  buildPayload?: (actorId: string) => P;
}

export const shiftToNextLambda = <P = ActorLambdaEvent>({
  functionName,
  functionVersion,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildPayload = (actorId) => ({ actorId } as any),
}: IShiftToNextLambdaArguments<P>): ActorShift => (actorId) =>
  new Lambda()
    .invoke({
      FunctionName: functionName,
      InvocationType: "Event",
      Qualifier: functionVersion || "$LATEST",
      Payload: JSON.stringify(buildPayload(actorId)),
    })
    .promise();
