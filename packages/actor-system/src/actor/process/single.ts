import { copyAwaiterMeta, maybeAwait } from "./utils";

import ActorErrorHandler from "../env/errorHandler";
import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import ActorSingleMessageHandler from "../env/singleMessageHandler";
import AwaitPolicy from "../message/awaitPolicy";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterResolve from "../../awaiter/resolve";
import QueueLength from "../../queue/length";
import QueueSingleConsumer from "../../queue/singleConsumer";
import UserMessage from "../message/userMessage";
import notifyCompletion from "../awaiter/notifyCompletion";
import { nullLogger } from "@yingyeothon/logger";

export type ActorSingleEnv<T> = ActorProperty &
  ActorLogger & { queue: QueueSingleConsumer & QueueLength } & {
    awaiter: AwaiterResolve;
  } & ActorSingleMessageHandler<T> &
  ActorErrorHandler;

export default async function processInSingleMode<T>(
  env: ActorSingleEnv<T>,
  isAlive: () => boolean
): Promise<AwaiterMeta[]> {
  if (!isAlive()) {
    return [];
  }

  const { id, onPrepare, onCommit } = env;

  // Consume messages in the queue if locked.
  if (onPrepare) {
    await maybeAwait(onPrepare(id));
  }

  // Collect all resolved message ids in env loop.
  const localMetas = await processQueueInLock(env, isAlive);

  if (onCommit) {
    await maybeAwait(onCommit(id));
  }
  return localMetas;
}

const processQueueInLock = async <T>(
  env: ActorSingleEnv<T>,
  isAlive: () => boolean
): Promise<AwaiterMeta[]> => {
  const { queue, id, logger = nullLogger } = env;

  logger.debug(`actor`, `process-queue-in-single`, id);

  // Process messages as possible as it can while alive.
  const messageMetas: AwaiterMeta[] = [];
  const notifyPromises: Promise<void>[] = [];
  while (isAlive() && (await queue.size(id)) > 0) {
    // Step 1. Peek a message from the queue to process it.
    const message = await queue.peek<UserMessage<T>>(id);
    logger.debug(`actor`, `get-message`, id, message);

    // Step 1-1. We should stop to process when the queue is broken.
    if (!message) {
      logger.debug(`actor`, `invalid-message`, id, message);
      break;
    }

    // Step 2. Process a message by its type.
    await processMessage(env, message);
    // Copy only meta to reduce memory consumption.
    messageMetas.push(copyAwaiterMeta(message));

    // Step 3. Notify completions to awaiters.
    if (message.awaitPolicy === AwaitPolicy.Act) {
      notifyPromises.push(notifyCompletion(env, message));
    }

    // Step 4. Delete a message from the queue.
    // It will help to preserve the order of messages from broken handlers.
    await queue.pop(id);
    logger.debug(`actor`, `delete-message`, id);
  }

  await Promise.all(notifyPromises);
  return messageMetas;
};

const processMessage = async <T>(
  env: ActorSingleEnv<T>,
  message: UserMessage<T>
): Promise<void> => {
  const { id, logger = nullLogger, onMessage, onError } = env;
  try {
    logger.debug(`actor`, `process-user-message`, id, message);
    await maybeAwait(onMessage(message.item));
  } catch (error) {
    logger.error(`actor`, `process-user-message-error`, id, message, error);
    if (onError) {
      await maybeAwait(onError(error));
    }
  }
};
