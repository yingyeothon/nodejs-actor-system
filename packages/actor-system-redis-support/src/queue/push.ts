import { Codec, JsonCodec } from "@yingyeothon/codec";
import { LogWriter, nullLogger } from "@yingyeothon/logger";

import QueueProducer from "@yingyeothon/actor-system/lib/queue/producer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import redisRpush from "@yingyeothon/naive-redis/lib/rpush";

export default function push({
  connection,
  keyPrefix = "",
  codec = new JsonCodec(),
  logger = nullLogger,
}: {
  connection: RedisConnection;
  keyPrefix?: string;
  codec?: Codec<string>;
  logger?: LogWriter;
}): QueueProducer {
  return {
    push: async function <T>(actorId: string, item: T) {
      const redisKey = keyPrefix + actorId;
      const pushed = await redisRpush(connection, redisKey, codec.encode(item));
      logger.debug(`redis-queue`, `push`, redisKey, item, pushed);
    },
  };
}
