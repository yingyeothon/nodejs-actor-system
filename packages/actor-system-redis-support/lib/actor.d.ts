import { ILogger } from "@yingyeothon/logger";
import { IRedisConnection } from "@yingyeothon/naive-redis/lib/connection";
import { RedisAwaiter } from "./awaiter";
import { RedisLock } from "./lock";
import { RedisQueue } from "./queue";
interface IRedisOptions {
    connection: IRedisConnection;
    keyPrefix?: string;
    logger?: ILogger;
}
export declare const newRedisSubsystem: ({ connection, keyPrefix, logger }: IRedisOptions) => {
    queue: RedisQueue;
    lock: RedisLock;
    awaiter: RedisAwaiter;
};
export {};
