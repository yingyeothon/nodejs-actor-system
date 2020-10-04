import { LogWriter, nullLogger } from "@yingyeothon/logger";
import { Resolved, asRedisKey } from "./basis";

import IAwaiterWait from "@yingyeothon/actor-system/lib/awaiter/wait";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import get from "@yingyeothon/naive-redis/lib/get";

const SleepIntervalMillisForAwaiting = 50;

const sleep = (millis: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, millis));

export default function wait({
  connection,
  keyPrefix = "",
  logger = nullLogger,
}: {
  connection: RedisConnection;
  keyPrefix?: string;
  logger?: LogWriter;
}): IAwaiterWait {
  return {
    wait: async (actorId: string, messageId: string, timeoutMillis: number) => {
      logger.debug(`redis-awaiter`, `wait`, messageId, timeoutMillis);
      if (timeoutMillis <= 0) {
        return false;
      }

      const redisKey = asRedisKey(keyPrefix, actorId, messageId);
      const start = Date.now();
      return new Promise<boolean>(async (resolve, reject) => {
        try {
          let remainMillis = 0;
          do {
            const value = await get(connection, redisKey);
            remainMillis = start + timeoutMillis - Date.now();

            logger.debug(
              `redis-awaiter`,
              `wait`,
              redisKey,
              value,
              remainMillis
            );
            if (value === Resolved) {
              return resolve(true);
            }

            await sleep(Math.min(SleepIntervalMillisForAwaiting, remainMillis));
          } while (remainMillis > 0);
          return resolve(false);
        } catch (error) {
          reject(error);
        }
      });
    },
  };
}
