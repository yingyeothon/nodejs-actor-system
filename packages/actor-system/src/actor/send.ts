import { awaitMessageAfterTryToProcess } from "./awaiter";
import { enqueue } from "./enqueue";
import { ActorEnvironment } from "./env";
import { IUserMessageItem, IUserMessageMeta } from "./message";
import { IActorProcessOptions, tryToProcess } from "./process";

/**
 * Send a message to this `Actor` and try to process that message with `ProcessOptions`.
 * If there is another thread dedicated this actor, `AwaitPolicy` determines when the function completes.
 *
 * Of course, it will handle messages from other threads if this thread takes an `Actor`,
 * In this case the function elapsed may be longer than we expect, so we need to set `shiftTimeout` properly.
 */
export const send = async <T>(
  env: ActorEnvironment<T>,
  input: IUserMessageItem<T> & Partial<IUserMessageMeta>,
  options: IActorProcessOptions = {}
): Promise<boolean> => {
  const message = await enqueue(env, input);
  return awaitMessageAfterTryToProcess(env, message, () =>
    tryToProcess(env, options)
  );
};
