import IQueueSingleConsumer from "@yingyeothon/actor-system/lib/queue/singleConsumer";
import { ICodec, JsonCodec } from "@yingyeothon/codec";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import lindex from "@yingyeothon/naive-redis/lib/lindex";
import lpop from "@yingyeothon/naive-redis/lib/lpop";

export default function pop({
  connection,
  keyPrefix = "",
  codec = new JsonCodec(),
  logger = nullLogger
}: {
  connection: IRedisConnection;
  keyPrefix?: string;
  codec?: ICodec<string>;
  logger?: ILogger;
}): IQueueSingleConsumer {
  return {
    pop: async <T>(actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const value = await lpop(connection, redisKey);
      if (value === null) {
        return null;
      }
      const decoded = codec.decode<T>(value);
      logger.debug(`redis-queue`, `pop`, redisKey, decoded);
      return decoded;
    },
    peek: async <T>(actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const value = await lindex(connection, redisKey, 0);
      if (value === null) {
        return null;
      }
      const decoded = codec.decode<T>(value);
      logger.debug(`redis-queue`, `peek`, redisKey, decoded);
      return decoded;
    }
  };
}
