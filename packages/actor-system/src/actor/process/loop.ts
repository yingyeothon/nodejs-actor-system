import processInBulkMode, { ActorBulkEnv } from "./bulk";
import processInSingleMode, { ActorSingleEnv } from "./single";

import AwaitPolicy from "../message/awaitPolicy";
import AwaiterMeta from "../message/awaiterMeta";
import LockAcquire from "../../lock/tryAcquire";
import LockRelease from "../../lock/release";
import notifyCompletions from "../awaiter/notifyCompletions";
import { nullLogger } from "@yingyeothon/logger";

export type ActorLoopEnvironment<T> = (ActorSingleEnv<T> | ActorBulkEnv<T>) & {
  lock: LockAcquire & LockRelease;
};

export default async function processLoop<T>(
  env: ActorLoopEnvironment<T>,
  isAlive: () => boolean
): Promise<AwaiterMeta[]> {
  const { id, queue, lock, logger = nullLogger } = env;

  const messageMetas: AwaiterMeta[] = [];
  logger.debug(`actor`, `process-loop`, id);
  while (isAlive()) {
    // Do nothing if cannot get the lock.
    logger.debug(`actor`, `try-to-lock`, id);
    if (!(await lock.tryAcquire(id))) {
      logger.debug(`actor`, `cannot-lock`, id);
      break;
    }

    let localMetas: AwaiterMeta[] = [];
    switch (env._consume) {
      case "single":
        localMetas = await processInSingleMode(env, isAlive);
        break;
      case "bulk":
        localMetas = await processInBulkMode(env, isAlive);
        break;
    }
    Array.prototype.push.apply(messageMetas, localMetas);

    // Whatever its reason, release the lock.
    logger.debug(`actor`, `release-lock`, id);
    await lock.release(id);

    // Notify the end of process to awaiters.
    await notifyCompletions(
      env,
      messageMetas.filter((meta) => meta.awaitPolicy === AwaitPolicy.Commit)
    );

    // There is no messages in the queue after unlocked,
    // We can get off from it.
    if ((await queue.size(id)) === 0) {
      logger.debug(`actor`, `empty-queue`, id);
      break;
    }

    // Otherwise, we must keep go on
    // because there is another message and it is alive.
  }
  return messageMetas;
}
