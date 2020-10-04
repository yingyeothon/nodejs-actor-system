import { LogWriter } from "@yingyeothon/logger";
import IAwaiterWait from "@yingyeothon/actor-system/lib/awaiter/wait";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function wait({ connection, keyPrefix, logger, }: {
    connection: RedisConnection;
    keyPrefix?: string;
    logger?: LogWriter;
}): IAwaiterWait;
