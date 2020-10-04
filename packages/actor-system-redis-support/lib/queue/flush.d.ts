import { Codec } from "@yingyeothon/codec";
import { LogWriter } from "@yingyeothon/logger";
import QueueBulkConsumer from "@yingyeothon/actor-system/lib/queue/bulkConsumer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function flush({ connection, keyPrefix, codec, logger, }: {
    connection: RedisConnection;
    keyPrefix?: string;
    codec?: Codec<string>;
    logger?: LogWriter;
}): QueueBulkConsumer;
