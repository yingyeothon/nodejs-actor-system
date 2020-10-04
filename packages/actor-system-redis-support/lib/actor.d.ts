import { LogWriter } from "@yingyeothon/logger";
import { RedisAwaiter } from "./awaiter";
import { RedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import { RedisLock } from "./lock";
import { RedisQueue } from "./queue";
interface RedisOptions {
    connection: RedisConnection;
    keyPrefix?: string;
    logger?: LogWriter;
}
export declare function newRedisSubsystem({ connection, keyPrefix, logger, }: RedisOptions): {
    queue: RedisQueue;
    lock: RedisLock;
    awaiter: RedisAwaiter;
};
export {};
