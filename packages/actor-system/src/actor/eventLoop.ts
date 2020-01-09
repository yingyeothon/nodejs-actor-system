import { ILogger, nullLogger } from "@yingyeothon/logger";
import ILockRelease from "../lock/release";
import ILockAcquire from "../lock/tryAcquire";
import QueueBulkConsumer from "../queue/bulkConsumer";
import IUserMessage from "./message/userMessage";

export type ActroEventLoopEnvironment<T> = {
  lock: ILockAcquire & ILockRelease;
} & {
  queue: QueueBulkConsumer;
} & {
  id: string;
} & {
  logger?: ILogger;
} & {
  loop: (poll: () => Promise<T[]>) => Promise<void>;
};

export default async function eventLoop<T>(
  env: ActroEventLoopEnvironment<T>
): Promise<boolean> {
  const { id, queue, lock, loop, logger = nullLogger } = env;

  // Do nothing if cannot get the lock.
  logger.debug(`actor`, `try-to-lock`, id);
  if (!(await lock.tryAcquire(id))) {
    logger.debug(`actor`, `cannot-lock`, id);
    return false;
  }

  const poll = async () => {
    const messages: Array<IUserMessage<T>> = await queue.flush(id);
    logger.debug(`actor`, `poll-messages`, id, messages.length);
    return messages.map(message => message.item);
  };

  logger.debug(`actor`, `start-loop`, id);
  await loop(poll);

  // Whatever its reason, release the lock.
  logger.debug(`actor`, `release-lock`, id);
  await lock.release(id);

  return true;
}
