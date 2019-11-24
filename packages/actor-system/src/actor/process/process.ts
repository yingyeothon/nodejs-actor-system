import { nullLogger } from "@yingyeothon/logger";
import { ActorEnvironment } from "../env";
import { IAwaiterMeta } from "../message";
import { processLoop } from "./loop";
import { IActorProcessOptions } from "./options";
import { maybeAwait } from "./utils";

export const tryToProcess = async <T>(
  env: ActorEnvironment<T>,
  { oneShot, aliveMillis, shiftable }: IActorProcessOptions = {}
): Promise<IAwaiterMeta[]> => {
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
};
