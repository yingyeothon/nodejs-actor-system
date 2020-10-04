import { copyAwaiterMeta, maybeAwait } from "./utils";

import ActorBulkMessageHandler from "../env/bulkMessageHandler";
import ActorErrorHandler from "../env/errorHandler";
import ActorLogger from "../env/logger";
import ActorProperty from "../env/property";
import AwaitPolicy from "../message/awaitPolicy";
import AwaiterMeta from "../message/awaiterMeta";
import AwaiterResolve from "../../awaiter/resolve";
import QueueBulkConsumer from "../../queue/bulkConsumer";
import QueueLength from "../../queue/length";
import UserMessage from "../message/userMessage";
import notifyCompletions from "../awaiter/notifyCompletions";
import { nullLogger } from "@yingyeothon/logger";

export type ActorBulkEnv<T> = ActorProperty &
  ActorLogger & { queue: QueueBulkConsumer & QueueLength } & {
    awaiter: AwaiterResolve;
  } & ActorBulkMessageHandler<T> &
  ActorErrorHandler;

export default async function processInBulkMode<T>(
  env: ActorBulkEnv<T>,
  isAlive: () => boolean
): Promise<AwaiterMeta[]> {
  const { queue, id, logger = nullLogger, onMessages, onError } = env;
  logger.debug(`actor`, `process-queue-in-bulk`, id);

  // Process messages as possible as it can while alive.
  const messageMetas: AwaiterMeta[] = [];
  while (isAlive()) {
    const messages: UserMessage<T>[] = await queue.flush(id);
    logger.debug(`actor`, `get-messages`, id, messages.length);
    if (messages.length === 0) {
      break;
    }

    // Step 2. Process messages.
    try {
      logger.debug(`actor`, `process-messages`, id, messages);
      await maybeAwait(onMessages(messages.map((message) => message.item)));
    } catch (error) {
      logger.error(`actor`, `process-messages-error`, id, messages, error);
      if (onError) {
        await maybeAwait(onError(error));
      }
    }

    // Copy only meta to reduce memory consumption.
    for (const message of messages) {
      messageMetas.push(copyAwaiterMeta(message));
    }

    // Step 3. Notify completions to awaiters.
    notifyCompletions(
      env,
      messageMetas.filter((meta) => meta.awaitPolicy === AwaitPolicy.Act)
    );
  }
  return messageMetas;
}
