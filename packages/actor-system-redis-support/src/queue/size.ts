import IQueueLength from "@yingyeothon/actor-system/lib/queue/length";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import llen from "@yingyeothon/naive-redis/lib/llen";

export default function size({
  connection,
  keyPrefix = "",
  logger = nullLogger
}: {
  connection: IRedisConnection;
  keyPrefix?: string;
  logger?: ILogger;
}): IQueueLength {
  return {
    size: async (actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const length = await llen(connection, redisKey);
      logger.debug(`redis-queue`, `size`, redisKey, length);
      return length;
    }
  };
}
