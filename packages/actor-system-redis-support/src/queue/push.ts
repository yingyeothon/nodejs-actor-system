import IQueueProducer from "@yingyeothon/actor-system/lib/queue/producer";
import { ICodec, JsonCodec } from "@yingyeothon/codec";
import { ILogger, nullLogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import rpush from "@yingyeothon/naive-redis/lib/rpush";

export default function push({
  connection,
  keyPrefix = "",
  codec = new JsonCodec(),
  logger = nullLogger
}: {
  connection: IRedisConnection;
  keyPrefix?: string;
  codec?: ICodec<string>;
  logger?: ILogger;
}): IQueueProducer {
  return {
    push: <T>(actorId: string, item: T) => {
      const redisKey = keyPrefix + actorId;
      return rpush(connection, redisKey, codec.encode(item)).then(pushed => {
        logger.debug(`redis-queue`, `push`, redisKey, item, pushed);
      });
    }
  };
}
