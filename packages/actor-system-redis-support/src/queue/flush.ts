import IQueueBulkConsumer from "@yingyeothon/actor-system/lib/queue/bulkConsumer";
import { ICodec, JsonCodec } from "@yingyeothon/codec";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import lrange from "@yingyeothon/naive-redis/lib/lrange";
import ltrim from "@yingyeothon/naive-redis/lib/ltrim";

export default function flush({
  connection,
  keyPrefix = "",
  codec = new JsonCodec(),
  logger = nullLogger
}: {
  connection: IRedisConnection;
  keyPrefix?: string;
  codec?: ICodec<string>;
  logger?: ILogger;
}): IQueueBulkConsumer {
  return {
    flush: async <T>(actorId: string) => {
      const redisKey = keyPrefix + actorId;
      const values: string[] = await lrange(connection, redisKey, 0, -1);
      if (!values || values.length === 0) {
        logger.debug(`redis-queue`, `flush`, redisKey, `empty`);
        return [];
      }

      const decoded = values.map(value => codec.decode<T>(value));
      logger.debug(`redis-queue`, `flush`, redisKey, decoded);

      await ltrim(connection, redisKey, values.length, -1);
      return decoded;
    }
  };
}
