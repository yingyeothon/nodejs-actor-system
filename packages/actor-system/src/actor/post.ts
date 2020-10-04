import enqueue, { ActorEnqueueEnvironment } from "./enqueue";

import ActorProperty from "./env/property";
import AwaitPolicy from "./message/awaitPolicy";
import AwaiterWait from "../awaiter/wait";
import UserMessageItem from "./message/userMessageItem";
import UserMessageMeta from "./message/userMessageMeta";
import awaitMessage from "./awaiter/awaitMessage";

export type ActorPostEnvironment = ActorProperty &
  ActorEnqueueEnvironment & { awaiter: AwaiterWait };

/**
 * Send a message to this `Actor`, just like the `send` function, but it does not process the message.
 * This can be used for average response time if there is already a dedicated thread handling messages in this actor.
 *
 * If there is no thread for this actor, any messages will not be processed, so there must be a thread that performs `tryToProcess`
 * with `aliveMillis` and no `oneShot`.
 */
export default async function post<T>(
  env: ActorPostEnvironment,
  input: UserMessageItem<T> & Partial<UserMessageMeta>
): Promise<boolean> {
  const message = await enqueue(env, input);
  if (message.awaitPolicy === AwaitPolicy.Forget) {
    return true;
  }

  return awaitMessage(env, message.messageId, message.awaitTimeoutMillis);
}
