import { LogWriter, nullLogger } from "@yingyeothon/logger";

import QueueLength from "@yingyeothon/actor-system/lib/queue/length";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import redisLlen from "@yingyeothon/naive-redis/lib/llen";

export default function size({
  connection,
  keyPrefix = "",
  logger = nullLogger,
}: {
  connection: RedisConnection;
  keyPrefix?: string;
  logger?: LogWriter;
}): QueueLength {
  return {
    size: async (actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const length = await redisLlen(connection, redisKey);
      logger.debug(`redis-queue`, `size`, redisKey, length);
      return length;
    },
  };
}
