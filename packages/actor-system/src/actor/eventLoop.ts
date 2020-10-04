import ActorLogger from "./env/logger";
import ActorProperty from "./env/property";
import LockAcquire from "../lock/tryAcquire";
import LockRelease from "../lock/release";
import QueueBulkConsumer from "../queue/bulkConsumer";
import UserMessage from "./message/userMessage";
import { nullLogger } from "@yingyeothon/logger";

export type ActroEventLoopEnvironment<T> = ActorProperty &
  ActorLogger & {
    lock: LockAcquire & LockRelease;
  } & {
    queue: QueueBulkConsumer;
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
    const messages: UserMessage<T>[] = await queue.flush(id);
    logger.debug(`actor`, `poll-messages`, id, messages.length);
    return messages.map((message) => message.item);
  };

  logger.debug(`actor`, `start-loop`, id);
  await loop(poll);

  // Whatever its reason, release the lock.
  logger.debug(`actor`, `release-lock`, id);
  await lock.release(id);

  return true;
}
