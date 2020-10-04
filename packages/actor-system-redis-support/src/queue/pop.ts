import { Codec, JsonCodec } from "@yingyeothon/codec";
import { LogWriter, nullLogger } from "@yingyeothon/logger";

import QueueSingleConsumer from "@yingyeothon/actor-system/lib/queue/singleConsumer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import redisLindex from "@yingyeothon/naive-redis/lib/lindex";
import redisLpop from "@yingyeothon/naive-redis/lib/lpop";

export default function pop({
  connection,
  keyPrefix = "",
  codec = new JsonCodec(),
  logger = nullLogger,
}: {
  connection: RedisConnection;
  keyPrefix?: string;
  codec?: Codec<string>;
  logger?: LogWriter;
}): QueueSingleConsumer {
  return {
    pop: async <T>(actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const value = await redisLpop(connection, redisKey);
      if (value === null) {
        return null;
      }
      const decoded = codec.decode<T>(value);
      logger.debug(`redis-queue`, `pop`, redisKey, decoded);
      return decoded;
    },
    peek: async <T>(actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const value = await redisLindex(connection, redisKey, 0);
      if (value === null) {
        return null;
      }
      const decoded = codec.decode<T>(value);
      logger.debug(`redis-queue`, `peek`, redisKey, decoded);
      return decoded;
    },
  };
}
