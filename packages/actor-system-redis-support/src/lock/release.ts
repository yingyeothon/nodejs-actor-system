import ILockRelease from "@yingyeothon/actor-system/lib/lock/release";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import del from "@yingyeothon/naive-redis/lib/del";

export default function release({
  connection,
  keyPrefix,
  logger = nullLogger
}: {
  connection: IRedisConnection;
  keyPrefix?: string;
  logger?: ILogger;
  lockTimeout?: number;
}): ILockRelease {
  return {
    release: async (actorId: string) => {
      const redisKey = keyPrefix + actorId;
      await del(connection, redisKey);
      logger.debug(`redis-lock`, `release`, redisKey);
      return true;
    }
  };
}
