import { LogWriter } from "@yingyeothon/logger";
import IAwaiterResolve from "@yingyeothon/actor-system/lib/awaiter/resolve";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
export default function resolve({ connection, keyPrefix, logger, }: {
    connection: RedisConnection;
    keyPrefix?: string;
    logger?: LogWriter;
}): IAwaiterResolve;
