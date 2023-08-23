import * as Actor from "@yingyeothon/actor-system";

import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { LogWriter, nullLogger } from "@yingyeothon/logger";

import { ActorLambdaEvent } from "./event";
import { ActorProcessEnvironment } from "@yingyeothon/actor-system/lib/actor/process";
import { ActorProcessOptions } from "@yingyeothon/actor-system";
import ActorShift from "@yingyeothon/actor-system/lib/shift";
import { Handler } from "aws-lambda";
import { globalTimeline } from "./time";

const defaultLambdaFunctionTimeoutMillis = 870 * 1000;

interface ActorLambdaHandlerArguments<
  ActorMessage,
  LambdaPayload extends ActorLambdaEvent,
> {
  newActorEnv: (event: LambdaPayload) => ActorProcessEnvironment<ActorMessage>;
  logger?: LogWriter;
  processOptions?: ActorProcessOptions;
}

export function handleActorLambdaEvent<
  ActorMessage,
  LambdaPayload extends ActorLambdaEvent = ActorLambdaEvent,
>({
  newActorEnv,
  logger: maybeLogger,
  processOptions,
}: ActorLambdaHandlerArguments<ActorMessage, LambdaPayload>): Handler<
  LambdaPayload,
  void
> {
  return async function handleLambda(event: LambdaPayload): Promise<void> {
    globalTimeline.reset(
      processOptions?.aliveMillis || defaultLambdaFunctionTimeoutMillis
    );

    const env = newActorEnv(event);
    const logger = maybeLogger || env.logger || nullLogger;
    logger.debug(`actor-lambda`, `handle`, processOptions, event);
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
}

interface ShiftToNextLambdaArguments<P> {
  functionName: string;
  functionVersion?: string;
  buildPayload?: (actorId: string) => P;
}

export function shiftToNextLambda<P = ActorLambdaEvent>({
  functionName,
  functionVersion,
  buildPayload = (actorId) => ({ actorId }) as unknown as P,
}: ShiftToNextLambdaArguments<P>): ActorShift {
  return function (actorId) {
    return new LambdaClient({}).send(
      new InvokeCommand({
        FunctionName: functionName,
        InvocationType: "Event",
        Qualifier: functionVersion || "$LATEST",
        Payload: Buffer.from(JSON.stringify(buildPayload(actorId)), "utf-8"),
      })
    );
  };
}
