import { LogWriter } from "@yingyeothon/logger";
import QueueLength from "@yingyeothon/actor-system/lib/queue/length";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function size({ connection, keyPrefix, logger, }: {
    connection: RedisConnection;
    keyPrefix?: string;
    logger?: LogWriter;
}): QueueLength;
