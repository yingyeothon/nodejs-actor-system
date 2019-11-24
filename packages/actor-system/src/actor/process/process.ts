import { nullLogger } from "@yingyeothon/logger";
import { notifyCompletions } from "../awaiter";
import { ActorEnvironment } from "../env";
import { AwaitPolicy, IAwaiterMeta } from "../message";
import { processInBulkMode } from "./bulk";
import { IActorProcessOptions } from "./options";
import { processInSingleMode } from "./single";
import { maybeAwait } from "./utils";

export const tryToProcess = async <T>(
  env: ActorEnvironment<T>,
  { shiftTimeout }: IActorProcessOptions = {}
): Promise<IAwaiterMeta[]> => {
  const startMillis = Date.now();
  const isAlive = () =>
    shiftTimeout && shiftTimeout > 0
      ? Date.now() - startMillis < shiftTimeout
      : true;

  return processLoop(env, isAlive);
};

export const processLoop = async <T>(
  env: ActorEnvironment<T>,
  isAlive: () => boolean
): Promise<IAwaiterMeta[]> => {
  const { id, queue, lock, logger = nullLogger, shift } = env;

  const messageMetas: IAwaiterMeta[] = [];
  logger.debug(`actor`, `consume-loop`, id);
  while (true) {
    // Do nothing if cannot get the lock.
    logger.debug(`actor`, `try-to-lock`, id);
    if (!(await lock.tryAcquire(id))) {
      logger.debug(`actor`, `cannot-lock`, id);
      break;
    }

    let localMetas: IAwaiterMeta[] = [];
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
      messageMetas.filter(meta => meta.awaitPolicy === AwaitPolicy.Commit)
    );

    // There is no messages in the queue after unlocked,
    // We can get off from it.
    if ((await queue.size(id)) === 0) {
      logger.debug(`actor`, `empty-queue`, id);
      break;
    }

    // Or, shift to new actor when a container has been timeout.
    if (!isAlive()) {
      logger.debug(`actor`, `shift-timeout`, id);
      if (shift) {
        await maybeAwait(shift(id));
      }
      break;
    }

    // Otherwise, we must keep go on
    // because there is another message and it is alive.
  }
  return messageMetas;
};
