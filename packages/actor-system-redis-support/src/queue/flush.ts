import { Codec, JsonCodec } from "@yingyeothon/codec";
import { LogWriter, nullLogger } from "@yingyeothon/logger";

import QueueBulkConsumer from "@yingyeothon/actor-system/lib/queue/bulkConsumer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import redisLrange from "@yingyeothon/naive-redis/lib/lrange";
import redisLtrim from "@yingyeothon/naive-redis/lib/ltrim";

export default function flush({
  connection,
  keyPrefix = "",
  codec = new JsonCodec(),
  logger = nullLogger,
}: {
  connection: RedisConnection;
  keyPrefix?: string;
  codec?: Codec<string>;
  logger?: LogWriter;
}): QueueBulkConsumer {
  return {
    flush: async <T>(actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const values: string[] = await redisLrange(connection, redisKey, 0, -1);
      if (!values || values.length === 0) {
        logger.debug(`redis-queue`, `flush`, redisKey, `empty`);
        return [];
      }

      const decoded = values.map((value) => codec.decode<T>(value));
      logger.debug(`redis-queue`, `flush`, redisKey, decoded);

      await redisLtrim(connection, redisKey, values.length, -1);
      return decoded;
    },
  };
}
