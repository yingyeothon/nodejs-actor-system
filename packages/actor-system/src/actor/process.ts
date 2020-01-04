import { nullLogger } from "@yingyeothon/logger";
import ActorShifter from "../shift";
import IAwaiterMeta from "./message/awaiterMeta";
import processLoop, { ActorLoopEnvironment } from "./process/loop";
import IActorProcessOptions from "./process/options";
import { maybeAwait } from "./process/utils";

export type ActorProcessEnvironment<T> = ActorLoopEnvironment<T> & {
  shift?: ActorShifter;
};

export default async function tryToProcess<T>(
  env: ActorProcessEnvironment<T>,
  { oneShot, aliveMillis, shiftable }: IActorProcessOptions = {}
): Promise<IAwaiterMeta[]> {
  const { logger = nullLogger, id, shift } = env;
  const maybeOneShot = oneShot === undefined && aliveMillis === undefined;

  const startMillis = Date.now();
  const isAlive = () =>
    aliveMillis && aliveMillis > 0
      ? Date.now() - startMillis < aliveMillis
      : true;

  const metas: IAwaiterMeta[] = [];
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
