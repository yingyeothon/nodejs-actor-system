import { awaitMessage } from "./awaiter";
import { enqueue } from "./enqueue";
import { IActorProperty, IActorSubsystem } from "./env";
import { AwaitPolicy, IUserMessageItem, IUserMessageMeta } from "./message";

/**
 * Send a message to this `Actor`, just like the `send` function, but it does not process the message.
 * This can be used for average response time if there is already a dedicated thread handling messages in this actor.
 *
 * If there is no thread for this actor, any messages will not be processed, so there must be a thread that performs `tryToProcess`
 * with `aliveMillis` and no `oneShot`.
 */
export const post = async <T>(
  env: Pick<IActorProperty, "id"> &
    Pick<IActorSubsystem, "queue" | "awaiter" | "logger">,
  input: IUserMessageItem<T> & Partial<IUserMessageMeta>
): Promise<boolean> => {
  const message = await enqueue(env, input);
  if (message.awaitPolicy === AwaitPolicy.Forget) {
    return true;
  }

  return awaitMessage(env, message.messageId, message.awaitTimeoutMillis);
};
