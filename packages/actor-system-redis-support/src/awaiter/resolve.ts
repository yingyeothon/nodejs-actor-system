import IAwaiterResolve from "@yingyeothon/actor-system/lib/awaiter/resolve";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import set from "@yingyeothon/naive-redis/lib/set";
import { asRedisKey, Resolved } from "./basis";

const TimeoutMillisForResolved = 1000;

export default function resolve({
  connection,
  keyPrefix = "",
  logger = nullLogger
}: {
  connection: IRedisConnection;
  keyPrefix?: string;
  logger?: ILogger;
}): IAwaiterResolve {
  return {
    resolve: async (actorId: string, messageId: string) => {
      const redisKey = asRedisKey(keyPrefix, actorId, messageId);
      try {
        const success = await set(connection, redisKey, Resolved, {
          expirationMillis: TimeoutMillisForResolved
        });
        logger.debug(`redis-awaiter`, `resolve`, redisKey, success);
      } catch (error) {
        logger.debug(`redis-awaiter`, `resolve`, redisKey, `error`, error);
      }
    }
  };
}
