import ILockAcquire from "@yingyeothon/actor-system/lib/lock/tryAcquire";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import set from "@yingyeothon/naive-redis/lib/set";

const locked = "1";

export default function tryAcquire({
  connection,
  keyPrefix,
  logger = nullLogger,
  lockTimeout = -1
}: {
  connection: IRedisConnection;
  keyPrefix?: string;
  logger?: ILogger;
  lockTimeout?: number;
}): ILockAcquire {
  return {
    tryAcquire: async (actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const success = await set(connection, redisKey, locked, {
        expirationMillis: lockTimeout > 0 ? lockTimeout : undefined,
        onlySet: "nx"
      });

      logger.debug(`redis-lock`, `try-acquire`, redisKey, success);
      return success;
    }
  };
}
