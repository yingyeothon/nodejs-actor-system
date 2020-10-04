import enqueue, { ActorEnqueueEnvironment } from "./enqueue";
import tryToProcess, { ActorProcessEnvironment } from "./process";

import ActorProcessOptions from "./process/options";
import AwaiterWait from "../awaiter/wait";
import UserMessageItem from "./message/userMessageItem";
import UserMessageMeta from "./message/userMessageMeta";
import awaitMessageAfterTryToProcess from "./awaiter/awaitMessageAfterTryToProcess";

export type ActorSendEnvironment<T> = ActorEnqueueEnvironment &
  ActorProcessEnvironment<T> & { awaiter: AwaiterWait };

/**
 * Send a message to this `Actor` and try to process that message with `ProcessOptions`.
 * If there is another thread dedicated this actor, `AwaitPolicy` determines when the function completes.
 *
 * Of course, it will handle messages from other threads if this thread takes an `Actor`,
 * In this case the function elapsed may be longer than we expect, so we need to set `IActorProcessOptions` properly.
 */
export default async function send<T>(
  env: ActorSendEnvironment<T>,
  input: UserMessageItem<T> & Partial<UserMessageMeta>,
  options: ActorProcessOptions = {}
): Promise<boolean> {
  const message = await enqueue(env, input);
  return awaitMessageAfterTryToProcess(env, message, () =>
    tryToProcess(env, options)
  );
}
