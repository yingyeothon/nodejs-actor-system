import IAwaiterWait from "../awaiter/wait";
import awaitMessage from "./awaiter/awaitMessage";
import enqueue, { ActorEnqueueEnvironment } from "./enqueue";
import IActorProperty from "./env/property";
import AwaitPolicy from "./message/awaitPolicy";
import IUserMessageItem from "./message/userMessageItem";
import IUserMessageMeta from "./message/userMessageMeta";

export type ActorPostEnvironment = IActorProperty &
  ActorEnqueueEnvironment & { awaiter: IAwaiterWait };

/**
 * Send a message to this `Actor`, just like the `send` function, but it does not process the message.
 * This can be used for average response time if there is already a dedicated thread handling messages in this actor.
 *
 * If there is no thread for this actor, any messages will not be processed, so there must be a thread that performs `tryToProcess`
 * with `aliveMillis` and no `oneShot`.
 */
export default async function post<T>(
  env: ActorPostEnvironment,
  input: IUserMessageItem<T> & Partial<IUserMessageMeta>
): Promise<boolean> {
  const message = await enqueue(env, input);
  if (message.awaitPolicy === AwaitPolicy.Forget) {
    return true;
  }

  return awaitMessage(env, message.messageId, message.awaitTimeoutMillis);
}
