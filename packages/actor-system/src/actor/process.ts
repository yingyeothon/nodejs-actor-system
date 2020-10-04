import processLoop, { ActorLoopEnvironment } from "./process/loop";

import ActorProcessOptions from "./process/options";
import ActorShifter from "../shift";
import AwaiterMeta from "./message/awaiterMeta";
import { maybeAwait } from "./process/utils";
import { nullLogger } from "@yingyeothon/logger";

export type ActorProcessEnvironment<T> = ActorLoopEnvironment<T> & {
  shift?: ActorShifter;
};

export default async function tryToProcess<T>(
  env: ActorProcessEnvironment<T>,
  { oneShot, aliveMillis, shiftable }: ActorProcessOptions = {}
): Promise<AwaiterMeta[]> {
  const { logger = nullLogger, id, shift } = env;
  const maybeOneShot = oneShot === undefined && aliveMillis === undefined;

  const startMillis = Date.now();
  const isAlive = () =>
    aliveMillis && aliveMillis > 0
      ? Date.now() - startMillis < aliveMillis
      : true;

  const metas: AwaiterMeta[] = [];
  while (isAlive()) {
    const localMetas = await processLoop(env, isAlive);
    Array.prototype.push.apply(metas, localMetas);

    // Shift to new actor when a container has been timeout.
    if (!isAlive() && shiftable) {
      logger.debug(`actor`, `shift-timeout`, id);
      if (shift) {
        await maybeAwait(shift(id));
      }
      break;
    }

    if (oneShot || maybeOneShot) {
      break;
    }
  }
  return metas;
}
