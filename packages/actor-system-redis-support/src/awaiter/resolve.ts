import { LogWriter, nullLogger } from "@yingyeothon/logger";
import { Resolved, asRedisKey } from "./basis";

import IAwaiterResolve from "@yingyeothon/actor-system/lib/awaiter/resolve";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import set from "@yingyeothon/naive-redis/lib/set";

const TimeoutMillisForResolved = 1000;

export default function resolve({
  connection,
  keyPrefix = "",
  logger = nullLogger,
}: {
  connection: RedisConnection;
  keyPrefix?: string;
  logger?: LogWriter;
}): IAwaiterResolve {
  return {
    resolve: async (actorId: string, messageId: string) => {
      const redisKey = asRedisKey(keyPrefix, actorId, messageId);
      try {
        const success = await set(connection, redisKey, Resolved, {
          expirationMillis: TimeoutMillisForResolved,
        });
        logger.debug(`redis-awaiter`, `resolve`, redisKey, success);
      } catch (error) {
        logger.debug(`redis-awaiter`, `resolve`, redisKey, `error`, error);
      }
    },
  };
}
