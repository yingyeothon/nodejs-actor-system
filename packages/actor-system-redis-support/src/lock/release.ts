import { LogWriter, nullLogger } from "@yingyeothon/logger";

import LockRelease from "@yingyeothon/actor-system/lib/lock/release";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import del from "@yingyeothon/naive-redis/lib/del";

export default function release({
  connection,
  keyPrefix,
  logger = nullLogger,
}: {
  connection: RedisConnection;
  keyPrefix?: string;
  logger?: LogWriter;
  lockTimeout?: number;
}): LockRelease {
  return {
    release: async (actorId: string) => {
      const redisKey = keyPrefix + actorId;
      await del(connection, redisKey);
      logger.debug(`redis-lock`, `release`, redisKey);
      return true;
    },
  };
}
