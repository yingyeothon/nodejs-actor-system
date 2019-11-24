import { nullLogger } from "@yingyeothon/logger";
import { notifyCompletions } from "../awaiter";
import {
  IActorMessageBulkConsumer,
  IActorOptionalHandler,
  IActorProperty,
  IActorSubsystem
} from "../env";
import { AwaitPolicy, IAwaiterMeta, IUserMessage } from "../message";
import { copyAwaiterMeta, maybeAwait } from "./utils";

type BulkEnv<T> = IActorProperty &
  IActorSubsystem &
  IActorMessageBulkConsumer<T> &
  IActorOptionalHandler;

export const processInBulkMode = async <T>(
  env: BulkEnv<T>,
  isAlive: () => boolean
) => {
  const { queue, id, logger = nullLogger, onMessages } = env;

  logger.debug(`actor`, `consume-queue`, id);

  // Process messages as possible as it can while alive.
  const messageMetas: IAwaiterMeta[] = [];
  while (isAlive()) {
    const messages: Array<IUserMessage<any>> = await queue.flush(id);
    logger.debug(`actor`, `get-messages`, id, messages.length);
    if (messages.length === 0) {
      break;
    }

    // Step 2. Process messages.
    await maybeAwait(onMessages(messages.map(message => message.item)));

    // Copy only meta to reduce memory consumption.
    for (const message of messages) {
      messageMetas.push(copyAwaiterMeta(message));
    }

    // Step 3. Notify completions to awaiters.
    notifyCompletions(
      env,
      messageMetas.filter(meta => meta.awaitPolicy === AwaitPolicy.Act)
    );
  }
  return messageMetas;
};
