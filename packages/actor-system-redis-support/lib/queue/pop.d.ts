import { Codec } from "@yingyeothon/codec";
import { LogWriter } from "@yingyeothon/logger";
import QueueSingleConsumer from "@yingyeothon/actor-system/lib/queue/singleConsumer";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function pop({ connection, keyPrefix, codec, logger, }: {
    connection: RedisConnection;
    keyPrefix?: string;
    codec?: Codec<string>;
    logger?: LogWriter;
}): QueueSingleConsumer;
