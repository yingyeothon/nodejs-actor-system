import { Codec } from "@yingyeothon/codec";
import { LogWriter } from "@yingyeothon/logger";
import QueueProducer from "@yingyeothon/actor-system/lib/queue/producer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function push({ connection, keyPrefix, codec, logger, }: {
    connection: RedisConnection;
    keyPrefix?: string;
    codec?: Codec<string>;
    logger?: LogWriter;
}): QueueProducer;
